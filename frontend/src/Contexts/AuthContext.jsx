import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  });

  useEffect(() => {
    const handleStorage = () => {
      setToken(
        localStorage.getItem("token") ||
        sessionStorage.getItem("token")
      );
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = (newToken, remember) => {
    if (remember) {
      localStorage.setItem("token", newToken);
      sessionStorage.removeItem("token");
    } else {
      sessionStorage.setItem("token", newToken);
      localStorage.removeItem("token");
    }

    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);