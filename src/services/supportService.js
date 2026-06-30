import api from "../api/axiosInstance";

export const getSupportTickets = async () => {
  return api.get("/admin/support-tickets");
};