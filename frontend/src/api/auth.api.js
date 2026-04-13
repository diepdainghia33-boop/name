import { api } from "./axios";

export const loginApi = (data) => {
    return api.post("/login", data);
};

export const registerApi = (data) => {
    return api.post("/register", data);
};