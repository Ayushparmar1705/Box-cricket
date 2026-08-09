import { useState } from 'react';
import ProfileService from '../service/Profileservice';
import toast from 'react-hot-toast';


export interface OwnerFormData {
    business_name: string;
    business_type: string;
    gst_number: string;
    documents: {
        AADHAR: File | null;
        PAN: File | null;
        GST: File | null;
        SHOP_LICENSE: File | null;
    };
}

export default function useProfile() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const [form, setForm] = useState<OwnerFormData>({
        business_name: '',
        business_type: '',
        gst_number: '',
        documents: {
            AADHAR: null,
            PAN: null,
            GST: null,
            SHOP_LICENSE: null,
        }
    });

    // Fetch user from localStorage
    const userStr = localStorage.getItem('user');
    // The response structure is { success, message, data: { token, user: { ... } } }
    const user = userStr ? JSON.parse(userStr)?.data?.user : null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (docType: keyof OwnerFormData['documents'], e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setForm(prev => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    [docType]: file
                }
            }));
        }
    };

    const handleNext = (e?: React.MouseEvent | React.FormEvent) => {
        if (e) e.preventDefault();
        setStep(2);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent submission if we are still on Step 1 (e.g. user pressed Enter)
        if (step === 1) {
            setStep(2);
            return;
        }

        if (!user || !user.id) {
            toast.error("Please log in again. Your user session is missing or expired.");
            return;
        }

        setLoading(true);
        try {
            const result = await ProfileService.submitBusinessdetails(form, user?.id || '');
            if (result) {
                toast.success(result.message || "Request submitted successfully!");
                setIsModalOpen(false);
                setStep(1);
                // Optional: Reset form state here
            }
        } catch (e: any) {
            toast.error(e.message || "Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        isModalOpen,
        setIsModalOpen,
        loading,
        step,
        setStep,
        form,
        handleChange,
        handleFileChange,
        handleNext,
        handleSubmit
    };
}
