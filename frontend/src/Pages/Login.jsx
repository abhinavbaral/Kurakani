import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [usrError, setUsrError] = useState(null);
  const [pasError, setPasError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const host = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setUsrError(null);
    setPasError(null);
    setError(null);

    if (!username.trim()) {
      setUsrError("Username cannot be empty!");
      return;
    }

    if (!password.trim()) {
      setPasError("Password cannot be empty!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: username,
    password: password,
  }),
});
      // const response = await fetch(`${host}/api/auth/login`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     email: username,
      //     password: password,
      //   }),
      // });

      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        login(data.token, remember);
        navigate("/", { replace: true });
      } else {
        setLoading(false);
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setLoading(false);
      setError("Cannot connect to server");
    }
  };

  return (
  <div className="min-h-screen flex justify-center items-center bg-blue-100 dark:bg-blue-900">
  <div className="w-[400px] bg-cardBgLight dark:bg-cardBgDark rounded-2xl p-6 shadow-lg border border-green-200 dark:border-green-700">

    <p className="text-2xl font-bold border-l-4 border-greenAccent pl-3">
      Login to Kurakani
    </p>

    {error && (
      <p className="mt-6 bg-red-100 border border-red-500 text-red-700 p-2 rounded-xl">
        {error}
      </p>
    )}

    <form onSubmit={handleFormSubmit}>
      {/* username */}
      <div className="flex flex-col mt-8 gap-2">
        <label className="text-sm text-white font-medium">Username</label>
        <input
          type="text"
          className="w-full p-2 rounded-xl border border-green-300 dark:border-green-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-greenAccent"
          onChange={(e) => setUsername(e.target.value)}
        />
        {usrError && <p className="text-red-500 text-sm">{usrError}</p>}
      </div>

      {/* password */}
      <div className="flex flex-col mt-6 gap-2">
        <label className="text-sm text-white font-medium">Password</label>
        <input
          type="password"
          className="w-full p-2 rounded-xl border border-green-300 dark:border-green-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-greenAccent"
          onChange={(e) => setPassword(e.target.value)}
        />
        {pasError && <p className="text-red-500 text-sm">{pasError}</p>}
      </div>

      {/* remember */}
      <div className="flex items-center mt-6 gap-2">
        <input
          type="checkbox"
          className="accent-greenAccent"
          onChange={(e) => setRemember(e.target.checked)}
        />
        <label className="text-sm text-white">Remember me</label>
      </div>

      {/* submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 bg-greenAccent text-white p-2 rounded-xl transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Log in"}
      </button>

      <div className="mt-5 text-center text-sm">
        <p className="text-white">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 underline">
            Sign Up
          </Link>
        </p>
      </div>
    </form>
  </div>
</div>
  );
};

export default Login;