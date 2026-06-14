import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../auth/auth-api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await loginUser({
        username,
        password,
      });

      localStorage.setItem(
        "access",
        data.access
      );

      localStorage.setItem(
        "refresh",
        data.refresh
      );

      navigate("/dashboard");

    } catch {
      setError(
        "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-slate-950">

      <form
        onSubmit={handleLogin}
        className="bg-slate-900 p-8 rounded-2xl w-96 border border-slate-800"
      >

        <h1 className="text-3xl font-bold mb-6 text-white">
          Smart Access
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          className="w-full p-3 mb-4 rounded-lg bg-slate-800 text-white outline-none"
        />

        <div className="mb-4 flex min-h-12 items-center rounded-lg bg-slate-800">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="min-h-12 w-full rounded-lg bg-transparent p-3 text-white outline-none"
          />
          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="min-h-12 px-3 text-sm font-semibold text-blue-300 hover:text-blue-200"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {error && (
          <p className="text-red-400 mb-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all p-3 rounded-lg text-white font-semibold"
        >
          {loading
            ? "Signing in..."
            : "Login"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-400">
          No account yet?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300"
          >
            Create one
          </Link>
        </p>

      </form>
    </div>
  );
}
