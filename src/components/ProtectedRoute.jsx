import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (!isAuthenticated) {
    alert("Please login first!"); 
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;