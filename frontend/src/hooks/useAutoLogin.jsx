// import { useEffect } from "react";
// import axios from "axios"; // Import axios directly
// import { useDispatch } from "react-redux";
// import { setCredentials, startLoading, stopLoading } from "../store/authSlice.js";

// export default function useAutoLogin() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         // Use axios directly, NOT the api instance with interceptors
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_URL}/auth/users/refresh-token`,
//           { withCredentials: true }
//         );
        
//         dispatch(
//           setCredentials({
//             accessToken: res.data.accessToken,
//             userName: res.data.userName
//           })
//         );
//       } catch (error) {
//         // Silent fail - user is just not logged in
//         console.log("No active session");
//       } finally {
//         dispatch(stopLoading());
//       }
//     };

//     checkSession();
//   }, [dispatch]); // Add dispatch to dependencies
// }
import { useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setCredentials, setInitialLoadingComplete } from "../store/authSlice.js";

export default function useAutoLogin() {
  const dispatch = useDispatch();
  const location = useLocation();
  const hasRun = useRef(false);

  useEffect(() => {
    // 🚫 Skip auto-login for all admin pages
    if (location.pathname.startsWith("/admin")) {
      dispatch(setInitialLoadingComplete());
      return;
    }

    if (hasRun.current) return;
    hasRun.current = true;

    const checkSession = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/users/refresh-token`,
          { withCredentials: true }
        );
        
        dispatch(
          setCredentials({
            accessToken: res.data.accessToken,
            userName: res.data.userName,
            userEmail: res.data.userEmail
          })
        );
      } catch (error) {
        console.log("No active session");
        dispatch(setInitialLoadingComplete());
      }
    };

    checkSession();
  }, [dispatch, location.pathname]);
}
