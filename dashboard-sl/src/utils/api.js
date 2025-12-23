import axios from "axios";
export const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
const API = axios.create({
    baseURL: import.meta.env.VITE_APP_URL,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"]; // Let browser set correct boundary
    }
    return config;
});

export default API;
