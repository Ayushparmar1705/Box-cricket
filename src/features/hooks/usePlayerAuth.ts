import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createProfile, loginAdmin } from '../services/authService';

export const usePlayerAuth = () => {

  // Shared state
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Signup fields (only name, email, phone, password)
  const [signupFormData, setSignupFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  })
  const navigate = useNavigate();



  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSignupFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }






  const handleSignup = async () => {
    const result = await createProfile(signupFormData);

    if (result.success) {
      toast.success(result.message);
      navigate('/player-login');
    } else {
      toast.error(result.message);
    }
  }


  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setLoginFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleLogin = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!loginFormData.email.trim()) {
      toast.error('Please enter your email or phone number');
      return;
    }
    if (!loginFormData.password.trim()) {
      toast.error('Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginAdmin(loginFormData.email, loginFormData.password);
      console.log('Login result:', result);

      const isSuccess = Boolean(
        result?.success ||
        result?.sucess ||
        result?.token ||
        result?.status === 200 ||
        result?.status === 'SUCCESS'
      );

      if (isSuccess) {
        if (result?.token) {
          localStorage.setItem('token', result.token);
        }
        if (result?.user) {
          localStorage.setItem('boxcricket_user', JSON.stringify(result.user));
        } else {
          localStorage.setItem('boxcricket_user', JSON.stringify({ email: loginFormData.email, username: loginFormData.email.split('@')[0] }));
        }

        toast.success(result?.message || 'Login successful!');
        navigate('/player-dashboard');
      } else {
        toast.error(result?.message || 'Invalid credentials');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error?.message || 'Failed to connect to authentication server');
    } finally {
      setIsLoading(false);
    }
  };
  return {
    isLoading,
    showPassword,
    setShowPassword,
    // Login
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    rememberMe,
    setRememberMe,
    handleSignup,
    handleAuthChange,
    signupFormData,
    handleLoginChange,
    loginFormData,
    handleLogin
  };
};
