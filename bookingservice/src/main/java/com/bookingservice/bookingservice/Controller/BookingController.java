package com.bookingservice.bookingservice.Controller;

import com.bookingservice.bookingservice.Model.BookingModel;
import com.bookingservice.bookingservice.Service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    // 1. Create a new booking
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingModel booking) {
        try {
            BookingModel savedBooking = bookingService.createBooking(booking);
            return new ResponseEntity<>(savedBooking, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. Get all bookings
    @GetMapping
    public ResponseEntity<List<BookingModel>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // 3. Get single booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable int id) {
        try {
            return ResponseEntity.ok(bookingService.getBookingById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 4. Get bookings for a court on a date
    @GetMapping("/court/{courtId}")
    public ResponseEntity<List<BookingModel>> getCourtBookings(
            @PathVariable int courtId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate queryDate = (date != null) ? date : LocalDate.now();
        return ResponseEntity.ok(bookingService.getBookingsByCourtAndDate(courtId, queryDate));
    }

    // 5. Get bookings by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingModel>> getUserBookings(@PathVariable int userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    // 6. Cancel a booking
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable int id,
            @RequestParam(defaultValue = "1") int cancelledBy,
            @RequestParam(defaultValue = "User cancelled booking") String reason) {
        try {
            return ResponseEntity.ok(bookingService.cancelBooking(id, cancelledBy, reason));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
