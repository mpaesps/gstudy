import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('gstudy.token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export function setAuthSession(accessToken: string, user: unknown) {
  localStorage.setItem('gstudy.token', accessToken);
  localStorage.setItem('gstudy.user', JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem('gstudy.token');
  localStorage.removeItem('gstudy.user');
}

export function getStoredUser<T>() {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = localStorage.getItem('gstudy.user');
  return stored ? (JSON.parse(stored) as T) : null;
}
