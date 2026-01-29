import axios from "axios";

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api'

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("insta_reels_auth");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (error) {
      // ignore parse errors
    }
  }
  return config;
});

export const AuthService = {
  login: (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/register", payload),
  me: () => api.get("/auth/me"),
  updateMe: (payload) => api.patch("/auth/me", payload),
};

export const FeedService = {
  getFeed: (params) => api.get("/feed", { params }),
};

export const ReelsService = {
  getReels: (params) => api.get("/reels", { params }),
};