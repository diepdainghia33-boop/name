import { api } from "./axios";

export const chatApi = {
    getConversations: () => api.get("/conversations"),
    getMessages: (id) => api.get(`/conversations/${id}/messages`),
    sendMessage: (formData) => api.post("/messages/send", formData),
    updateConversation: (id, data) => api.patch(`/conversations/${id}`, data),
    deleteConversation: (id) => api.delete(`/conversations/${id}`),
    submitFeedback: (messageId, feedback) => api.post(`/messages/${messageId}/feedback`, { feedback }),
};
