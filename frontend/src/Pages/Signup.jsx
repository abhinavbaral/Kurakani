import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usrError, setUsrError] = useState(null);
  const [pasError, setPasError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          email: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen w-full flex justify-center items-center bg-gray-100 dark:bg-gray-900">
      <div className="w-[400px] bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">

        <p className="text-2xl font-bold border-l-4 border-green-500 pl-3 text-gray-900 dark:text-white">
          Signup to Kurakani
        </p>

        {error && (
          <p className="mt-6 bg-red-100 border border-red-500 text-red-700 p-2 rounded-xl">
            {error}
          </p>
        )}

        <form onSubmit={handleFormSubmit}>
          {/* username */}
          <div className="flex flex-col mt-8 gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Username
            </label>

            <input
              type="text"
              className="w-full p-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setUsername(e.target.value)}
            />

            {usrError && (
              <p className="text-red-500 text-sm">{usrError}</p>
            )}
          </div>

          {/* password */}
          <div className="flex flex-col mt-6 gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>

            <input
              type="password"
              className="w-full p-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setPassword(e.target.value)}
            />

            {pasError && (
              <p className="text-red-500 text-sm">{pasError}</p>
            )}
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-green-500 text-white p-2 rounded-xl transition hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <div className="mt-5 text-center text-sm">
            <p className="text-gray-700 dark:text-gray-200">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;