import axios from "axios";
import store from "../store/store";
import {
  logout,
  setCredentials,
  startApiLoading,
  stopApiLoading,
  setBlocked,
  setDeleted
} from "../store/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (!config.url.includes("refresh-token")) {
    store.dispatch(startApiLoading());
  }
  console.log("EVENT PAGE TOKEN:", store.getState().auth?.accessToken);
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(token);
  return config;
});

api.interceptors.response.use(
  (res) => {
    if (!res.config.url.includes("refresh-token")) {
      store.dispatch(stopApiLoading());
    }
    return res;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest.url.includes("refresh-token")) {
      store.dispatch(stopApiLoading());
    }

    if(error.response?.status=== 403 && error.response?.data?.code === "USER_BLOCKED"){
      store.dispatch(setBlocked(true));
      store.dispatch(logout());
      return Promise.reject(error);
    }

       if(error.response?.status=== 403 && error.response?.data?.code === "USER_DELETED"){
      store.dispatch(setDeleted(true));
      store.dispatch(logout());
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/users/refresh-token`,
          { withCredentials: true }
        );

        store.dispatch(
          setCredentials({
            accessToken: res.data.accessToken,
            userName: res.data.userName,
            userEmail: res.data.userEmail,
            mobileNumber: res.data.mobileNumber,
          })
        );


        api.defaults.headers.common.Authorization = `Bearer ${res.data.accessToken}`;

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${res.data.accessToken}`,
        };

        return api(originalRequest);
      } catch (refreshError) {
        console.log("error");
        store.dispatch(stopApiLoading());
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
