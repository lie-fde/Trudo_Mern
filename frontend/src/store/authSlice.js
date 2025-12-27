import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    userName: null,
    userEmail: null,
    mobileNumber: null,
    isBlocked: false,
    initialLoading: true,
    apiLoading: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.userName = action.payload.userName;
      state.userEmail = action.payload.userEmail;
      state.mobileNumber = action.payload.mobileNumber;
      state.initialLoading = false;
      state.isBlocked=false
    },
    setBlocked: (state) => {
      state.isBlocked = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.userName = null;
      state.userEmail = null;
      state.mobileNumber = null;
      state.initialLoading = false;
    },
    setInitialLoadingComplete: (state) => {
      state.initialLoading = false;
    },
    startApiLoading: (state) => {
      state.apiLoading = true;
    },
    stopApiLoading: (state) => {
      state.apiLoading = false;
    },
  },
});

export const {
  setCredentials,
  logout,
  setInitialLoadingComplete,
  startApiLoading,
  stopApiLoading,
  setBlocked,
} = authSlice.actions;

export default authSlice.reducer;
