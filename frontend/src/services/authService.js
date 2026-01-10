import adminApi from "../api/adminApi.js";
import api from "../api/api.js";

export const loginUser = (email, password) => {
  return api.post("/auth/users/login", {
    userEmail: email,
    password,
  });
};

export const googleSign = () =>
  `${import.meta.env.VITE_API_URL}/auth/users/google`;

export const signUp = (userName, userEmail, mobileNumber, password) => {
  return api.post("/auth/users/signup", {
    userName,
    userEmail,
    mobileNumber,
    password,
  });
};

export const verifyOtp = (email, otp) => {
  return api.post("/auth/users/verify-otp", {
    email,
    otp,
  });
};

export const resendOtp = (email) => {
  return api.post("/auth/users/resend-otp", {
    email,
  });
};

export const resendOtpPassword = (email) => {
  return api.post("/auth/users/resend-otp-password", {
    email,
  });
};

export const verifyOtpPassword = (email, otp) => {
  return api.post("/auth/users/verify-password-otp", {
    email,
    otp,
  });
};

export const forgotPassword = (email) => {
  return api.post("/auth/users/forgot-password", {
    email,
  });
};

export const resetPassword = (email, newPassword) => {
  return api.post("/auth/users/change-password", {
    email,
    newPassword,
  });
};

export const adminLogin = (adminEmail, password) => {
  return adminApi.post("/auth/admin/login", {
    adminEmail,
    password,
  });
};

export const fetchEventsApi = (params) => {
  return api.get("/events/list", { params });
};

export const getRaisedAmount = (campaignId) => {
  return api.get(`/campaign/raisedAmount/${campaignId}`);
};

export const changeUserPassword = (currentPassword, newPassword) => {
  return api.put("/auth/users/changePassword-UserProfile", {
    currentPassword,
    newPassword,
  });
};

export const createEvent = (formData) => {
  return api.post("/events/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCampaignRaisedAmount = (campaignId) => {
  return api.get(`/campaign/raisedAmount/${campaignId}`);
};

export const getUserCampaigns = (id) => {
  return api.get(`/auth/users/campaigns/${id}`);
};

export const updateUserCampaign = (id, formData) => {
  return api.patch(`/auth/users/campaign/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

export const getEventsList = (page, limit, search, sort) => {
  return api.get("/events/list", {
    params: {
      page,
      limit,
      search,
      sort,
    },
  });
};

export const getUserEventById = (eventId) => {
  return api.get(`/auth/users/events/${eventId}`);
};

export const lockUserTicket = (eventId, quantity) => {
  return api.post("/auth/users/ticket/lock", {
    eventId,
    quantity,
  });
};

export const createPaymentOrder = (amount, email, phone) => {
  return api.post("/auth/users/payment/create-order", {
    amount,
    email,
    phone,
  });
};

export const getDonationHistory = (page, limit, search) => {
  return api.get("/auth/users/donations/history", {
    params: {
      page,
      limit,
      search,
    },
  });
};

export const getDonationStats = () => {
  return api.get("/auth/users/donations/stats");
};

export const cancelUserTicket = (ticketId) => {
  return api.patch(`/auth/users/tickets/cancel/${ticketId}`);
};

export const getMyTickets = () => {
  return api.get("/auth/users/my-tickets");
};

export const getUserProfile = () => {
  return api.get("/auth/users/profile", {
    withCredentials: true,
  });
};

export const getPaymentReceipt = (receiptId) => {
  return api.get(`/payments/receipt/${receiptId}`);
};

export const verifyUserTicket = (ticketId) => {
  return api.get(`/auth/users/verify-ticket/${ticketId}`);
};
