import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

// Fetch campaigns that users should see
export const fetchPublicCampaigns = createAsyncThunk(
  "userCampaign/fetchPublic",
  async () => {
    const res = await api.get("/campaign/campaignslist");
    return res.data.campaigns;
  }
);

const userCampaignSlice = createSlice({
  name: "userCampaign",
  initialState: {
    campaigns: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicCampaigns.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPublicCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchPublicCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userCampaignSlice.reducer;
