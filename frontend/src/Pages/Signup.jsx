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
        setLoading(false);
        navigate("/login");
      } else {
        setLoading(false);
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setLoading(false);
      setError("Cannot connect to server");
    }
  };

  return (
    <div className="h-screen flex flex-row justify-center items-center">
      <div className="w-[400px] h-fit bg-cardBgLight dark:bg-cardBgDark rounded-2xl p-6 border shadow-lg">

        <p className="text-2xl font-bold border-l-4 border-greenAccent px-3">
          Signup to Kurakani
        </p>

        {error && (
          <p className="mt-6 bg-red-300 border-2 border-red-500 p-2 rounded-xl">
            {error}
          </p>
        )}

        <form onSubmit={handleFormSubmit}>
          <div className="flex flex-col mt-8 gap-2">
            <label>Username</label>
            <input
              type="text"
              className="p-2 rounded-xl"
              onChange={(e) => setUsername(e.target.value)}
            />
            {usrError && <p className="text-red-400">{usrError}</p>}
          </div>

          <div className="flex flex-col my-6 gap-2">
            <label>Password</label>
            <input
              type="password"
              className="p-2 rounded-xl"
              onChange={(e) => setPassword(e.target.value)}
            />
            {pasError && <p className="text-red-400">{pasError}</p>}
          </div>

          <input
            type="submit"
            value={loading ? "Signing Up..." : "Sign Up"}
            disabled={loading}
            className="bg-greenAccent p-2 rounded-xl cursor-pointer"
          />

          <div className="mt-5 text-center">
            <p>
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