import { useState } from 'react';
import { loginAdmin } from '../services/authService';
import { useNavigate } from 'react-router-dom';

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
      const data = await loginAdmin(email, password);
      if (data && data.token) {
        // Save the token for authenticated API requests
        localStorage.setItem('token', data.token);
        if (data.role) localStorage.setItem('role', data.role);
        
        navigate('/admindashboard');
      } else {
        navigate('/admin-login');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
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
