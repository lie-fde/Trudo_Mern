import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import adminAuthReducer from "./adminAuthSlice.js";
import campaignRequestReducer from "./campaignRequestSlice.js";
import campaignReducer from "./campaignSlice.js";
import campaignPubliceReducer from "./campaignUserSlice.js";
import eventRequestReducer from "./eventRequestSlice.js"
import eventReducer from './eventSlice.js'
import eventPublicReducer from "./eventUserSlice.js"

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

// PERSIST CONFIG FOR ADMIN AUTH
const adminPersistConfig = {
  key: "adminAuth",
  storage,
};

const authPersistConfig = {
  key: "auth",
  storage,
};

// wrap adminAuthReducer
const persistedAdminAuth = persistReducer(adminPersistConfig, adminAuthReducer);

const persistedAuth = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuth,
    adminAuth: persistedAdminAuth, // IMPORTANT
    campaignRequests: campaignRequestReducer,
    campaign: campaignReducer,
    campaignPublic: campaignPubliceReducer,
    eventRequests : eventRequestReducer,
    event : eventReducer,
    eventPublic: eventPublicReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed because redux-persist uses non-serializable values
    }),
});

export const persistor = persistStore(store);

export default store;
