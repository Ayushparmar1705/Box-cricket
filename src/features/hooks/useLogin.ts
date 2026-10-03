import { useState } from 'react';
import { loginAdmin } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (!email.trim()) {
        toast.error("Please enter email");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        toast.error("Please enter a valid email address");
        return;
      }
      if (!password.trim()) {
        toast.error("Please enter password");
        return;
      }

      const data = await loginAdmin(email, password);
      if (data && data.token) {
        // Save the token for authenticated API requests
        localStorage.setItem('token', data.token);
        if (data.role) localStorage.setItem('role', data.role);

        toast.success('Logged in successfully');
        navigate('/admindashboard');
      } else {
        toast.error('Invalid credentials');
        navigate('/admin-login');
      }
    } catch (err: any) {
      const message = err.message || 'An unexpected error occurred';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    handleSubmit,
    isLoading, error
  };
};
