import {createSlice} from '@reduxjs/toolkit'

const authSlice = createSlice({
    name:'auth',
    initialState:{
        accessToken : null,
        userName : null,
        userEmail : null,
        initialLoading: true,  // For auto-login only
        apiLoading: false,     // For API calls
    },
    reducers:{
        setCredentials:(state, action) => {
            state.accessToken = action.payload.accessToken;
            state.userName = action.payload.userName;
            state.userEmail=action.payload.userEmail
            state.initialLoading = false; // Stop initial loading
        },
        logout: (state) => {
            state.accessToken = null;
            state.userName = null;
            state.userEmail=null
            state.initialLoading = false;
        },
        setInitialLoadingComplete: (state) => {
            state.initialLoading = false;
        },
        startApiLoading: (state) => {
            state.apiLoading = true;
        },
        stopApiLoading: (state) => {
            state.apiLoading = false;
        },
    }
})

export const {
    setCredentials, 
    logout, 
    setInitialLoadingComplete,
    startApiLoading, 
    stopApiLoading
} = authSlice.actions;

export default authSlice.reducer;