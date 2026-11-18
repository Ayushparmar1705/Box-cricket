package com.bookingservice.bookingservice.Service;

import com.bookingservice.bookingservice.Model.BookingModel;
import com.bookingservice.bookingservice.Repositry.BookingRepositry;
import lombok.RequiredArgsConstructor;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final RedissonClient redissonClient;
    private final BookingRepositry bookingRepositry;

    public BookingModel createBooking(BookingModel booking) {

        int courtId = booking.getCourtId();
        LocalDate bookingDate = booking.getBookingDate();
        LocalTime newStartTime = booking.getStartTime();

        // Calculate new booking's end time as a temporary local variable
        int duration = booking.getDuration() > 0 ? booking.getDuration() : 1;
        LocalTime newEndTime = newStartTime.plusHours(duration);

        // Lock for this specific court & date
        String lockKey = "lock:court:" + courtId + ":" + bookingDate;
        RLock lock = redissonClient.getLock(lockKey);

        try {
            boolean isLocked = lock.tryLock(5, 10, TimeUnit.SECONDS);

            if (!isLocked) {
                throw new RuntimeException("Another booking is in progress for this court. Please try again.");
            }

            // Check existing bookings for overlap
            List<BookingModel> existingBookings = bookingRepositry.findByCourtIdAndBookingDate(courtId, bookingDate);

            for (BookingModel existing : existingBookings) {
                if ("CANCELLED".equalsIgnoreCase(existing.getBookingStatus()) ||
                        "FAILED".equalsIgnoreCase(existing.getBookingStatus())) {
                    continue;
                }

                LocalTime existingStart = existing.getStartTime();
                int existingDuration = existing.getDuration() > 0 ? existing.getDuration() : 1;
                LocalTime existingEnd = existingStart.plusHours(existingDuration);

                // Check Overlap: (newStart < existingEnd) AND (newEnd > existingStart)
                boolean isOverlapping = newStartTime.isBefore(existingEnd) && newEndTime.isAfter(existingStart);

                if (isOverlapping) {
                    throw new RuntimeException(
                            "This slot is already booked from " + existingStart + " to " + existingEnd);
                }
            }

            booking.setBookingStatus("PENDING");
            return bookingRepositry.save(booking);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Booking request was interrupted. Please try again.");
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    public List<BookingModel> getAllBookings() {
        return bookingRepositry.findAll();
    }

    public BookingModel getBookingById(int id) {
        return bookingRepositry.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));
    }

    public List<BookingModel> getBookingsByCourtAndDate(int courtId, LocalDate bookingDate) {
        return bookingRepositry.findByCourtIdAndBookingDate(courtId, bookingDate);
    }

    public List<BookingModel> getBookingsByUserId(int userId) {
        return bookingRepositry.findByUserId(userId);
    }

    public BookingModel cancelBooking(int id, int cancelledBy, String reason) {
        BookingModel booking = getBookingById(id);
        booking.setBookingStatus("CANCELLED");
        booking.setCancelledBy(cancelledBy);
        booking.setCancellationReason(reason);
        return bookingRepositry.save(booking);
    }
}