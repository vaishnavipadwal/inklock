import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('inklock_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turns any API error into one readable string
export function errorMessage(err) {
  if (!err.response) return 'Cannot reach the server. Is the backend running?';
  const d = err.response.data?.detail;
  if (typeof d === 'string') return d;
  if (Array.isArray(d) && d[0]?.msg) return d[0].msg;
  return 'Something went wrong. Please try again.';
}

export default api;
