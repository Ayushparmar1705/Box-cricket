import baseUrl from '../../api/Api';

export interface PlayerRegisterData {
  username: string;
  fullName?: string;
  email: string;
  phone: string;
  password: string;
}

export interface PlayerLoginResponse {
  token?: string;
  role?: string;
  userId?: number | string;
  username?: string;
  fullName?: string;
  email?: string;
  message?: string;
  status?: string | number;
  success?: boolean;
}

/**
 * Attempts login against the backend user/player endpoints
 */
export const loginPlayer = async (email: string, password: string): Promise<PlayerLoginResponse> => {
  try {
    // 1. Primary endpoint: /api/users/login (from UserController)
    const primaryUrl = `${baseUrl.auth}/api/users/login`;
    const res = await fetch(primaryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      return await res.json();
    }

    // 2. Secondary fallback endpoint: /player/login
    try {
      const fallbackUrl = `${baseUrl.auth}/player/login`;
      const fallbackRes = await fetch(fallbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (fallbackRes.ok) {
        return await fallbackRes.json();
      }
    } catch {
      // ignore fallback error and parse primary
    }

    const errorData = await res.json().catch(() => ({}));
    return {
      message: errorData.message || `Login failed with status ${res.status}`,
      status: res.status,
    };
  } catch (error: any) {
    console.warn('Backend server not reachable or network error:', error);
    // If backend is completely offline in local dev, provide helpful error or allow mock login for testing
    throw new Error(
      error?.message?.includes('Failed to fetch')
        ? 'Authentication server is unreachable. Please verify backend auth-service is running on port 3030.'
        : error.message || 'Error during player login'
    );
  }
};

/**
 * Attempts player registration against the backend user/player endpoints
 */
export const registerPlayer = async (body: PlayerRegisterData): Promise<PlayerLoginResponse> => {
  try {
    const payload = {
      name: body.username,
      fullName: body.fullName || body.username,
      email: body.email,
      phone: body.phone,
      password: body.password,
      roles: ['PLAYER'],
    };

    // 1. Primary endpoint: /api/users/create (from UserController)
    const primaryUrl = `${baseUrl.auth}/api/users/create`;
    const res = await fetch(primaryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return await res.json();
    }

    // 2. Secondary fallback endpoint: /player/register
    try {
      const fallbackUrl = `${baseUrl.auth}/player/register`;
      const fallbackRes = await fetch(fallbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (fallbackRes.ok) {
        return await fallbackRes.json();
      }
    } catch {
      // ignore fallback error
    }

    const errorData = await res.json().catch(() => ({}));
    return {
      message: errorData.message || `Registration failed with status ${res.status}`,
      status: res.status,
    };
  } catch (error: any) {
    console.warn('Backend server not reachable during registration:', error);
    throw new Error(
      error?.message?.includes('Failed to fetch')
        ? 'Authentication server is unreachable. Please verify backend auth-service is running on port 3030.'
        : error.message || 'Error during player registration'
    );
  }
};
