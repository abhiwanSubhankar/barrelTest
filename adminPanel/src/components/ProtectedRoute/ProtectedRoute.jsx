import { Navigate } from "react-router-dom";
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
    </>
  );
};

export default ProtectedRoute;
