import { useState } from 'react';
import toast from 'react-hot-toast';
import OwnerAuthService from '../service/OwnerAuthService';

export function useOwnerAuth(onSuccess: () => void) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  const [form, setForm] = useState({
    business_name: '',
    business_type: '',
    gst_number: '',
    admin_remark: '',
    full_name: '',
    email: '',
    password: '',
    phone_number: ''
  });

  const togglePasswordVisiblity = () => {
    setIsHidden(!isHidden);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggleMode = () => {
    setIsLoginMode((prev) => !prev);
    setRegistrationStep(1); // reset step when toggling
  };

  const handleNextStep = () => {
    // Basic validation before moving to step 2
    if (!form.full_name || !form.email || !form.password || !form.phone_number) {
      toast.error('Please fill in all basic details to continue.');
      return;
    }
    setRegistrationStep(2);
  };

  const handlePrevStep = () => setRegistrationStep(1);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      if (isLoginMode) {
        const response = await OwnerAuthService.login(form.email, form.password);
        const data = await response.json();
        
        if (response.ok || data.success) {
          toast.success(data.message || 'Login successful!');
          localStorage.setItem("owner_session", JSON.stringify(data));
          onSuccess();
        } else {
          toast.error(data.message || 'Login failed. Please check your credentials.');
        }
      } else {
        const response = await OwnerAuthService.register(form);
        const data = await response.json();
        
        if (response.ok || data.success) {
          toast.success(data.message || 'Registration successful! You can now log in.');
          setIsLoginMode(true);
          setRegistrationStep(1);
        } else {
          toast.error(data.message || 'Registration failed.');
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    isLoginMode,
    registrationStep,
    loading,
    isHidden,
    handleChange,
    handleToggleMode,
    handleNextStep,
    handlePrevStep,
    handleSubmit,
    togglePasswordVisiblity,
  };
}
