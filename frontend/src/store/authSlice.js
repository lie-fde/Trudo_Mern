// import {createSlice} from '@reduxjs/toolkit'


// const authSlice = createSlice({
//     name:'auth',
//     initialState:{
//         accessToken : null,
//         userName : null,
//         loading: true, 
//     },
//     reducers:{
//         setCredentials:(state,action)=>{
//             state.accessToken = action.payload.accessToken,
//             state.userName= action.payload.userName,
//             state.loading=false
//         },
//         logout : (state)=>{
//             state.accessToken=null
//             state.userName=null
//             state.loading=false
//         },
//        startLoading:(state)  =>{
//         state.loading=true
//        },
//        stopLoading :(state)=>{
//         state.loading=false
//        },
//     }

// })

// export const {setCredentials , logout , startLoading , stopLoading} = authSlice.actions
// export default authSlice.reducer;

import {createSlice} from '@reduxjs/toolkit'

const authSlice = createSlice({
    name:'auth',
    initialState:{
        accessToken : null,
        userName : null,
        initialLoading: true,  // For auto-login only
        apiLoading: false,     // For API calls
    },
    reducers:{
        setCredentials:(state, action) => {
            state.accessToken = action.payload.accessToken;
            state.userName = action.payload.userName;
            state.initialLoading = false; // Stop initial loading
        },
        logout: (state) => {
            state.accessToken = null;
            state.userName = null;
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