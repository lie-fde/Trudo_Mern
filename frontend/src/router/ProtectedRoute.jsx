import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { logout } from "../store/authSlice";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { accessToken, isBlocked , isDeleted} = useSelector((state) => state.auth);

  useEffect(() => {
    if (isBlocked) {
      Swal.fire({
        icon: "error",
        title: "Account Blocked",
        text: "Your account has been blocked by the admin.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        dispatch(logout());
      });
    }
  }, [isBlocked, dispatch]);

    useEffect(() => {
    if (isDeleted) {
      Swal.fire({
        icon: "error",
        title: "Account Deleted",
        text: "Your account has been deleted by the admin.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        dispatch(logout());
      });
    }
  }, [isDeleted, dispatch]);


  if (!accessToken) return <Navigate to="/login" replace />;

  if (isBlocked) {
    return null; // 🔥 wait until alert closes
  }

  return children;
}
