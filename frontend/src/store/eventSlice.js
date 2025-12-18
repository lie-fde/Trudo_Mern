import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../api/adminApi";

// -----------------------------------------------------------
// FETCH ALL EVENTS
// -----------------------------------------------------------
export const fetchAllEvents = createAsyncThunk(
  "event/fetchAll",
  async ({ search = "", page = 1, limit = 10, sort = "latest" ,category = ""} = {}) => {
    const res = await adminApi.get(
      `/events?search=${search}&page=${page}&limit=${limit}&sort=${sort}&category=${category}`
    );

    return {
      events: res.data.events,
      totalPages: res.data.totalPages,
      currentPage: res.data.currentPage,
    };
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
// const eventSlice = createSlice({
//   name: "event",
//   initialState: {
//     events: [],
//     singleEvent: null,
//     loading: false,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // ---- GET ALL EVENTS ----
//       .addCase(fetchAllEvents.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchAllEvents.fulfilled, (state, action) => {
//         state.events = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchAllEvents.rejected, (state) => {
//         state.loading = false;
//       })

//       // ---- GET SINGLE EVENT ----
//       .addCase(fetchSingleEvent.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchSingleEvent.fulfilled, (state, action) => {
//         state.singleEvent = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchSingleEvent.rejected, (state) => {
//         state.loading = false;
//       });
//   },
// });


const eventSlice = createSlice({
  name: "event",
  initialState: {
    events: [],
    singleEvent: null,
    loading: false,
    totalPages: 1,
    currentPage: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---- GET ALL EVENTS ----
      .addCase(fetchAllEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.events = action.payload.events;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
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
