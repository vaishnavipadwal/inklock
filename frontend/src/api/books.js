import axios from "axios";

export const API_URL = "http://127.0.0.1:8000";

// Add your own key here if your login saves the token under a different name
const KEYS = ["token", "access_token", "inklock_token"];

export const getToken = () => {
  for (const k of KEYS) {
    const v = localStorage.getItem(k);
    if (v) return v;
  }
  return null;
};

// Logging out clears the login token and every unlock token (section and books)
export const clearToken = () => {
  KEYS.forEach((k) => localStorage.removeItem(k));
  Object.keys(sessionStorage)
    .filter((k) => k.startsWith("inklock_"))
    .forEach((k) => sessionStorage.removeItem(k));
};

// Unlock tokens live in sessionStorage, so closing the tab locks everything again
export const bookToken = {
  get: (id) => sessionStorage.getItem(`inklock_book_${id}`),
  set: (id, t) => sessionStorage.setItem(`inklock_book_${id}`, t),
  clear: (id) => sessionStorage.removeItem(`inklock_book_${id}`),
};

export const sectionToken = {
  get: () => sessionStorage.getItem("inklock_section"),
  set: (t) => sessionStorage.setItem("inklock_section", t),
  clear: () => sessionStorage.removeItem("inklock_section"),
};

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((cfg) => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  const st = sectionToken.get();
  if (st) cfg.headers["X-Section-Token"] = st;
  const m = cfg.url?.match(/^\/books\/(\d+)\/pages/);
  if (m) {
    const bt = bookToken.get(m[1]);
    if (bt) cfg.headers["X-Book-Token"] = bt;
  }
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err.response?.status;
    const detail = err.response?.data?.detail;
    if (status === 401) {
      clearToken();
      window.location.href = "/login";
    } else if (status === 403 && detail === "Book is locked") {
      const m = err.config?.url?.match(/^\/books\/(\d+)/);
      if (m) bookToken.clear(m[1]);
      window.location.reload();
    } else if (status === 403 && detail === "Private section is locked") {
      sectionToken.clear();
    }
    return Promise.reject(err);
  }
);

export default api;
