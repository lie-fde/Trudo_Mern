import React from "react";
import {BrowserRouter as Router, Routes , Route,  Navigate} from 'react-router-dom'
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/SignUp";
import Home from "./pages/authentication/home";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyOTP from "./pages/authentication/VerifyOtp";

function App() {

  return (
    <>
    <Router>

      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
         <Route path="/"  element={ <Navigate to={'/home'} replace/>}/> 
         <Route path="/verify-otp" element={ <VerifyOTP/>}/>

        <Route path="/home"  element={<ProtectedRoute><Home/></ProtectedRoute>} />
      </Routes>
    </Router>
    </>
  )
}

export default App;