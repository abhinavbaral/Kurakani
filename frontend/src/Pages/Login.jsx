import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [remember, setRemember] = useState(false);
  const [usrError, setUsrError] = useState(null);
  const [pasError, setPasError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const host = import.meta.env.VITE_BASE_URL;
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUsrError(null);
    setPasError(null);

    if (!username || !username.trim()) {
      setUsrError("Username cannot be empty!");
      return;
    }

    if (!password || !password.trim()) {
      setPasError("Password cannot be empty!");
      return;
    }

    setLoading(true);

    const requestOptions = {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({
        username: `${username}`,
        password: `${password}`,
      }),
    };

    const response = await fetch(`${host}/api/kurakani/user/login`, requestOptions);
    const r = await response.json();
    console.log(r.token);
    

    if (response.status === 200) {
      setLoading(false);
      login(r.token, remember);
      navigate("/", { replace: true });
    } else {
      setLoading(false);
      setError(r.message);
    }
  };
  return (
    <div className="h-screen flex flex-row justify-center items-center">
      <div className="w-[400px] h-fit bg-cardBgLight dark:bg-cardBgDark rounded-2xl p-6 border border-chat-header-border-light dark:border-chat-header-border-dark shadow-lg shadow-shadow-light dark:shadow-shadow-dark">
        <p className="text-chat-header-text-light dark:text-chat-header-text-dark text-2xl font-bold border-l-4 border-greenAccent px-3">
          Login to Kurakani
        </p>

        {error && (
          <p className="mt-8 bg-red-300 border-2 border-red-500 p-2 rounded-xl">
            {error}
          </p>
        )}

        <form onSubmit={handleFormSubmit}>
          {/* username  */}

          <div className="flex flex-col mt-8 gap-2">
            <label
              htmlFor="username"
              className="text-chat-header-text-light dark:text-chat-header-text-dark  text-xm font-semibold"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Your username here"
              className="bg-placeholderBgLight dark:bg-placeholderBgDark p-2 rounded-xl focus:outline-greenAccent"
              onChange={(e) => setUsername(e.target.value)}
            />
            {usrError && (
              <p className="mt-2 text-sm text-red-400">{usrError}</p>
            )}
          </div>

          {/* password  */}

          <div className="flex flex-col my-6 gap-2">
            <label
              htmlFor="password"
              className="text-chat-header-text-light dark:text-chat-header-text-dark text-xm font-semibold"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Your password here"
              className="bg-placeholderBgLight dark:bg-placeholderBgDark p-2 rounded-xl focus:outline-greenAccent"
              onChange={(e) => setPassword(e.target.value)}
            />
            {pasError && (
              <p className="mt-2 text-sm text-red-400">{pasError}</p>
            )}
          </div>

          {/* remember me  */}

          <div className="flex flex-row mt-6 gap-2">
            <input
              type="checkbox"
              id="remember"
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label
              htmlFor="remember"
              className="text-chat-header-text-light dark:text-chat-header-text-dark  text-xm font-semibold"
            >
              Remember me
            </label>
          </div>

          {/* submit  */}

          <div className="flex flex-col mt-10 gap-2">
            <input
              type="submit"
              name="submit"
              value={loading ? "Logging in..." : "Log in"}
              placeholder="Your username here"
              className=" bg-greenAccent p-2 rounded-xl hover:bg-greenAccentHover transition-colors text-xm font-semibold cursor-pointer disabled:cursor-not-allowed"
              disabled={loading}
            />
          </div>

          <div className="mt-5 text-center">
            <p className="text-chat-header-subtitle-light dark:text-chat-header-subtitle-dark text-sm font-semibold">
              Do not have an account?{" "}
              <Link to={"/signup"} className="text-blue-500 underline">
                Sign Up
              </Link>{" "}
              here
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
