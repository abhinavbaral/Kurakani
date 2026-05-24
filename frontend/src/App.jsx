import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./Contexts/AuthContext";
import AuthLayout from "./Layouts/AuthLayout";
import AppLayout from "./Layouts/AppLayout";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Chat from "./Pages/Chat";

function App() {
  const { token } = useAuth();

  // DEBUG: check what token is actually
  console.log("AUTH TOKEN:", token);

  return (
    <Routes>

      {/* =========================
          PUBLIC / AUTH ROUTES
          ========================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>


      {/* =========================
          PROTECTED ROUTES
          THIS IS WHAT BLOCKS ACCESS
          ========================= */}
      <Route
        element={
          token
            ? (
                // ✅ ALLOWED: user is "logged in"
                <AppLayout />
              )
            : (
                // 🚫 BLOCKED HERE: no token → forced to login
                <Navigate to="/login" replace />
              )
        }
      >
        <Route path="/" element={<Chat />} />
      </Route>


      {/* =========================
          FALLBACK ROUTE
          ALSO REDIRECTS BASED ON TOKEN
          ========================= */}
      <Route
        path="*"
        element={
          token
            ? (
                // user is logged in → go home
                <Navigate to="/" replace />
              )
            : (
                // 🚫 user not logged in → forced login
                <Navigate to="/login" replace />
              )
        }
      />

    </Routes>
  );
}

export default App;