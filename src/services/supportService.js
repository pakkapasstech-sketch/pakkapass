import api from "../api/axiosInstance";

export const getSupportTickets = async () => {
  return api.get("/admin/support-tickets");
};

export const submitSupportTicket = async (payload, role) => {
  if (role === 'PARTNER') {
    return api.post("/partner/support-tickets", payload);
  }
  return api.post("/student/support", payload);
};

export const getUserSupportTickets = async (studentId, role) => {
  if (role === 'PARTNER') {
    return api.get("/partner/support-tickets");
  }
  return api.get("/student/support");
};

export const updateSupportTicketStatus = async (id, status, adminMessage) => {
  return api.put(`/admin/support-tickets/${id}/status`, { 
    status: status.toLowerCase(), 
    adminNotes: adminMessage 
  });
};