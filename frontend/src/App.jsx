import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Loader from "./components/reusable/loader";
import UserRoutes from "./router/UserRoutes.jsx";
import AdminRoutes from "./router/AdminRoutes.jsx";
import { Routes , Route} from "react-router-dom";



function App() {
    
    // const initialLoading = useSelector((state) => state.auth.initialLoading); ; 
   
    // if (initialLoading) {
    //     return <Loader/>;
    // }
    
  return (
    <>
    <ToastContainer position="top-right" autoClose={2000} />
          <Routes>
        {/* USER ROUTES */}
        <Route path="/*" element={<UserRoutes />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>


     
    </>
  )
}

export default App;