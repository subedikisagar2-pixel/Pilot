import axios from "axios";

const api = axios.create({
  baseURL: "https://pilot-csas.onrender.com/api",
  withCredentials: true, // send the auth cookie with every request
});

// Attach token from localStorage as a fallback auth method
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
