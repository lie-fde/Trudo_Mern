// import { useEffect } from "react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { setAdminCredentials, setAdminInitialLoadingComplete } from "../store/adminAuthSlice";
// import { useLocation } from "react-router-dom";

// export default function useAdminAutoLogin() {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const { adminInitialLoading } = useSelector((state) => state.adminAuth);

//   useEffect(() => {
//     if (!location.pathname.startsWith("/admin")) {
//       dispatch(setAdminInitialLoadingComplete());
//       return;
//     }

//     const checkAdminSession = async () => {
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_URL}/auth/admin/refresh-token`,
//           { withCredentials: true }
//         );

//         dispatch(
//           setAdminCredentials({
//             adminAccessToken: res.data.adminAccessToken,
//             adminName: res.data.adminName,
//             adminEmail: res.data.adminEmail,
//           })
//         );
//       } catch (err) {
//         dispatch(setAdminInitialLoadingComplete());
//       }
//     };

//     checkAdminSession();
//   }, [location.pathname, dispatch]);

//   return adminInitialLoading;
// }
