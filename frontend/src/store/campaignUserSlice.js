import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

export const fetchPublicCampaigns = createAsyncThunk(
  "userCampaign/fetchPublic",
  async ({ page = 1, limit = 6, search = "", sort = "created_desc" }) => {
    const res = await api.get("/campaign/campaignslist", {
      params: { page, limit, search, sort },
    });
    return res.data;
  }
);

export const fetchPublicSingleCampaign = createAsyncThunk(
  "campaign/fetchOne",
  async (id) => {
    const res = await api.get(`/campaign/campaignslist/${id}`);
    return res.data.campaign;
  }
);

export const fetchMycampaign = createAsyncThunk("user/myCampaign", async () => {
  const res = await api.get("/auth/users/mycampaigns");
  return res.data.data;
});

const userCampaignSlice = createSlice({
  name: "userCampaign",
  initialState: {
    campaigns: [],
    totalPages: 1,
    singleCampaign: null,
    myCampaign: [],
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
        state.campaigns = action.payload.campaigns;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPublicCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPublicSingleCampaign.fulfilled, (state, action) => {
        (state.loading = false), (state.singleCampaign = action.payload);
      })
      .addCase(fetchMycampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.myCampaign = action.payload;
      })
      .addCase(fetchMycampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userCampaignSlice.reducer;
