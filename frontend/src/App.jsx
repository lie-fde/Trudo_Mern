// import React from "react";
// import {BrowserRouter as Router, Routes , Route,  Navigate} from 'react-router-dom'
// import Login from "./pages/authentication/Login";
// import Signup from "./pages/authentication/SignUp";
// import Home from "./pages/User/home";
// import ProtectedRoute from "./router/ProtectedRoute";
// import AdminProtectedRoute from "./router/AdminProtectedRoute";
// import VerifyOTP from "./pages/authentication/VerifyOtp";
// import ForgotPassword from "./pages/authentication/ForgotPassword";
// import ChangePassword from "./pages/authentication/ChangePassword";
// import VerifyOtpPassword from "./pages/authentication/VerifyOtpPassword";
// import AdminLogin from "./pages/authentication/AdminLogin";
// import AdminDashboard from "./pages/Admin/Dashboard";
// import UsersList from "./pages/Admin/AdminUsersList";
// import UserDetails from "./pages/Admin/AdminUsersDetails";
// import Buggy from "./components/reusable/buggy"
// import NotFound from "./pages/NotFound";
// import GoogleSuccess from "./components/GoogleSuccess";
// import useAutoLogin from "./hooks/useAutoLogin";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Me from "./pages/me";
// import { useSelector } from "react-redux";
// import BlockRoute from "./router/blockRoute";
// import Loader from "./components/reusable/loader";

// function App() {
//     useAutoLogin();
//     const loading = useSelector((state) => state.auth.loading);
//      if (loading) {
//     return (
//       <Loader/>
//     );
//   }
//   return (
//     <>
//     <ToastContainer position="top-right" autoClose={2000} />
   

//       <Routes>
//         <Route path="/login" element={<BlockRoute><Login/></BlockRoute>}/>
//         <Route path="/signup" element={<Signup/>}/>
//          <Route path="/"  element={ <Navigate to={'/home'} replace/>}/> 
//          <Route path="/verify-otp" element={ <VerifyOTP/>}/>
//          <Route path="/verify-otp-password" element={<VerifyOtpPassword/>}/>
//          <Route path="/forgot-password" element={<ForgotPassword/>}/>
//          <Route path="/change-password" element={<ChangePassword/>}/>
//          <Route path="/google-success" element={<GoogleSuccess/>}/>

//         <Route path="/home"  element={<Home/>} />
//         <Route path="/me" element={<ProtectedRoute><Me/></ProtectedRoute>}/>
        
//         <Route path="/buggy" element={<Buggy/>}/>
//         <Route path="*" element={<NotFound/>}/>
        

//         <Route path="/admin/login" element={<AdminLogin/>}/>
//         <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard/></AdminProtectedRoute>}/>
//         <Route path="/admin/users" element={<AdminProtectedRoute><UsersList/></AdminProtectedRoute>}/> 
//         <Route path="/admin/users/:id" element={<AdminProtectedRoute><UserDetails/></AdminProtectedRoute>}/>
//       </Routes>
//     </>
//   )
// }

// export default App;



import React from "react";
import {BrowserRouter as Router, Routes , Route,  Navigate} from 'react-router-dom'
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/SignUp";
import Home from "./pages/User/home";
import ProtectedRoute from "./router/ProtectedRoute";
import AdminProtectedRoute from "./router/AdminProtectedRoute";
import VerifyOTP from "./pages/authentication/VerifyOtp";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import ChangePassword from "./pages/authentication/ChangePassword";
import VerifyOtpPassword from "./pages/authentication/VerifyOtpPassword";
import AdminLogin from "./pages/authentication/AdminLogin";
import AdminDashboard from "./pages/Admin/Dashboard";
import UsersList from "./pages/Admin/AdminUsersList";
import UserDetails from "./pages/Admin/AdminUsersDetails";
import Buggy from "./components/reusable/buggy"
import NotFound from "./pages/NotFound";
import GoogleSuccess from "./components/GoogleSuccess";
import useAutoLogin from "./hooks/useAutoLogin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Me from "./pages/me";
import { useSelector } from "react-redux";
import BlockRoute from "./router/blockRoute";
import Loader from "./components/reusable/loader";
import CreateCampaign from "./pages/createCampaign";

function App() {
    useAutoLogin();
    const initialLoading = useSelector((state) => state.auth.initialLoading); // Changed!
    const apiLoading = useSelector((state) => state.auth.apiLoading); // Optional: use for UI feedback
   
    if (initialLoading) {
        return <Loader/>;
    }
    
  return (
    <>
    <ToastContainer position="top-right" autoClose={2000} />
    

    {/* {apiLoading && (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-yellow-100">

      <div className="backdrop-blur-xl bg-white/40 p-8 rounded-3xl shadow-2xl flex flex-col items-center">
        
        <div className="w-14 h-14 border-4 border-white border-t-pink-500 rounded-full animate-spin"></div>

        <h2 className="mt-6 text-xl font-semibold text-gray-800 tracking-wide">
          Restoring your session...
        </h2>

        <p className="text-sm text-gray-600 mt-2 animate-pulse">
          Please wait a moment ✨
        </p>
      </div>

    </div>
    )} */}

      <Routes>
        <Route path="/login" element={<BlockRoute><Login/></BlockRoute>}/>
        <Route path="/signup" element={<Signup/>}/>
         <Route path="/"  element={ <Navigate to={'/home'} replace/>}/> 
         <Route path="/verify-otp" element={ <VerifyOTP/>}/>
         <Route path="/verify-otp-password" element={<VerifyOtpPassword/>}/>
         <Route path="/forgot-password" element={<ForgotPassword/>}/>
         <Route path="/change-password" element={<ChangePassword/>}/>
         <Route path="/google-success" element={<GoogleSuccess/>}/>

        <Route path="/home"  element={<Home/>} />
        <Route path="/me" element={<ProtectedRoute><Me/></ProtectedRoute>}/>
        <Route path="/create-campaign" element={<CreateCampaign/>}/>
        
        <Route path="/buggy" element={<Buggy/>}/>
        <Route path="*" element={<NotFound/>}/>
        
        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard/></AdminProtectedRoute>}/>
        <Route path="/admin/users" element={<AdminProtectedRoute><UsersList/></AdminProtectedRoute>}/> 
        <Route path="/admin/users/:id" element={<AdminProtectedRoute><UserDetails/></AdminProtectedRoute>}/>
      </Routes>
    </>
  )
}

export default App;