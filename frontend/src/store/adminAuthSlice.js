import { createSlice } from "@reduxjs/toolkit";

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState: {
    adminAccessToken: null,
    adminName: null,
    adminEmail: null,

    adminInitialLoading: true,  
    adminApiLoading: false,     
  },

  reducers: {
    setAdminCredentials: (state, action) => {
      state.adminAccessToken = action.payload.adminAccessToken;
      state.adminName = action.payload.adminName;
      state.adminEmail = action.payload.adminEmail;
      state.adminInitialLoading = false;
    },


    adminLogout: (state) => {
      state.adminAccessToken = null;
      state.adminName = null;
      state.adminEmail = null;
      state.adminInitialLoading = false;
    },

    setAdminInitialLoadingComplete: (state) => {
      state.adminInitialLoading = false;
    },

    startAdminApiLoading: (state) => {
      state.adminApiLoading = true;
    },

    stopAdminApiLoading: (state) => {
      state.adminApiLoading = false;
    },
  },
});

export const {
  setAdminCredentials,
  adminLogout,
  setAdminInitialLoadingComplete,
  startAdminApiLoading,
  stopAdminApiLoading,
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
