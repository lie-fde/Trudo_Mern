import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../api/adminApi.js";

export const fetchPendingEvents = createAsyncThunk(
  "events/fetchPending",
  async ({ search = "" }, { rejectWithValue }) => {
    try {
      const res = await adminApi.get("/events/pending", {
        params: { search },
      });
      return res.data.events;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch events",
      );
    }
  },
);

/* --------------------------------------------------------------
   APPROVE / REJECT EVENT
----------------------------------------------------------------*/
export const updateEventStatus = createAsyncThunk(
  "events/updateStatus",
  async ({ eventId, status, rejectionReason }, { rejectWithValue }) => {
    try {
      const payload = {
        status,
        rejectionReason: rejectionReason || null,
      };
      console.log(eventId);

      const res = await adminApi.patch(`/events/${eventId}/status`, payload);
      return res.data.event; // backend response must send { event: {...} }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update event",
      );
    }
  },
);

/* --------------------------------------------------------------
   REDUX SLICE
----------------------------------------------------------------*/
const eventRequestSlice = createSlice({
  name: "eventRequests",
  initialState: {
    events: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      /* ---- FETCH PENDING ---- */
      .addCase(fetchPendingEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.error = null;
      })
      .addCase(fetchPendingEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---- UPDATE EVENT STATUS ---- */
      .addCase(updateEventStatus.fulfilled, (state, action) => {
        if (action.payload && action.payload._id) {
          state.events = state.events.filter(
            (e) => e._id !== action.payload._id,
          );
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateEventStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default eventRequestSlice.reducer;
