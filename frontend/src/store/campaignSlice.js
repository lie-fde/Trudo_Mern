import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../api/adminApi";


export const fetchAllCampaigns = createAsyncThunk(
  "campaign/fetchAll",
  async ({ search = "", category = "", sort = "latest", page = 1, limit = 6 }) => {
    const res = await adminApi.get("/admin/campaigns", {
      params: {
        search,
        category,
        sort,
        page,
        limit,
      },
    });

    return res.data;
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

    totalDocs: 0,
    totalPages: 0,
    currentPage: 1,

    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH ALL (ADMIN LIST)
      .addCase(fetchAllCampaigns.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCampaigns.fulfilled, (state, action) => {
        state.loading = false;

        state.campaigns = action.payload.campaigns; 
        state.totalDocs = action.payload.totalDocs;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchAllCampaigns.rejected, (state) => {
        state.loading = false;
      })

      // FETCH SINGLE
      .addCase(fetchSingleCampaign.fulfilled, (state, action) => {
        state.singleCampaign = action.payload;
      });
  },
});

export default campaignSlice.reducer;
