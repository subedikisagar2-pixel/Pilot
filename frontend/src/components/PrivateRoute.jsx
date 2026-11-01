import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap protected pages with this component in App.js routing
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
