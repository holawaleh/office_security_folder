import { useState } from "react";
import type { ReactNode } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAccessPerson,
  getAccessPeople,
} from "../api/access-api";
import {
  createUserProfile,
  getUserProfiles,
} from "../api/account-api";
import {
  createDevice,
  getDevices,
} from "../api/device-api";
import {
  createVisitor,
  getVisitors,
} from "../api/visitor-api";
import Sidebar from "../components/layout/sidebar";
import Topbar from "../components/layout/topbar";

const initialDeviceForm = {
  name: "",
  serial_number: "",
  location: "",
  ip_address: "",
  firmware_version: "",
  status: "OFFLINE",
};

const initialAdminForm = {
  username: "",
  password: "",
  email: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  role: "ADMIN",
};

const initialPersonForm = {
  full_name: "",
  phone_number: "",
  email: "",
  person_type: "STAFF",
  employee_id: "",
  rfid_uid: "",
  fingerprint_id: "",
  access_level: "STAFF",
  is_active: true,
};

const initialVisitorForm = {
  full_name: "",
  phone_number: "",
  email: "",
  host_name: "",
  visit_usage: "MEETING",
  custom_visit_usage: "",
  purpose: "",
  access_code: "",
  status: "PENDING",
  approved_by: "",
  expected_arrival: "",
};

