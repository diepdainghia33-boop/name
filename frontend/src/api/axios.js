import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

export const api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔐 gắn token tự động
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // FormData must not use application/json — browser sets multipart boundary
    if (config.data instanceof FormData) {
        if (config.headers) {
            delete config.headers["Content-Type"];
            delete config.headers["content-type"];
        }
    }

    return config;
});

// ❌ xử lý lỗi global
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const requestUrl = err.config?.url || "";
        const isAuthEndpoint =
            requestUrl.includes("/login") ||
            requestUrl.includes("/register");

        if (err.response?.status === 401 && !isAuthEndpoint) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            // Use window.location instead of navigate since we don't have access to useNavigate in interceptor
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);
