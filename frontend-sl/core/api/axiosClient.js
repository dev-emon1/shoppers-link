"use client";

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      if (typeof window !== "undefined" && config && config.headers) {
        const raw = window.localStorage.getItem("auth");
        if (raw) {
          const parsed = JSON.parse(raw);
          const token = parsed?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      }
    } catch (e) {
      // don't crash the request if localStorage read/parsing fails
      // optional: console.warn("Failed to read auth token", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response) {
      // useful for debugging or showing toast globally
      console.error(
        "API Error:",
        error.response.status,
        error.response.data || error.response.statusText
      );

      // Example: global 401 handler (optional)
      if (error.response.status === 401) {
        // dispatch logout, refresh, or redirect to login
      }
    } else {
      console.error("Network/Unknown API Error:", error?.message);
    }
    return Promise.reject(error);
  }
);

export default api;