function formatDate(value: string | null) {
  if (!value) {
    return "Not recorded";
  }

  return new Date(value).toLocaleString();
}

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [deviceForm, setDeviceForm] =
    useState(initialDeviceForm);
  const [adminForm, setAdminForm] =
    useState(initialAdminForm);
  const [personForm, setPersonForm] =
    useState(initialPersonForm);
  const [visitorForm, setVisitorForm] =
    useState(initialVisitorForm);

  const devicesQuery = useQuery({
    queryKey: ["devices"],
    queryFn: getDevices,
  });

  const usersQuery = useQuery({
    queryKey: ["user-profiles"],
    queryFn: getUserProfiles,
  });

  const peopleQuery = useQuery({
    queryKey: ["access-people"],
    queryFn: getAccessPeople,
  });

  const visitorsQuery = useQuery({
    queryKey: ["visitors"],
    queryFn: getVisitors,
  });

  const createDeviceMutation = useMutation({
    mutationFn: createDevice,
    onSuccess: () => {
      setDeviceForm(initialDeviceForm);
      queryClient.invalidateQueries({
        queryKey: ["devices"],
      });
    },
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

  const createPersonMutation = useMutation({
    mutationFn: createAccessPerson,
    onSuccess: () => {
      setPersonForm(initialPersonForm);
      queryClient.invalidateQueries({
        queryKey: ["access-people"],
      });
    },
  });

  const createVisitorMutation = useMutation({
    mutationFn: createVisitor,
    onSuccess: () => {
      setVisitorForm(initialVisitorForm);
      queryClient.invalidateQueries({
        queryKey: ["visitors"],
      });
    },
  });

  const devices = devicesQuery.data || [];
  const users = usersQuery.data || [];
  const people = peopleQuery.data || [];
  const visitors = visitorsQuery.data || [];

  const onlineDevices = devices.filter(
    (device) => device.status === "ONLINE"
  );

  const offlineDevices = devices.filter(
    (device) => device.status !== "ONLINE"
  );

  const pendingVisitors = visitors.filter(
    (visitor) => visitor.status === "PENDING"
  );

  const isLoading =
    devicesQuery.isLoading ||
    usersQuery.isLoading ||
    peopleQuery.isLoading ||
    visitorsQuery.isLoading;

  const hasError =
    devicesQuery.error ||
    usersQuery.error ||
    peopleQuery.error ||
    visitorsQuery.error;

  return (
    <div className="flex bg-slate-950 min-h-screen">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="p-6 lg:p-10 text-white space-y-8">
          <div>
            <p className="text-slate-400">
              Office security command center
            </p>
            <h1 className="text-3xl font-bold">
              Smart Access Dashboard
            </h1>
          </div>

          {isLoading && (
            <div className="text-slate-300">
              Loading security records...
            </div>
          )}

          {hasError && (
            <div className="text-red-400">
              Some dashboard data failed to load.
            </div>
          )}

          {!isLoading && (
            <>
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SummaryCard
                  label="Devices"
                  value={devices.length}
                />
                <SummaryCard
                  label="Online"
                  value={onlineDevices.length}
                  tone="text-green-400"
                />
                <SummaryCard
                  label="Offline"
                  value={offlineDevices.length}
                  tone="text-red-400"
                />
                <SummaryCard
                  label="Pending Visitors"
                  value={pendingVisitors.length}
                  tone="text-amber-300"
                />
              </section>

              <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Panel title="Owner Admins">
                  <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
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
                      type="password"
                      value={adminForm.password}
                      onChange={(value) =>
                        setAdminForm({
                          ...adminForm,
                          password: value,
                        })
                      }
                      required
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

                  <CompactList
                    emptyText="No admin users listed yet"
                    items={users.slice(0, 5).map((user) => ({
                      title: user.full_name,
                      meta: `${user.role} - ${user.email || "No email"}`,
                    }))}
                  />
                </Panel>

                <Panel title="Add People">
                  <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      createPersonMutation.mutate({
                        ...personForm,
                        employee_id:
                          personForm.employee_id || null,
                        rfid_uid: personForm.rfid_uid || null,
                        fingerprint_id:
                          personForm.fingerprint_id
                            ? Number(
                                personForm.fingerprint_id
                              )
                            : null,
                      });
                    }}
                  >
                    <Input
                      label="Full name"
                      value={personForm.full_name}
                      onChange={(value) =>
                        setPersonForm({
                          ...personForm,
                          full_name: value,
                        })
                      }
                      required
                    />
                    <Input
                      label="Phone"
                      value={personForm.phone_number}
                      onChange={(value) =>
                        setPersonForm({
                          ...personForm,
                          phone_number: value,
                        })
                      }
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={personForm.email}
                      onChange={(value) =>
                        setPersonForm({
                          ...personForm,
                          email: value,
                        })
                      }
                    />
                    <Select
                      label="Person type"
                      value={personForm.person_type}
                      onChange={(value) =>
                        setPersonForm({
                          ...personForm,
                          person_type: value,
                        })
                      }
                      options={[
                        ["STAFF", "Staff"],
                        ["VISITOR", "Visitor"],
                        ["OFFICE_WORKER", "Office worker"],
                        ["CONTRACTOR", "Contractor"],
                        ["SECURITY", "Security"],
                        ["OTHER", "Other"],
                      ]}
                    />
                    <Input
                      label="Employee ID"
                      value={personForm.employee_id}
                      onChange={(value) =>
                        setPersonForm({
                          ...personForm,
                          employee_id: value,
                        })
                      }
                    />
                    <Input
                      label="RFID UID"
                      value={personForm.rfid_uid}
                      onChange={(value) =>
                        setPersonForm({
                          ...personForm,
                          rfid_uid: value,
                        })
                      }
                    />
                    <Input
                      label="Fingerprint ID"
                      type="number"
                      value={personForm.fingerprint_id}
                      onChange={(value) =>
                        setPersonForm({
                          ...personForm,
                          fingerprint_id: value,
                        })
                      }
                    />
                    <Select
                      label="Access level"
                      value={personForm.access_level}
                      onChange={(value) =>
                        setPersonForm({
                          ...personForm,
                          access_level: value,
                        })
                      }
                      options={[
                        ["ADMIN", "Admin"],
                        ["STAFF", "Staff"],
                        ["SECURITY", "Security"],
                        ["CONTRACTOR", "Contractor"],
                      ]}
                    />
                    <SubmitButton
                      label="Add Person"
                      loading={createPersonMutation.isPending}
                    />
                  </form>

                  <CompactList
                    emptyText="No people added yet"
                    items={people.slice(0, 5).map((person) => ({
                      title: person.full_name,
                      meta: `${person.person_type} - ${person.phone_number || "No phone"} - ${person.email || "No email"}`,
                    }))}
                  />
                </Panel>
              </section>

              <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Panel title="Add Visitor">
                  <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      createVisitorMutation.mutate({
                        ...visitorForm,
                        expected_arrival:
                          visitorForm.expected_arrival ||
                          null,
                      });
                    }}
                  >
                    <Input
                      label="Full name"
                      value={visitorForm.full_name}
                      onChange={(value) =>
                        setVisitorForm({
                          ...visitorForm,
                          full_name: value,
                        })
                      }
                      required
                    />
                    <Input
                      label="Phone"
                      value={visitorForm.phone_number}
                      onChange={(value) =>
                        setVisitorForm({
                          ...visitorForm,
                          phone_number: value,
                        })
                      }
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={visitorForm.email}
                      onChange={(value) =>
                        setVisitorForm({
                          ...visitorForm,
                          email: value,
                        })
                      }
                    />
                    <Input
                      label="Host name"
                      value={visitorForm.host_name}
                      onChange={(value) =>
                        setVisitorForm({
                          ...visitorForm,
                          host_name: value,
                        })
                      }
                      required
                    />
                    <Select
                      label="Visit usage"
                      value={visitorForm.visit_usage}
                      onChange={(value) =>
                        setVisitorForm({
                          ...visitorForm,
                          visit_usage: value,
                        })
                      }
                      options={[
                        ["MEETING", "Meeting"],
                        ["DELIVERY", "Delivery"],
                        ["INTERVIEW", "Interview"],
                        ["MAINTENANCE", "Maintenance"],
                        ["OFFICIAL", "Official"],
                        ["CUSTOM", "Custom"],
                      ]}
                    />
                    <Input
                      label="Custom usage"
                      value={visitorForm.custom_visit_usage}
                      onChange={(value) =>
                        setVisitorForm({
                          ...visitorForm,
                          custom_visit_usage: value,
                        })
                      }
                    />
                    <Input
                      label="Access code"
                      value={visitorForm.access_code}
                      onChange={(value) =>
                        setVisitorForm({
                          ...visitorForm,
                          access_code: value,
                        })
                      }
                      required
                    />
                    <Input
                      label="Expected arrival"
                      type="datetime-local"
                      value={visitorForm.expected_arrival}
                      onChange={(value) =>
                        setVisitorForm({
                          ...visitorForm,
                          expected_arrival: value,
                        })
                      }
                    />
                    <Textarea
                      label="Purpose"
                      value={visitorForm.purpose}
                      onChange={(value) =>
                        setVisitorForm({
                          ...visitorForm,
                          purpose: value,
                        })
                      }
                    />
                    <SubmitButton
                      label="Add Visitor"
                      loading={createVisitorMutation.isPending}
                    />
                  </form>

                  <CompactList
                    emptyText="No visitors added yet"
                    items={visitors.slice(0, 5).map((visitor) => ({
                      title: visitor.full_name,
                      meta: `${visitor.effective_visit_usage} - ${visitor.status} - ${visitor.host_name}`,
                    }))}
                  />
                </Panel>

                <Panel title="Devices">
                  {devices.length === 0 && (
                    <div className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-amber-100">
                      No devices exist yet. Add the first device
                      so Raspberry Pi or fingerprint terminals can
                      report heartbeats.
                    </div>
                  )}

                  <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      createDeviceMutation.mutate({
                        ...deviceForm,
                        ip_address:
                          deviceForm.ip_address || undefined,
                        firmware_version:
                          deviceForm.firmware_version ||
                          undefined,
                      });
                    }}
                  >
                    <Input
                      label="Device name"
                      value={deviceForm.name}
                      onChange={(value) =>
                        setDeviceForm({
                          ...deviceForm,
                          name: value,
                        })
                      }
                      required
                    />
                    <Input
                      label="Serial number"
                      value={deviceForm.serial_number}
                      onChange={(value) =>
                        setDeviceForm({
                          ...deviceForm,
                          serial_number: value,
                        })
                      }
                      required
                    />
                    <Input
                      label="Location"
                      value={deviceForm.location}
                      onChange={(value) =>
                        setDeviceForm({
                          ...deviceForm,
                          location: value,
                        })
                      }
                      required
                    />
                    <Input
                      label="IP address"
                      value={deviceForm.ip_address}
                      onChange={(value) =>
                        setDeviceForm({
                          ...deviceForm,
                          ip_address: value,
                        })
                      }
                    />
                    <Input
                      label="Firmware"
                      value={deviceForm.firmware_version}
                      onChange={(value) =>
                        setDeviceForm({
                          ...deviceForm,
                          firmware_version: value,
                        })
                      }
                    />
                    <Select
                      label="Status"
                      value={deviceForm.status}
                      onChange={(value) =>
                        setDeviceForm({
                          ...deviceForm,
                          status: value,
                        })
                      }
                      options={[
                        ["OFFLINE", "Offline"],
                        ["ONLINE", "Online"],
                        ["MAINTENANCE", "Maintenance"],
                      ]}
                    />
                    <SubmitButton
                      label="Add Device"
                      loading={createDeviceMutation.isPending}
                    />
                  </form>
                </Panel>
              </section>

              <section className="bg-slate-900 rounded-lg p-5 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    Device Inventory
                  </h2>
                </div>

                {devices.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-300">
                      No devices connected yet
                    </p>
                    <p className="text-slate-500">
                      Add a device above to begin monitoring
                      location, serial number, firmware, and
                      heartbeat state.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {devices.map((device) => (
                      <div
                        key={device.id}
                        className="bg-slate-800 p-4 rounded-lg border border-slate-700"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-lg">
                              {device.name}
                            </p>
                            <p className="text-sm text-slate-400">
                              {device.location}
                            </p>
                          </div>
                          <p
                            className={
                              device.status === "ONLINE"
                                ? "text-green-400 font-semibold"
                                : "text-red-400 font-semibold"
                            }
                          >
                            {device.status}
                          </p>
                        </div>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
                          <Info
                            label="Serial"
                            value={device.serial_number}
                          />
                          <Info
                            label="IP address"
                            value={
                              device.ip_address ||
                              "Not assigned"
                            }
                          />
                          <Info
                            label="Firmware"
                            value={
                              device.firmware_version ||
                              "Not recorded"
                            }
                          />
                          <Info
                            label="Last seen"
                            value={formatDate(
                              device.last_seen
                            )}
                          />
                        </dl>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone = "text-white",
}: {
  label: string;
  value: number;
  tone?: string;
}) {
  return (
    <div className="bg-slate-900 p-5 rounded-lg border border-slate-800">
      <h2 className="text-slate-400 text-sm">
        {label}
      </h2>
      <p className={`text-3xl font-bold mt-2 ${tone}`}>
        {value}
      </p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-slate-900 rounded-lg p-5 border border-slate-800">
      <h2 className="text-xl font-semibold mb-4">
        {title}
      </h2>
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
        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white outline-none focus:border-blue-500"
      />
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
        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white outline-none focus:border-blue-500"
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

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block md:col-span-2 text-sm text-slate-300">
      <span className="mb-1 block">{label}</span>
      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full min-h-24 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white outline-none focus:border-blue-500"
      />
    </label>
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
      className="self-end rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Saving..." : label}
    </button>
  );
}

function CompactList({
  emptyText,
  items,
}: {
  emptyText: string;
  items: { title: string; meta: string }[];
}) {
  if (items.length === 0) {
    return (
      <p className="mt-4 text-sm text-slate-500">
        {emptyText}
      </p>
    );
  }

  return (
    <div className="mt-5 space-y-2">
      {items.map((item) => (
        <div
          key={`${item.title}-${item.meta}`}
          className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2"
        >
          <p className="font-medium">{item.title}</p>
          <p className="text-sm text-slate-400">
            {item.meta}
          </p>
        </div>
      ))}
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-200">{value}</dd>
    </div>
  );
}
