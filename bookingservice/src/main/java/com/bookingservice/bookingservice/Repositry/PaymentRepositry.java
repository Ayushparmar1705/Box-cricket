package com.bookingservice.bookingservice.Repositry;

import com.bookingservice.bookingservice.Model.PaymentModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepositry extends JpaRepository<PaymentModel, Integer> {

    Optional<PaymentModel> findByRazorpayOrderId(String razorpayOrderId);

    Optional<PaymentModel> findByRazorpayPaymentId(String razorpayPaymentId);

    Optional<PaymentModel> findByBookingId(int bookingId);
}
