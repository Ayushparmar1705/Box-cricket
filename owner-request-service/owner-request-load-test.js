import http from "k6/http";
import crypto from "k6/crypto";
import encoding from "k6/encoding";
import { check, sleep } from "k6";

// JWT Generation Helper Functions
const algToHash = {
    HS256: "sha256",
    HS384: "sha384",
    HS512: "sha512"
};

function sign(data, hashAlg, secret) {
    let hasher = crypto.createHMAC(hashAlg, secret);
    hasher.update(data);
    return hasher.digest("base64rawurl");
}

function generateJWT(payload, secret, algorithm = "HS256") {
    let header = encoding.b64encode(JSON.stringify({ typ: "JWT", alg: algorithm }), "rawurl");
    let encodedPayload = encoding.b64encode(JSON.stringify(payload), "rawurl");
    let signature = sign(header + "." + encodedPayload, algToHash[algorithm], secret);
    return [header, encodedPayload, signature].join(".");
}

// 1. Generate JWT Token
// The JWT secret defined in JwtAuthenticationFilter.java
const JWT_SECRET = "my-super-secret-key-my-super-secret-key-123456";

// Subject needs to be a parseable User ID string (e.g. "123")
const mockPayload = {
    sub: "123",
    role: "ADMIN",
    exp: Math.floor(Date.now() / 1000) + 3600 // Valid for 1 hour
};

const authToken = generateJWT(mockPayload, JWT_SECRET);

// 2. Load Testing Options
export const options = {
    stages: [
        { duration: "10s", target: 20 },  // Ramp-up to 20 virtual users (VUs)
        { duration: "20s", target: 50 },   // Scale up to 50 VUs
        { duration: "20s", target: 100 },  // Scale up to 100 VUs (Peak load)
        { duration: "10s", target: 0 }    // Ramp-down to 0 VUs
    ],
    thresholds: {
        http_req_failed: ["rate<0.01"],  // Error rate must be less than 1%
        http_req_duration: ["p(95)<500"] // 95% of requests must complete under 500ms
    }
};

// Target URL: Set via environment variable, or fallback to docker-network URL
const BASE_URL = __ENV.BASE_URL || "http://owner-request-service:8081";

export default function () {
    const params = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        }
    };

    // --- TEST SCENARIO 1: View (Get) all owner requests ---
    const getRes = http.get(`${BASE_URL}/api/owner-requests`, params);
    
    check(getRes, {
        "GET status is 200": (r) => r.status === 200,
        "GET duration <= 500ms": (r) => r.timings.duration <= 500
    });

    sleep(1);

    // --- TEST SCENARIO 2: Create (Post) a new request (with random data to avoid collisions) ---
    // Uncomment this section if you also want to load test the writes
    /*
    const payload = JSON.stringify({
        businessName: `Box Cricket Club ${Math.floor(Math.random() * 100000)}`,
        businessType: "Turf",
        gstNumber: `24GSTIN${Math.floor(Math.random() * 900000 + 100000)}F1Z5`
    });

    const postRes = http.post(`${BASE_URL}/api/owner-requests`, payload, params);

    check(postRes, {
        "POST status is 200": (r) => r.status === 200,
        "POST duration <= 500ms": (r) => r.timings.duration <= 500
    });

    sleep(1);
    */
}
