import axios from "axios";
import store from "../store/store";

import {
  setAdminCredentials,
  adminLogout,
  startAdminApiLoading,
  stopAdminApiLoading,
} from "../store/adminAuthSlice";
import { HTTP_STATUS } from "../constants/httpsconstants.js";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

adminApi.interceptors.request.use((config) => {
  if (!config.url.includes("refresh-admin")) {
    store.dispatch(startAdminApiLoading());
  }

  const token = store.getState().adminAuth.adminAccessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => {
    if (!response.config.url.includes("refresh-admin")) {
      store.dispatch(stopAdminApiLoading());
    }
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest.url.includes("/refresh-admin")) {
      store.dispatch(stopAdminApiLoading());
    }

 
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
       const refreshRes = await adminApi.get("/auth/admin/refresh-token");

        store.dispatch(
          setAdminCredentials({
            adminAccessToken: refreshRes.data.adminAccessToken,
            adminName: refreshRes.data.admin.adminName,
            adminEmail: refreshRes.data.admin.adminEmail,
          })
        );


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
