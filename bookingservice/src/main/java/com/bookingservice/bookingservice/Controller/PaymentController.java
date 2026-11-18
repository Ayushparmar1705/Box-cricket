package com.bookingservice.bookingservice.Controller;

import com.bookingservice.bookingservice.Service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    // 1. Create Razorpay Order
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
        try {
            int bookingId = Integer.parseInt(request.get("bookingId").toString());
            BigDecimal amount = new BigDecimal(request.get("amount").toString());

            Map<String, Object> response = paymentService.createOrder(bookingId, amount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 2. Verify Razorpay Payment Signature
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) {
        try {
            String razorpayOrderId = request.get("razorpay_order_id");
            String razorpayPaymentId = request.get("razorpay_payment_id");
            String razorpaySignature = request.get("razorpay_signature");

            boolean isSuccess = paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

            if (isSuccess) {
                return ResponseEntity.ok(Map.of(
                        "status", "SUCCESS",
                        "message", "Payment verified and booking confirmed successfully!"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                        "status", "FAILED",
                        "message", "Invalid payment signature"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 3. Official Razorpay Checkout Screen for Mobile & Web
    @GetMapping(value = "/checkout", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> getCheckoutPage(
            @RequestParam int bookingId,
            @RequestParam String orderId,
            @RequestParam long amount,
            @RequestParam String keyId,
            @RequestParam(required = false, defaultValue = "") String redirectUrl) {

        long amountInRupees = amount / 100;
        String html = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Razorpay Checkout</title>
                <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background: #F3F4F6;
                    }
                    .box {
                        background: white;
                        border-radius: 16px;
                        padding: 28px;
                        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
                        text-align: center;
                        max-width: 340px;
                        width: 88%%;
                    }
                    .title { font-size: 20px; font-weight: 700; color: #183D30; margin-bottom: 8px; }
                    .amount { font-size: 28px; font-weight: 800; color: #10B981; margin: 12px 0; }
                    .sub { color: #6B7280; font-size: 14px; margin-bottom: 24px; }
                    .pay-btn {
                        background: #183D30;
                        color: white;
                        border: none;
                        padding: 14px 20px;
                        border-radius: 10px;
                        font-size: 16px;
                        font-weight: 700;
                        width: 100%%;
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <div class="box" id="content">
                    <div class="title">Box Cricket Booking</div>
                    <div class="sub">Booking #%d</div>
                    <div class="amount">&#8377;%d</div>
                    <button class="pay-btn" id="pay-btn">Open Razorpay</button>
                </div>
                <script>
                    var redirectUrl = "%s";
                    var options = {
                        "key": "%s",
                        "amount": "%d",
                        "currency": "INR",
                        "name": "Box Cricket Turf",
                        "description": "Court Booking #%d",
                        "order_id": "%s",
                        "handler": function (response){
                            document.getElementById('content').innerHTML = '<h3 style="color:#183D30;">Verifying payment...</h3>';
                            fetch('/api/payments/verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                })
                            })
                            .then(function(res) { return res.json(); })
                            .then(function(data) {
                                document.getElementById('content').innerHTML =
                                    '<div style="font-size:48px; color:#10B981; margin-bottom:12px;">&#10004;</div>' +
                                    '<div class="title" style="color:#10B981;">Payment Successful!</div>' +
                                    '<p class="sub">Returning to Box Cricket app...</p>';
                                if (redirectUrl && redirectUrl.length > 0) {
                                    setTimeout(function() {
                                        window.location.href = redirectUrl;
                                    }, 800);
                                }
                            })
                            .catch(function(err) {
                                document.getElementById('content').innerHTML =
                                    '<div class="title" style="color:#EF4444;">Verification Failed</div>' +
                                    '<p class="sub">' + err + '</p>';
                            });
                        },
                        "theme": {
                            "color": "#183D30"
                        }
                    };
                    var rzp = new Razorpay(options);
                    document.getElementById('pay-btn').onclick = function(){
                        rzp.open();
                    };
                    window.onload = function() {
                        setTimeout(function(){ rzp.open(); }, 500);
                    };
                </script>
            </body>
            </html>
            """.formatted(bookingId, amountInRupees, redirectUrl, keyId, amount, bookingId, orderId);

        return ResponseEntity.ok(html);
    }
}
