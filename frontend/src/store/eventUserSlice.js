import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

export const fetchPublicEvents = createAsyncThunk(
  "eventPublic/fetchPublic",
  async ({ page = 1, limit = 8, search = "", sort = "newest" }) => {
    console.log("Hi"); // ✅ WILL PRINT
    const res = await api.get("/events/list", {
      params: { page, limit, search, sort },
    });
    console.log(res.data);
    return res.data;
  }
);

const eventPublicSlice = createSlice({
  name: "eventPublic", // ✅ MUST MATCH
  initialState: {
    events: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 8,
      totalPages: 1,
      total: 0,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPublicEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPublicEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default eventPublicSlice.reducer;
