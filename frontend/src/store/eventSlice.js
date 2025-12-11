import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../api/adminApi";

// -----------------------------------------------------------
// FETCH ALL EVENTS
// -----------------------------------------------------------
export const fetchAllEvents = createAsyncThunk(
  "event/fetchAll",
  async () => {
    const res = await adminApi.get("/events");
    return res.data.events; // backend should return { events: [...] }
  }
);

// -----------------------------------------------------------
// FETCH SINGLE EVENT
// -----------------------------------------------------------
export const fetchSingleEvent = createAsyncThunk(
  "event/fetchOne",
  async (id) => {
    const res = await adminApi.get(`/events/${id}`);
    return res.data.event; // backend should return { event: {...} }
  }
);

// -----------------------------------------------------------
// SLICE
// -----------------------------------------------------------
const eventSlice = createSlice({
  name: "event",
  initialState: {
    events: [],
    singleEvent: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---- GET ALL EVENTS ----
      .addCase(fetchAllEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllEvents.rejected, (state) => {
        state.loading = false;
      })

      // ---- GET SINGLE EVENT ----
      .addCase(fetchSingleEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleEvent.fulfilled, (state, action) => {
        state.singleEvent = action.payload;
        state.loading = false;
      })
      .addCase(fetchSingleEvent.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default eventSlice.reducer;
