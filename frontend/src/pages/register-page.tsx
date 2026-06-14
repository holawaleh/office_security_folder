import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUserAccount } from "../api/account-api";

const initialForm = {
  username: "",
  password: "",
  email: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  role: "SECURITY",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(
    event: React.FormEvent
  ) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await registerUserAccount(form);

      setSuccess(
        "Account created. You can now log in."
      );
      setForm(initialForm);

      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch {
      setError(
        "Could not create account. Check the details and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-2xl rounded-lg border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-3xl font-bold">
          Create Account
        </h1>
        <p className="mt-2 text-slate-400">
          New accounts are created with security access
          until an owner upgrades the privilege.
        </p>

        <form
          onSubmit={handleRegister}
          className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <Input
            label="Username"
            value={form.username}
            onChange={(value) =>
              setForm({ ...form, username: value })
            }
            required
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(value) =>
              setForm({ ...form, password: value })
            }
            required
          />
          <Input
            label="First name"
            value={form.first_name}
            onChange={(value) =>
              setForm({ ...form, first_name: value })
            }
          />
          <Input
            label="Last name"
            value={form.last_name}
            onChange={(value) =>
              setForm({ ...form, last_name: value })
            }
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) =>
              setForm({ ...form, email: value })
            }
          />
          <Input
            label="Phone"
            value={form.phone_number}
            onChange={(value) =>
              setForm({
                ...form,
                phone_number: value,
              })
            }
          />

          {error && (
            <p className="md:col-span-2 text-red-400">
              {error}
            </p>
          )}

          {success && (
            <p className="md:col-span-2 text-green-400">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>

          <Link
            to="/login"
            className="flex items-center justify-center rounded-lg border border-slate-700 px-4 py-3 text-slate-200 hover:bg-slate-800"
          >
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm text-slate-300">
      <span className="mb-1 block">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
      />
    </label>
  );
}
