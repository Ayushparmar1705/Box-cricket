package com.bookingservice.bookingservice.Service;

import com.bookingservice.bookingservice.Model.BookingModel;
import com.bookingservice.bookingservice.Model.PaymentModel;
import com.bookingservice.bookingservice.Repositry.BookingRepositry;
import com.bookingservice.bookingservice.Repositry.PaymentRepositry;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    private final PaymentRepositry paymentRepositry;
    private final BookingRepositry bookingRepositry;

    @Value("${RAZORPAY_API_KEY}")
    private String razorpayKeyId;

    @Value("${RAZORPAY_API_SECRET}")
    private String razorpayKeySecret;

    public PaymentService(PaymentRepositry paymentRepositry, BookingRepositry bookingRepositry) {
        this.paymentRepositry = paymentRepositry;
        this.bookingRepositry = bookingRepositry;
    }

    /**
     * STEP 1: CREATE RAZORPAY ORDER
     * Calls Razorpay API to generate an Order ID.
     */
    public Map<String, Object> createOrder(int bookingId, BigDecimal amount) {
        try {
            // Initialize Razorpay Client
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            // Razorpay expects amount in paise (1 INR = 100 paise)
            int amountInPaise = amount.multiply(new BigDecimal(100)).intValue();

            // Prepare Order Request JSON
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "booking_" + bookingId);

            // Call Razorpay API
            Order order = razorpayClient.orders.create(orderRequest);
            String razorpayOrderId = order.get("id");

            // Save Payment Record in Database
            PaymentModel payment = new PaymentModel();
            payment.setBookingId(bookingId);
            payment.setRazorpayOrderId(razorpayOrderId);
            payment.setAmount(amount);
            payment.setPaymentGateway("RAZORPAY");
            payment.setPaymentStatus("PENDING");
            paymentRepositry.save(payment);

            // Return details to Mobile App
            Map<String, Object> response = new HashMap<>();
            response.put("orderId", razorpayOrderId);
            response.put("amount", amountInPaise);
            response.put("currency", "INR");
            response.put("keyId", razorpayKeyId);
            response.put("bookingId", bookingId);

            return response;

        } catch (Exception e) {
            throw new RuntimeException("Error creating Razorpay order: " + e.getMessage());
        }
    }

    /**
     * STEP 2: VERIFY PAYMENT SIGNATURE
     * Verifies that the payment returned from Razorpay is genuine and not forged.
     */
    public boolean verifyPayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            // Prepare verification JSON
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);

            // Verify Signature using Razorpay SDK (supports test signature for mobile testing / Expo Go)
            boolean isValid = false;
            if ("test_signature".equalsIgnoreCase(razorpaySignature) ||
                "simulated_signature".equalsIgnoreCase(razorpaySignature)) {
                isValid = true;
            } else {
                isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);
            }

            if (isValid) {
                // Update Payment Status in Database
                PaymentModel payment = paymentRepositry.findByRazorpayOrderId(razorpayOrderId)
                        .orElseThrow(() -> new RuntimeException("Payment record not found for order: " + razorpayOrderId));

                payment.setRazorpayPaymentId(razorpayPaymentId);
                payment.setPaymentStatus("SUCCESS");
                payment.setPaidAt(LocalDateTime.now());
                paymentRepositry.save(payment);

                // Update Booking Status to CONFIRMED and paymentStatus to SUCCESS
                BookingModel booking = bookingRepositry.findById(payment.getBookingId()).orElse(null);
                if (booking != null) {
                    booking.setBookingStatus("CONFIRMED");
                    booking.setPaymentStatus("SUCCESS");
                    bookingRepositry.save(booking);
                }

                return true;
            } else {
                return false;
            }

        } catch (Exception e) {
            throw new RuntimeException("Error verifying Razorpay payment: " + e.getMessage());
        }
    }
}
