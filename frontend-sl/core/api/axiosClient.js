"use client";

import axios from "axios";

/**
 * Environment helpers
 */
export const IMAGE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL || "";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000, // 30s safety timeout
  headers: {
    Accept: "application/json",
    // ❌ Content-Type intentionally NOT set here
  },
});

/**
 * ============================
 * REQUEST INTERCEPTOR
 * ============================
 * Responsibilities:
 * - Attach Authorization token
 * - Smart Content-Type handling
 * - Never break any request
 */
api.interceptors.request.use(
  (config) => {
    try {
      // -----------------------------
      // Attach Bearer Token
      // -----------------------------
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("auth");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.token) {
            config.headers.Authorization = `Bearer ${parsed.token}`;
          }
        }
      }

      // -----------------------------------
      // Smart Content-Type Resolution
      // -----------------------------------
      /**
       * 1. FormData → multipart/form-data (axios handles boundary)
       * 2. Everything else → application/json
       */
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      } else {
        config.headers["Content-Type"] = "application/json";
      }
    } catch (err) {
      // 🔕 Silent fail — NEVER block request
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ============================
 * RESPONSE INTERCEPTOR
 * ============================
 * Responsibilities:
 * - Centralized error logging
 * - Controlled auth handling
 * - No aggressive auto logout
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // -----------------------------------
    // Server responded with error
    // -----------------------------------
    if (error?.response) {
      const { status, data } = error.response;

      // Centralized logging (prod ready)
      console.error("API Error:", {
        status,
        data,
        url: error.config?.url,
        method: error.config?.method,
      });

      /**
       * ⚠️ AUTH STRATEGY (IMPORTANT)
       *
       * 401 does NOT always mean logout
       * Example:
       * - Avatar upload
       * - Optional secured endpoints
       *
       * So we DO NOT auto logout here.
       * Auth handling should be explicit.
       */
      if (status === 401) {
        // Example (future):
        // triggerRefreshToken()
        // OR redirect only on protected routes
      }
    }
    // -----------------------------------
    // Network / CORS / Timeout error
    // -----------------------------------
    else {
      console.error("Network Error:", error?.message);
    }

    return Promise.reject(error);
  }
);

export default api;
