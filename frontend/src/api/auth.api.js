import { api } from "./axios";

export const loginApi = (data) => {
    return api.post("/login", data);
};

export const registerApi = (data) => {
    return api.post("/register", data);
};

export const logoutApi = () => {
    return api.post("/logout");
};

export const meApi = () => {
    return api.get("/me");
};

export const updateProfileApi = (data) => {
    return api.post("/update-profile", data);
};

export const updatePasswordApi = (data) => {
    return api.post("/update-password", data);
};

export const forgotPasswordApi = (data) => {
    return api.post("/forgot-password", data);
};

export const resetPasswordApi = (data) => {
    return api.post("/reset-password", data);
};
