package com.bookingservice.bookingservice.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "venue_id")
    private Integer venueId;

    @Column(name = "court_id")
    private Integer courtId;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "duration")
    private Integer duration; // In hours (e.g. 1, 2)

    @Column(name = "total")
    private BigDecimal total;

    @Column(name = "booking_status")
    private String bookingStatus; // PENDING, CONFIRMED, CANCELLED

    @Column(name = "payment_status")
    private String paymentStatus; // PENDING, SUCCESS, FAILED

    @Column(name = "cancelled_by")
    private Integer cancelledBy;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.bookingStatus == null) {
            this.bookingStatus = "PENDING";
        }
        if (this.paymentStatus == null) {
            this.paymentStatus = "PENDING";
        }
    }
}