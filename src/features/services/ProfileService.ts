import baseUrl from "../../api/Api";

// ─────────────────────────────────────────────────────────────
// 📝 Types & Interfaces
// ─────────────────────────────────────────────────────────────
// Interface for the Turf Owner Application submission data
export interface Ownerrequest {
    business_name: string;
    business_type: string;
    gstn_number: string;
    state: number | string;
    city: number | string;
    country: number | string;
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
        formData.append("business_type", data.business_type);
        formData.append("gstn_number", data.gstn_number);
        formData.append("city", String(data.city));
        formData.append("state", String(data.state));
        formData.append("country", String(data.country));
        formData.append("contact_number", data.contact_number);
        formData.append("contact_email", data.contact_email);
        formData.append("pan_file", data.pan_card);
        formData.append("adhar_file", data.adhar_card);
        formData.append("userId", String(data.userId));


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

        const response = await result.json();
        return response;
    } catch (error) {
        console.error("Error submitting turf owner request:", error);
        throw error;
    }
};