import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../api/adminApi.js";

export const fetchPendingCampaigns = createAsyncThunk(
  "campaign/fetchPending",
  async ({ search = "" }, { rejectWithValue }) => {
    try {
      const res = await adminApi.get("/admin/campaigns/pending", {
        params: { search },
      });
      return res.data.campaigns;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch");
    }
  },
);

export const updateCampaignStatus = createAsyncThunk(
  "campaign/updateStatus",
  async ({ campaignId, status, rejectionReason }, { rejectWithValue }) => {
    // API call uses the 'status' variable:
    const payload = {
      status,
      rejectionReason: rejectionReason || null,
    };
    try {
      const res = await adminApi.patch(
        `/admin/campaigns/${campaignId}/status`,
        payload,
      );
      return res.data.campaign;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update",
      );
    }
  },
);

const campaignRequestSlice = createSlice({
  name: "campaignRequests",
  initialState: {
    campaigns: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchPendingCampaigns.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchPendingCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCampaignStatus.fulfilled, (state, action) => {
        if (action.payload && action.payload._id) {
          state.campaigns = state.campaigns.filter(
            (c) => c._id !== action.payload._id,
          );
          state.error = null;
        }
        state.loading = false;
      })
      .addCase(updateCampaignStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default campaignRequestSlice.reducer;
