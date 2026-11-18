package com.bookingservice.bookingservice.Repositry;

import com.bookingservice.bookingservice.Model.BookingModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepositry extends JpaRepository<BookingModel, Integer> {

    // Find all bookings for a specific court on a given date
    List<BookingModel> findByCourtIdAndBookingDate(int courtId, LocalDate bookingDate);

    // Find all bookings by user
    List<BookingModel> findByUserId(int userId);

    // Find all bookings by venue
    List<BookingModel> findByVenueId(int venueId);
}
