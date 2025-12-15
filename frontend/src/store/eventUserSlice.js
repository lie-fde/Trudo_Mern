// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../api/api";

// /**
//  * 🔹 Fetch public events (user side)
//  * GET /events/list
//  */
// export const fetchPublicEvents = createAsyncThunk(
//   "eventPublic/fetchPublic",
//   async (
//     { page = 1, limit = 8, search = "", sort = "newest" },
//     { rejectWithValue }
//   ) => {
//     try {
//         console.log("Hi")
//       const res = await api.get("/events/list", {
//         params: { page, limit, search, sort },
//       });
//       console.log(res.data)
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch events"
//       );
//     }
//   }
// );

// /**
//  * 🔹 Fetch single event (if you add later)
//  * GET /events/:id
//  */
// export const fetchSingleEvent = createAsyncThunk(
//   "eventPublic/fetchSingle",
//   async (id, { rejectWithValue }) => {
//     try {
//       const res = await api.get(`/events/${id}`);
//       return res.data.event;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch event"
//       );
//     }
//   }
// );

// const eventSlice = createSlice({
//   name: "Userevent",
//   initialState: {
//     events: [],
//     singleEvent: null,
//     loading: false,
//     error: null,
//     pagination: {
//       page: 1,
//       limit: 8,
//       totalPages: 1,
//       total: 0,
//     },
//   },
//   reducers: {
//     clearEventError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // ===============================
//       // FETCH PUBLIC EVENTS
//       // ===============================
//       .addCase(fetchPublicEvents.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPublicEvents.fulfilled, (state, action) => {
//         state.loading = false;
//         state.events = action.payload.events;

//         state.pagination.total = action.payload.pagination.total;
//         state.pagination.page = action.payload.pagination.page;
//         state.pagination.limit = action.payload.pagination.limit;
//         state.pagination.totalPages =
//           action.payload.pagination.totalPages;
//       })
//       .addCase(fetchPublicEvents.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===============================
//       // FETCH SINGLE EVENT
//       // ===============================
//       .addCase(fetchSingleEvent.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchSingleEvent.fulfilled, (state, action) => {
//         state.loading = false;
//         state.singleEvent = action.payload;
//       })
//       .addCase(fetchSingleEvent.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearEventError } = eventSlice.actions;
// export default eventSlice.reducer;


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
