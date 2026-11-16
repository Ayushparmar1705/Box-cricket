import baseUrl from "../../api/Api";

// ─────────────────────────────────────────────────────────────
// 📝 Types & Interfaces
// ─────────────────────────────────────────────────────────────
// Interface for the Turf Owner Application submission data
export interface Ownerrequest {
    business_name: string;
    business_type: string;
    gstn_number: string;
    contact_email: string;
    contact_number: string;
    pan_card: File;
    adhar_card: File;
    userId?: number;
}
// ─────────────────────────────────────────────────────────────
// 🚀 API Call Function
// ─────────────────────────────────────────────────────────────
/**
 * OwnerrequestApi: Sends the owner application form and document files to backend server.
 * @param data - Ownerrequest object containing business details and uploaded document files.
 */
export const OwnerrequestApi = async (data: Ownerrequest) => {
    try {
        // Create FormData object to send text inputs + binary file uploads together
        const formData = new FormData();
        formData.append("business_name", data.business_name);

        let bType = (data.business_type || "SOLO").toUpperCase().trim();
        if (bType.includes("PARTNER") || bType.includes("PATNER")) {
            bType = "PATNERSHIP";
        } else {
            bType = "SOLO";
        }
        formData.append("business_type", bType);

        formData.append("gstn_number", data.gstn_number);
        formData.append("contact_number", data.contact_number);
        formData.append("contact_email", data.contact_email);
        formData.append("pan_file", data.pan_card);
        formData.append("adhar_file", data.adhar_card);

        if (data.userId !== undefined && data.userId !== null && !isNaN(Number(data.userId))) {
            formData.append("user_id", String(data.userId));
            formData.append("userId", String(data.userId));
            formData.append("id", String(data.userId));
        }

        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        // API POST request to save profile / owner application
        const result = await fetch(baseUrl.profile + "/api/owner-request", {
            method: "POST",
            headers: headers,
            body: formData,
        });

        const response = await result.json().catch(() => ({}));
        if (!result.ok) {
            return {
                success: false,
                message: response.message || response.error || (result.status === 403 ? "You must be logged in as a Player to submit an owner request" : "Failed to submit request"),
                data: response
            };
        }
        return response;
    } catch (error) {
        console.error("Error submitting turf owner request:", error);
        throw error;
    }
};

/**
 * getOwnerRequestsApi: Fetches all turf owner application requests for Super Admin.
 */
export const getOwnerRequestsApi = async () => {
    try {
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const result = await fetch(baseUrl.profile + "/api/owner-request", {
            method: "GET",
            headers: headers,
        });

        const response = await result.json().catch(() => ({}));
        if (!result.ok) {
            const errorMsg =
                response.message ||
                response.error ||
                (result.status === 403
                    ? "Access denied: Super Admin role required"
                    : "Failed to fetch owner requests");
            throw new Error(errorMsg);
        }
        return response;
    } catch (error) {
        console.error("Error fetching owner requests:", error);
        throw error;
    }
};

/**
 * approveOwnerRequestApi: Approves owner request and grants OWNER role to the user.
 */
export const approveOwnerRequestApi = async (id: number | string, remark: string = "") => {
    try {
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const result = await fetch(`${baseUrl.profile}/api/owner-request/approve/${id}?remark=${encodeURIComponent(remark)}`, {
            method: "PUT",
            headers: headers,
        });

        return await result.json();
    } catch (error) {
        console.error("Error approving owner request:", error);
        throw error;
    }
};

/**
 * rejectOwnerRequestApi: Rejects owner request.
 */
export const rejectOwnerRequestApi = async (id: number | string, remark: string = "") => {
    try {
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const result = await fetch(`${baseUrl.profile}/api/owner-request/reject/${id}?remark=${encodeURIComponent(remark)}`, {
            method: "PUT",
            headers: headers,
        });

        return await result.json();
    } catch (error) {
        console.error("Error rejecting owner request:", error);
        throw error;
    }
};

/**
 * getMyOwnerRequestApi: Fetches the logged-in user's own owner verification request status.
 */
export const getMyOwnerRequestApi = async (userId: number | string) => {
    try {
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const result = await fetch(`${baseUrl.profile}/api/owner-request/my-request?userId=${userId}`, {
            method: "GET",
            headers: headers,
        });

        return await result.json();
    } catch (error) {
        console.error("Error fetching my owner request:", error);
        throw error;
    }
};

