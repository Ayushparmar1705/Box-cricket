const LIVE_URL = {
    auth_service: "https://backend-auth-service-i2yw.onrender.com",
    category_service: "https://backend-category-service-em9j.onrender.com",
    venue_service: "https://backend-facility-service.onrender.com",
    // Docker exposed port for Booking & Payment Service (3038 -> container 8088)
    booking_service: "http://192.168.1.4:3038",
};

export default LIVE_URL;

