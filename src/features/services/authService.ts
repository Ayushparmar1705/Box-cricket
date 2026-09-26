import Api from '../../api/Api';

export const loginAdmin = async (email: string, password: string) => {
  const url = Api.loginUser + '/api/users/login'
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, passwordHash: password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to authenticate');
  } else {
    const data = await response.json();
    return data;
  }

};
