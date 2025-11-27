import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminProtectedRoute({ children }) {
   const { adminAccessToken } = useSelector((state) => state.adminAuth);


  if (!adminAccessToken) return <Navigate to="/admin/login" replace />;

  return children;
}
