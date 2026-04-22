import { api } from "./axios";

export const apiKeyApi = {
    getKeys: () => api.get("/api-keys"),
    createKey: (data) => api.post("/api-keys", data),
    deleteKey: (id) => api.delete(`/api-keys/${id}`),
};
