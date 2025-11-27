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
