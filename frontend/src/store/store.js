import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice.js'
import adminAuthReducer from './adminAuthSlice.js'

const store = configureStore({
    reducer:{
        auth : authReducer,
        adminAuth: adminAuthReducer,
    }
})


export default store