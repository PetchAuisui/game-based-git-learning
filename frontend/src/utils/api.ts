import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  // In a real app, you would retrieve the token from cookies or a global state store.
  // For now, we simulate a logged-in user by passing a dummy token if we don't have one.
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Default dummy token for development to pass auth middleware
    config.headers.Authorization = `Bearer dev-token`;
  }
  return config;
});

export default api;
