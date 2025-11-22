import axios from "axios";
import store from "../store/store";

import {
  setAdminCredentials,
  adminLogout,
  startAdminApiLoading,
  stopAdminApiLoading,
} from "../store/adminAuthSlice";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// 🔹 REQUEST INTERCEPTOR
adminApi.interceptors.request.use((config) => {
  // Start loader only for non-refresh requests
  if (!config.url.includes("refresh-admin")) {
    store.dispatch(startAdminApiLoading());
  }

  const token = store.getState().adminAuth.adminAccessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔹 RESPONSE INTERCEPTOR
adminApi.interceptors.response.use(
  (response) => {
    if (!response.config.url.includes("refresh-admin")) {
      store.dispatch(stopAdminApiLoading());
    }
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest.url.includes("refresh-admin")) {
      store.dispatch(stopAdminApiLoading());
    }

 
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/admin/refresh-token`,
          { withCredentials: true }
        );

        // Update Redux state
        store.dispatch(
          setAdminCredentials({
            adminAccessToken: refreshRes.data.adminAccessToken,
            adminName: refreshRes.data.admin.adminName,
            adminEmail: refreshRes.data.admin.adminEmail,
          })
        );

        // Retry original request with new access token
        originalRequest.headers.Authorization =
          `Bearer ${refreshRes.data.adminAccessToken}`;

        return adminApi(originalRequest);

      } catch (err) {
        store.dispatch(adminLogout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default adminApi;
