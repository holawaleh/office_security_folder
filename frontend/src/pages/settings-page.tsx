import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createUserProfile,
  getUserProfiles,
  updateUserProfile,
} from "../api/account-api";
import Sidebar from "../components/layout/sidebar";
import Topbar from "../components/layout/topbar";

const initialAdminForm = {
  username: "",
  password: "",
  email: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  role: "ADMIN",
};

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [adminForm, setAdminForm] =
    useState(initialAdminForm);
  const [selectedUserId, setSelectedUserId] =
    useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [showCreatePassword, setShowCreatePassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [passwordError, setPasswordError] =
    useState("");

  const usersQuery = useQuery({
    queryKey: ["user-profiles"],
    queryFn: getUserProfiles,
  });

  const createAdminMutation = useMutation({
    mutationFn: createUserProfile,
    onSuccess: () => {
      setAdminForm(initialAdminForm);
      queryClient.invalidateQueries({
        queryKey: ["user-profiles"],
      });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: () =>
      updateUserProfile(Number(selectedUserId), {
        password: newPassword,
      }),
    onSuccess: () => {
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
      queryClient.invalidateQueries({
        queryKey: ["user-profiles"],
      });
    },
  });

  const users = usersQuery.data || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white lg:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Topbar />

        <main className="mx-auto max-w-7xl space-y-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <header>
            <p className="text-sm text-slate-400">
              Admin and system settings
            </p>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Settings
            </h1>
          </header>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
            <Panel
              title="Add Admin User"
              description="Create operators with full or restricted access to the dashboard."
            >
              <form
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  createAdminMutation.mutate(adminForm);
                }}
              >
                <Input
                  label="Username"
                  value={adminForm.username}
                  onChange={(value) =>
                    setAdminForm({
                      ...adminForm,
                      username: value,
                    })
                  }
                  required
                />
                <Input
                  label="Password"
                  type={
                    showCreatePassword
                      ? "text"
                      : "password"
                  }
                  value={adminForm.password}
                  onChange={(value) =>
                    setAdminForm({
                      ...adminForm,
                      password: value,
                    })
                  }
                  required
                  action={
                    <PasswordToggle
                      visible={showCreatePassword}
                      onClick={() =>
                        setShowCreatePassword(
                          !showCreatePassword
                        )
                      }
                    />
                  }
                />
                <Input
                  label="First name"
                  value={adminForm.first_name}
                  onChange={(value) =>
                    setAdminForm({
                      ...adminForm,
                      first_name: value,
                    })
                  }
                />
                <Input
                  label="Last name"
                  value={adminForm.last_name}
                  onChange={(value) =>
                    setAdminForm({
                      ...adminForm,
                      last_name: value,
                    })
                  }
                />
                <Input
                  label="Email"
                  type="email"
                  value={adminForm.email}
                  onChange={(value) =>
                    setAdminForm({
                      ...adminForm,
                      email: value,
                    })
                  }
                />
                <Input
                  label="Phone"
                  value={adminForm.phone_number}
                  onChange={(value) =>
                    setAdminForm({
                      ...adminForm,
                      phone_number: value,
                    })
                  }
                />
                <Select
                  label="Privilege"
                  value={adminForm.role}
                  onChange={(value) =>
                    setAdminForm({
                      ...adminForm,
                      role: value,
                    })
                  }
                  options={[
                    ["SUPER_ADMIN", "Full privilege"],
                    ["ADMIN", "Restricted admin"],
                    ["SECURITY", "Security"],
                    ["RECEPTION", "Reception"],
                  ]}
                />
                <SubmitButton
                  label="Add Admin"
                  loading={createAdminMutation.isPending}
                />
              </form>
            </Panel>

            <Panel
              title="Change User Password"
              description="Select an account and set a new password."
            >
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();

                  if (!selectedUserId) {
                    setPasswordError(
                      "Select a user account."
                    );
                    return;
                  }

                  if (newPassword !== confirmPassword) {
                    setPasswordError(
                      "Passwords do not match."
                    );
                    return;
                  }

                  setPasswordError("");
                  updatePasswordMutation.mutate();
                }}
              >
                <Select
                  label="User account"
                  value={selectedUserId}
                  onChange={setSelectedUserId}
                  options={[
                    ["", "Select user"],
                    ...users.map((user) => [
                      String(user.id),
                      `${user.full_name} (${user.role})`,
                    ] as [string, string]),
                  ]}
                />
                <Input
                  label="New password"
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={setNewPassword}
                  required
                  action={
                    <PasswordToggle
                      visible={showNewPassword}
                      onClick={() =>
                        setShowNewPassword(
                          !showNewPassword
                        )
                      }
                    />
                  }
                />
                <Input
                  label="Confirm password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  required
                  action={
                    <PasswordToggle
                      visible={showConfirmPassword}
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    />
                  }
                />

                {passwordError && (
                  <p className="text-sm text-red-400">
                    {passwordError}
                  </p>
                )}

                {updatePasswordMutation.isSuccess && (
                  <p className="text-sm text-green-400">
                    Password updated.
                  </p>
                )}

                <SubmitButton
                  label="Update Password"
                  loading={updatePasswordMutation.isPending}
                />
              </form>
            </Panel>
          </section>

          <Panel
            title="Current Admin Accounts"
            description="Accounts that can sign in to the security dashboard."
          >
            {users.length === 0 ? (
              <p className="text-sm text-slate-500">
                No user accounts found.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-lg border border-slate-700 bg-slate-800 p-4"
                  >
                    <p className="font-semibold">
                      {user.full_name}
                    </p>
                    <p className="text-sm text-slate-400">
                      {user.role} - {user.email || "No email"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {user.phone_number || "No phone"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </main>
      </div>
    </div>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900 p-4 sm:p-5">
      <h2 className="text-xl font-semibold">
        {title}
      </h2>
      <p className="mb-5 mt-1 text-sm text-slate-400">
        {description}
      </p>
      {children}
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  action,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <label className="block text-sm text-slate-300">
      <span className="mb-1 block">{label}</span>
      <span className="flex min-h-12 items-center rounded-lg border border-slate-700 bg-slate-800 focus-within:border-blue-500">
        <input
          type={type}
          value={value}
          required={required}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="min-h-12 w-full rounded-lg bg-transparent px-3 py-2 text-base text-white outline-none"
        />
        {action}
      </span>
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block text-sm text-slate-300">
      <span className="mb-1 block">{label}</span>
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="min-h-12 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-base text-white outline-none focus:border-blue-500"
      >
        {options.map(([optionValue, labelText]) => (
          <option
            key={optionValue}
            value={optionValue}
          >
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}

function PasswordToggle({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-12 px-3 text-sm font-semibold text-blue-300 hover:text-blue-200"
    >
      {visible ? "Hide" : "Show"}
    </button>
  );
}

function SubmitButton({
  label,
  loading,
}: {
  label: string;
  loading: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="min-h-12 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Saving..." : label}
    </button>
  );
}
