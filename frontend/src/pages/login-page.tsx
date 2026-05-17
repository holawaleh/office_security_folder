import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../auth/auth-api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

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

    } catch (err) {
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

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-3 mb-4 rounded-lg bg-slate-800 text-white outline-none"
        />

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

      </form>
    </div>
  );
}