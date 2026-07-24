import { useState, useCallback } from 'react';

export interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
  showPassword: boolean;
  isLoading: boolean;
  error: string;
}

export const DEMO_ADMIN_CREDENTIALS = {
  email: 'admin@boxcricket.app',
  password: 'Admin@123',
};

export function useLoginForm(onSuccess: () => void) {
  const [form, setForm] = useState<LoginFormState>({
    email: '',
    password: '',
    rememberMe: true,
    showPassword: false,
    isLoading: false,
    error: '',
  });

  const setField = useCallback((field: keyof LoginFormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value, error: '' }));
  }, []);

  const fillDemoCredentials = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      email: DEMO_ADMIN_CREDENTIALS.email,
      password: DEMO_ADMIN_CREDENTIALS.password,
      error: '',
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setForm((prev) => ({ ...prev, isLoading: true, error: '' }));

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (
        form.email.trim().toLowerCase() === DEMO_ADMIN_CREDENTIALS.email &&
        form.password === DEMO_ADMIN_CREDENTIALS.password
      ) {
        localStorage.setItem(
          'bc_admin_session',
          JSON.stringify({
            userId: 'u-101',
            role: 'SUPER_ADMIN',
            fullName: 'Rajesh Sharma',
            loginTime: new Date().toISOString(),
          })
        );
        onSuccess();
      } else {
        setForm((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Invalid credentials. Please use admin@boxcricket.app / Admin@123',
        }));
      }
    },
    [form.email, form.password, onSuccess]
  );

  return {
    form,
    setField,
    fillDemoCredentials,
    handleSubmit,
  };
}
