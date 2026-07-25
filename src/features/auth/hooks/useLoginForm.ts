import { useState } from 'react';
import toast from 'react-hot-toast';
import Authservice from '../service/Authservice';

export interface LoginFormState {
  email: string;
  password: string;
}

export const DEMO_ADMIN_CREDENTIALS = {
  email: 'admin@boxcricket.com',
  password: 'Admin@123',
};

export function useLoginForm(onSuccess: () => void) {
  const [form, setForm] = useState<LoginFormState>({
    email: '',
    password: '',
  });
  const [isHidden, setIsHidden] = useState(true);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisiblity = () => {
    setIsHidden(!isHidden);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const result = await Authservice.login(form.email, form.password);
      const data = result.data || result;

      if (data.success || result.success) {
        toast.success(data.message || 'Login successful!');
        localStorage.setItem("user", JSON.stringify(data));
        onSuccess();
      } else {
        toast.error(data.message || 'Login failed. Invalid credentials.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    handleChange,
    loading,
    handleSubmit,
    setForm,
    togglePasswordVisiblity,
    isHidden,
  };
}
