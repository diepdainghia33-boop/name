import { api } from "./axios";

export const chatApi = {
    getConversations: () => api.get("/conversations"),
    getMessages: (id) => api.get(`/conversations/${id}/messages`),
    sendMessage: (formData) => api.post("/messages/send", formData),
    deleteConversation: (id) => api.delete(`/conversations/${id}`),
    submitFeedback: (messageId, feedback) => api.post(`/messages/${messageId}/feedback`, { feedback }),
};
