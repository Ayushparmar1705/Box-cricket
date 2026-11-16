import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DecodedToken {
  role?: string[];
  userid?: number | string;
  email?: string;
  sub?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

function decodeBase64ToUtf8(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let binary = '';
  let i = 0;
  base64 = base64.replace(/[^A-Za-z0-9+/=]/g, '');
  while (i < base64.length) {
    const enc1 = chars.indexOf(base64.charAt(i++));
    const enc2 = chars.indexOf(base64.charAt(i++));
    const enc3 = chars.indexOf(base64.charAt(i++));
    const enc4 = chars.indexOf(base64.charAt(i++));

    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;

    binary += String.fromCharCode(chr1);
    if (enc3 !== 64 && enc3 !== -1) binary += String.fromCharCode(chr2);
    if (enc4 !== 64 && enc4 !== -1) binary += String.fromCharCode(chr3);
  }

  try {
    return decodeURIComponent(
      binary
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    return binary;
  }
}

export function decodeJwtPayload(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const jsonStr = decodeBase64ToUtf8(parts[1]);
    return JSON.parse(jsonStr) as DecodedToken;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return true;
  }

  const payload = decodeJwtPayload(token);
  if (!payload) {
    return true;
  }

  if (typeof payload.exp !== 'number') {
    return false;
  }

  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= currentTimeInSeconds;
}

export async function clearAuthData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(['token', 'authToken', 'userData']);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
}

export async function getValidToken(): Promise<string | null> {
  try {
    const token =
      (await AsyncStorage.getItem('token')) ||
      (await AsyncStorage.getItem('authToken'));

    if (!token) {
      return null;
    }

    if (isTokenExpired(token)) {
      await clearAuthData();
      return null;
    }

    return token;
  } catch {
    return null;
  }
}

export async function validateStoredToken(): Promise<{
  valid: boolean;
  token: string | null;
  payload: DecodedToken | null;
}> {
  try {
    const token =
      (await AsyncStorage.getItem('token')) ||
      (await AsyncStorage.getItem('authToken'));

    if (!token) {
      return { valid: false, token: null, payload: null };
    }

    if (isTokenExpired(token)) {
      await clearAuthData();
      return { valid: false, token: null, payload: null };
    }

    const payload = decodeJwtPayload(token);
    return { valid: true, token, payload };
  } catch {
    return { valid: false, token: null, payload: null };
  }
}

