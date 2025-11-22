// import axios from 'axios'
// import store from '../store/store'
// import { logout, setCredentials, startLoading, stopLoading } from '../store/authSlice'

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL,
//     withCredentials: true
// })


// api.interceptors.request.use((config)=>{
//     if (!config.url.includes("refresh-token")) {
//     store.dispatch(startLoading());
//      }
//     const token = store.getState().auth.accessToken
//     if(token){
//         config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
// })

// api.interceptors.response.use((res)=>{
//      if (!res.config.url.includes("refresh-token")) {
//       store.dispatch(stopLoading());
//     }
//     return res
// },
//     async(error)=>{
//         const originalRequest = error.config
        
//           if (!originalRequest.url.includes("refresh-token")) {
//       store.dispatch(stopLoading());
//     }


//         if(error.response?.status === 401 && !originalRequest._retry){
//             originalRequest._retry=true

//             try {

//                 const res = await axios.get(
//           `${import.meta.env.VITE_API_URL}/auth/users/refresh-token`,
//           { withCredentials: true }
//         );

                
//                 store.dispatch(
//                     setCredentials({
//                         accessToken: res.data.accessToken,
//                         userName: res.data.userName
//                })
//             )

//             originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`

//             return api(originalRequest)
                
//             } catch (error) {

//                 store.dispatch(stopLoading()); 
//                 store.dispatch(logout())
                
//             }
//         }
//         return Promise.reject(error)
//     }
// )


// export default api
import axios from 'axios'
import store from '../store/store'
import { logout, setCredentials, startApiLoading, stopApiLoading } from '../store/authSlice'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

api.interceptors.request.use((config) => {
    // Only show loading for non-refresh-token calls
    if (!config.url.includes("refresh-token")) {
        store.dispatch(startApiLoading());
    }
    
    const token = store.getState().auth.accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => {
        if (!res.config.url.includes("refresh-token")) {
            store.dispatch(stopApiLoading());
        }
        return res;
    },
    async (error) => {
        const originalRequest = error.config;
        
        if (!originalRequest.url.includes("refresh-token")) {
            store.dispatch(stopApiLoading());
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/auth/users/refresh-token`,
                    { withCredentials: true }
                );

                store.dispatch(
                    setCredentials({
                        accessToken: res.data.accessToken,
                        userName: res.data.userName,
                        userEmail : res.data.userEmail
                    })
                );

                originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
                return api(originalRequest);
                
            } catch (refreshError) {
                store.dispatch(stopApiLoading()); 
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;