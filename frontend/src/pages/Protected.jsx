import { Navigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function Protected({ children, roles }) {
  const auth = useAuth();
  if (!auth.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(auth.user.role)) {
    return <Navigate to="/cuenta" replace />;
  }
  return children;
}
