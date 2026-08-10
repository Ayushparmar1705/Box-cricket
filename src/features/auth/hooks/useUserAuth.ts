import { useState } from 'react';
import toast from 'react-hot-toast';
import UserAuthService from '../service/UserAuthService';

export function useUserAuth(onSuccess: (data?: any) => void) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  const togglePasswordVisiblity = () => {
    setIsHidden(!isHidden);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggleMode = () => {
    setIsLoginMode((prev) => !prev);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      if (isLoginMode) {
        const response = await UserAuthService.login(form.email, form.password);
        const data = await response.json();

        if (response.ok || data.success) {
          toast.success(data.message || 'Login successful!');

          localStorage.setItem("user", JSON.stringify(data));
          onSuccess(data);
        } else {
          toast.error(data.message || 'Login failed. Please check your credentials.');
        }
      } else {
        // Registration
        if (!form.name || !form.email || !form.password || !form.phoneNumber) {
          toast.error('Please fill in all details to register.');
          setLoading(false);
          return;
        }

        const response = await UserAuthService.register(form);
        const data = await response.json();
        if (response.ok || data.success) {
          toast.success(data.message || 'Registration successful! You can now log in.');
          setIsLoginMode(true);
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
    loading,
    isHidden,
    handleChange,
    handleToggleMode,
    handleSubmit,
    togglePasswordVisiblity,
  };
}
