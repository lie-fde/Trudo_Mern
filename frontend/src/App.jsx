import React from "react";
import {BrowserRouter as Router, Routes , Route,  Navigate} from 'react-router-dom'
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/SignUp";
import Home from "./pages/authentication/home";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./pages/authentication/admin/components/AdminProtectedRoute";
import VerifyOTP from "./pages/authentication/VerifyOtp";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import ChangePassword from "./pages/authentication/ChangePassword";
import VerifyOtpPassword from "./pages/authentication/VerifyOtpPassword";
import AdminLogin from "./pages/authentication/admin/authentication/AdminLogin";
import AdminDashboard from "./pages/authentication/admin/Dashboard";
import UsersList from "./pages/authentication/admin/AdminUsersList";
import UserDetails from "./pages/authentication/admin/AdminUsersDetails";
import GoogleSuccess from "./components/GoogleSuccess";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <>
    <ToastContainer position="top-right" autoClose={2000} />
    <Router>

      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
         <Route path="/"  element={ <Navigate to={'/home'} replace/>}/> 
         <Route path="/verify-otp" element={ <VerifyOTP/>}/>
         <Route path="/verify-otp-password" element={<VerifyOtpPassword/>}/>
         <Route path="/forgot-password" element={<ForgotPassword/>}/>
         <Route path="/change-password" element={<ChangePassword/>}/>
         <Route path="/google-success" element={<GoogleSuccess/>}/>

        <Route path="/home"  element={<ProtectedRoute><Home/></ProtectedRoute>} />
        
        

        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard/></AdminProtectedRoute>}/>
        <Route path="/admin/users" element={<AdminProtectedRoute><UsersList/></AdminProtectedRoute>}/> 
        <Route path="/admin/users/:id" element={<AdminProtectedRoute><UserDetails/></AdminProtectedRoute>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App;