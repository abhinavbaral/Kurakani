import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

const AuthLayout = () => {
  const { token } = useAuth();

  // if already logged in, don’t show login/signup pages
  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-backgroundLight dark:bg-backgroundDark flex items-center justify-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;