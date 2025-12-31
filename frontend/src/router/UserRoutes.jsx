import React from "react";
import { Routes , Route} from 'react-router-dom'
import Signup from "../pages/authentication/SignUp";
import Login from "../pages/authentication/Login";
import Home from "../pages/User/home";
import VerifyOTP from "../pages/authentication/VerifyOtp";
import VerifyOtpPassword from "../pages/authentication/VerifyOtpPassword";
import ForgotPassword from "../pages/authentication/ForgotPassword";
import ChangePassword from "../pages/authentication/ChangePassword";
import GoogleSuccess from "../components/GoogleSuccess";
import CampaignPage from "../pages/User/campaignPage";
import CampaignViewUser from "../pages/User/CampaignViewUser";
import DonationPage from "../pages/User/DonationAmountPage";
import CreateCampaign from "../pages/createCampaign";
import VerifyOTPProfile from "../pages/User/ProfileEmailVerification";
import Profile from "../pages/User/Profile";
import MyCampaignPage from "../pages/User/MyCampaign.jsx"
import EditCampaignUser from "../pages/User/EditCampaignUser";
import Buggy from "../components/reusable/buggy.jsx"
import Me from "../pages/me";
import ProtectedRoute from "./ProtectedRoute";
import BlockRoute from "./blockRoute";
import ReceiptPage from "../pages/User/ReceiptPage.jsx";
import MyDonationPage from "../pages/User/MyDonation.jsx";
import CreateEventUser from "../pages/User/createEventUser.jsx";
import EventPage from "../pages/User/EventPage.jsx";
import EventViewUserPage from "../pages/User/EventViewUser.jsx";
import ChangePasswordProfile from "../pages/User/ChangePassword.jsx";
import MyTickets from "../pages/User/Mytickets.jsx";
import VerifyTicket from "../pages/User/VerifyTicketPage.jsx";
import Contact from "../pages/User/ContactPage.jsx";


function UserRoutes(){

    return(
        <Routes>

        <Route path="/login" element={<BlockRoute><Login/></BlockRoute>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/"  element={<Home/>}/> 
        <Route path="/verify-otp" element={ <VerifyOTP/>}/>
        <Route path="/verify-otp-password" element={<VerifyOtpPassword/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/change-password" element={<ChangePassword/>}/>
        <Route path="/google-success" element={<GoogleSuccess/>}/>
        <Route path="/campaigns" element={<ProtectedRoute><CampaignPage/></ProtectedRoute>}/>
        <Route path="/campaigns/:id" element={<CampaignViewUser/>}/>
        <Route path="/campaigns/:id/donate" element={<ProtectedRoute><DonationPage/></ProtectedRoute>} />
        <Route path="/me" element={<ProtectedRoute><Me/></ProtectedRoute>}/>
        <Route path="/create-campaign" element={<ProtectedRoute><CreateCampaign/></ProtectedRoute>}/>
        <Route path="/profile"  element={<ProtectedRoute><Profile/></ProtectedRoute>}   />
        <Route path="/profile/verify-otp" element={<ProtectedRoute><VerifyOTPProfile/></ProtectedRoute>}/>
        <Route path="/mycampaigns" element={<ProtectedRoute><MyCampaignPage/></ProtectedRoute>}/>
        <Route path="/mycampaigns/edit/:id" element={<ProtectedRoute><EditCampaignUser/></ProtectedRoute>} />
        <Route path="/donation/receipt/:receiptId" element={<ProtectedRoute><ReceiptPage/></ProtectedRoute>}/>
        <Route path="/my-donations" element={<ProtectedRoute><MyDonationPage/></ProtectedRoute>} />
        <Route path="/create-event" element={<ProtectedRoute><CreateEventUser/></ProtectedRoute>}/>
        <Route path="/events" element={<EventPage/>}/>
        <Route path="/events/:eventId" element={<ProtectedRoute><EventViewUserPage/></ProtectedRoute>}/>
        <Route path="/changePassword" element={<ProtectedRoute><ChangePasswordProfile/></ProtectedRoute>} />
        <Route path="/mytickets" element={<ProtectedRoute><MyTickets/></ProtectedRoute>} />
        <Route path="/ticket/:ticketId" element={<VerifyTicket/>}/>
        <Route path="/contact" element={<Contact/>}/>
        
        
        <Route path="/buggy" element={<Buggy/>}/>
       



        </Routes>

    )
}


export default UserRoutes