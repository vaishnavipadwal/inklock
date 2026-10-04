import axios from "axios";

// Add your own key here if the grep showed a different name
const KEYS = ["token", "access_token", "inklock_token"];

export const getToken = () => {
  for (const k of KEYS) {
    const v = localStorage.getItem(k);
    if (v) return v;
  }
  return null;
};

export const clearToken = () => KEYS.forEach((k) => localStorage.removeItem(k));

const api = axios.create({ baseURL: "http://127.0.0.1:8000" });

api.interceptors.request.use((cfg) => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

// Token expired or invalid: clear it and send the user to login
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
