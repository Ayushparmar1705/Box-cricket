import AsyncStorage from '@react-native-async-storage/async-storage';
import LIVE_URL from '../../Api';

export interface LoginFormData {
  email: string;
  password: string;
}

export const login = async (formData: LoginFormData) => {
  try {
    const response = await fetch(`${LIVE_URL.auth_service}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }

    // Store token in AsyncStorage (local storage)
    const token = result.token || result.data?.token;
    if (token) {
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(result));
    }

    return result;
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};

export default login;
