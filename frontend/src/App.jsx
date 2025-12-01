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
// import useAdminAutoLogin from "./hooks/useAdminAutoLogin";
import CampaignRequestList from "./pages/Admin/CampaignRequestList";
import CampaignView from "./pages/Admin/CampaignView";
import CampaignPage from "./pages/User/campaignPage";
import CampaignsPage from './pages/Admin/CampaignList.jsx'
import CreateCampaignAdmin from "./pages/Admin/CreateCampaignAdmin.jsx";
import CampaignViewUser from "./pages/User/CampaignViewUser.jsx";
import DonationPage from "./pages/User/DonationAmountPage.jsx";
import EditCampaignAdmin from "./pages/Admin/EditCampaignRequest.jsx";
import Profile from "./pages/User/Profile.jsx";
import VerifyOTPProfile from "./pages/User/ProfileEmailVerification.jsx";
import MyCampaignPage from "./pages/User/MyCampaign.jsx";
import EditCampaignUser from "./pages/User/EditCampaignUser.jsx";


function App() {
    
    const initialLoading = useSelector((state) => state.auth.initialLoading); 
    // const apiLoading = useSelector((state) => state.auth.apiLoading); 
   
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
          Loading...
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
         <Route path="/"  element={<Home/>}/> 
         <Route path="/verify-otp" element={ <VerifyOTP/>}/>
         <Route path="/verify-otp-password" element={<VerifyOtpPassword/>}/>
         <Route path="/forgot-password" element={<ForgotPassword/>}/>
         <Route path="/change-password" element={<ChangePassword/>}/>
         <Route path="/google-success" element={<GoogleSuccess/>}/>
{/* 
        <Route path="/home"  element={<Home/>} /> */}
        <Route path="/campaigns" element={<ProtectedRoute><CampaignPage/></ProtectedRoute>}/>
        <Route path="/campaigns/:id" element={<CampaignViewUser/>}/>
        <Route path="/campaigns/:id/donate" element={<ProtectedRoute><DonationPage/></ProtectedRoute>} />
        <Route path="/me" element={<ProtectedRoute><Me/></ProtectedRoute>}/>
        <Route path="/create-campaign" element={<ProtectedRoute><CreateCampaign/></ProtectedRoute>}/>
        <Route path="/profile"  element={<ProtectedRoute><Profile/></ProtectedRoute>}   />
        <Route path="/profile/verify-otp" element={<ProtectedRoute><VerifyOTPProfile/></ProtectedRoute>}/>
        <Route path="/mycampaigns" element={<ProtectedRoute><MyCampaignPage/></ProtectedRoute>}/>
        <Route path="/mycampaigns/edit/:id" element={<ProtectedRoute><EditCampaignUser/></ProtectedRoute>} />
        
        
        <Route path="/buggy" element={<Buggy/>}/>
        <Route path="*" element={<NotFound/>}/>
        
        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard/></AdminProtectedRoute>}/>
        <Route path="/admin/users" element={<AdminProtectedRoute><UsersList/></AdminProtectedRoute>}/> 
        <Route path="/admin/users/:id" element={<AdminProtectedRoute><UserDetails/></AdminProtectedRoute>}/>
        <Route path="/admin/campaigns-request" element={<AdminProtectedRoute><CampaignRequestList/></AdminProtectedRoute>}/>
        <Route path="/admin/campaigns-request/:id" element={<AdminProtectedRoute><CampaignView/></AdminProtectedRoute>} />
        <Route path="/admin/campaigns"  element={<AdminProtectedRoute><CampaignsPage/></AdminProtectedRoute>}/>
        <Route path="/admin/create-campaign" element={<AdminProtectedRoute><CreateCampaignAdmin/></AdminProtectedRoute>} />
        <Route path="/admin/campaigns/edit/:id" element={<AdminProtectedRoute><EditCampaignAdmin/></AdminProtectedRoute>}  />
      </Routes>
    </>
  )
}

export default App;