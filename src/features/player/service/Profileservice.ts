import Api from "../../../Api";
import type { OwnerFormData } from "../hook/useProfile";

const ProfileService = {
    submitBusinessdetails: async (form: OwnerFormData, userId: string) => {

        // Map the File objects into the structure the backend expects 
        // e.g. { AADHAR: { url: "..." } }
        // Note: For a real app, you would upload the files to S3/Cloudinary first, 
        // and put the real returned URLs here.
        const documentsPayload: Record<string, { url: string }> = {};

        Object.entries(form.documents).forEach(([key, file]) => {
            if (file) {
                documentsPayload[key] = { url: `mock_url_for_${file.name}` };
            }
        });

        const payload = {
            user_id: userId,
            business_name: form.business_name,
            business_type: form.business_type,
            gst_number: form.gst_number,
            documents: documentsPayload
        };

        const result = await fetch(Api.becomeOwner, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await result.json();

        if (!result.ok) {
            throw new Error(data.message || "Failed to submit request");
        }

        return data;
    }
}

export default ProfileService;