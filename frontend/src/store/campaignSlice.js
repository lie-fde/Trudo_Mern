import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../api/adminApi";

export const fetchAllCampaigns = createAsyncThunk(
  "campaign/fetchAll",
  async () => {
    const res = await adminApi.get("/admin/campaigns");
    return res.data.campaigns;
  }
);

export const fetchSingleCampaign = createAsyncThunk(
  "campaign/fetchOne",
  async (id) => {
    const res = await adminApi.get(`/admin/campaigns/${id}`);
    return res.data.campaign;
  }
);

const campaignSlice = createSlice({
  name: "campaign",
  initialState: {
    campaigns: [],
    singleCampaign: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCampaigns.fulfilled, (state, action) => {
        state.campaigns = action.payload;
      })
      .addCase(fetchSingleCampaign.fulfilled, (state, action) => {
        state.singleCampaign = action.payload;
      });
  },
});

export default campaignSlice.reducer;
