import { api } from "./axios";

export const settingsApi = {
    getPreferences: () => api.get("/settings"),

    updatePreferences: (preferences) => api.post("/settings", { preferences }),

    exportData: () => api.post("/settings/export-data"),

    deleteAccount: (confirmEmail) => api.post("/settings/delete-account", { confirm_email: confirmEmail }),

    clearCache: () => api.post("/settings/clear-cache"),
};