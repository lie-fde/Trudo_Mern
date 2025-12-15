import React from "react";
import { Routes ,Route } from "react-router-dom";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminLogin from "../pages/authentication/AdminLogin";
import AdminDashboard from "../pages/Admin/Dashboard";
import UsersList from "../pages/Admin/AdminUsersList";
import UserDetails from "../pages/Admin/AdminUsersDetails";
import CampaignRequestList from "../pages/Admin/CampaignRequestList";
import CampaignView from "../pages/Admin/CampaignView";
import CampaignsPage from "../pages/Admin/CampaignList";
import CreateCampaignAdmin from "../pages/Admin/CreateCampaignAdmin";
import EditCampaignAdmin from "../pages/Admin/EditCampaignRequest";
import AdminProfile from "../pages/Admin/AdminProfile.jsx"
import NotFound from "../pages/NotFound.jsx";
import DonationReport from "../pages/Admin/DonationReport.jsx";
import EventsPage from "../pages/Admin/EventList.jsx";
import CreateEvent from "../pages/Admin/CreateEvent.jsx";
import EventRequestList from "../pages/Admin/EventRequestList.jsx";
import EventView from "../pages/Admin/EventView.jsx";


function AdminRoutes () {

    return (
        <>
        <Routes>
         
        <Route path="/login" element={<AdminLogin/>}/>
        <Route path="/dashboard" element={<AdminProtectedRoute><AdminDashboard/></AdminProtectedRoute>}/>
        <Route path="/users" element={<AdminProtectedRoute><UsersList/></AdminProtectedRoute>}/> 
        <Route path="/users/:id" element={<AdminProtectedRoute><UserDetails/></AdminProtectedRoute>}/>
        <Route path="/campaigns-request" element={<AdminProtectedRoute><CampaignRequestList/></AdminProtectedRoute>}/>
        <Route path="/campaigns-request/:id" element={<AdminProtectedRoute><CampaignView/></AdminProtectedRoute>} />
        <Route path="/campaigns"  element={<AdminProtectedRoute><CampaignsPage/></AdminProtectedRoute>}/>
        <Route path="/create-campaign" element={<AdminProtectedRoute><CreateCampaignAdmin/></AdminProtectedRoute>} />
        <Route path="/campaigns/edit/:id" element={<AdminProtectedRoute><EditCampaignAdmin/></AdminProtectedRoute>}  />
        <Route path="/profile" element={<AdminProtectedRoute><AdminProfile/></AdminProtectedRoute>}/>
        <Route path="/donation-report" element={<AdminProtectedRoute><DonationReport/></AdminProtectedRoute>} />
        <Route path="/events" element={<AdminProtectedRoute><EventsPage/></AdminProtectedRoute>} />
        <Route path="/create-event" element={<AdminProtectedRoute><CreateEvent/></AdminProtectedRoute>}/>
        <Route path="/event-request" element={<AdminProtectedRoute><EventRequestList/></AdminProtectedRoute>} />
        <Route path="/event-request/:id" element={<AdminProtectedRoute><EventView/></AdminProtectedRoute>} />
        <Route path="/event/:id" element={<AdminProtectedRoute><EventView/></AdminProtectedRoute>} />

        <Route path="*" element={<NotFound/>}/>


        </Routes>
        </>
    )
}

export default AdminRoutes