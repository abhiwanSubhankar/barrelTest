import React from "react";
import { Navigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import toast from 'react-hot-toast';

const ProtectedRoute = ({ element, ...rest }) => {
  const isAuthenticated = !!sessionStorage.getItem("token");

  if (!isAuthenticated) {
    toast.error("You need to be logged in to access this page!");
    return <Navigate to="/login" />;
  }

  return (
    <>
      {element}
      {/* <ToastContainer /> */}
    </>
  );
};

export default ProtectedRoute;
