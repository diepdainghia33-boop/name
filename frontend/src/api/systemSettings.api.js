import { api } from "./axios";

export const systemSettingsApi = {
    getSettings: () => api.get("/system/settings"),
    updateSettings: (settings) => api.post("/system/settings", { settings }),
};
