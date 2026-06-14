import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAccessPerson,
  getAccessPeople,
} from "../api/access-api";
import {
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

type DashboardSection =
  | "overview"
  | "people"
  | "visitors"
  | "devices";

const sections: {
  id: DashboardSection;
  label: string;
}[] = [
  { id: "overview", label: "Overview" },
  { id: "people", label: "People" },
  { id: "visitors", label: "Visitors" },
  { id: "devices", label: "Devices" },
];

const initialDeviceForm = {
  name: "",
  serial_number: "",
  location: "",
  ip_address: "",
  firmware_version: "",
  status: "OFFLINE",
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

export default function DashboardPage({
  initialSection = "overview",
}: {
  initialSection?: DashboardSection;
}) {
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] =
    useState<DashboardSection>(initialSection);
  const [deviceForm, setDeviceForm] =
    useState(initialDeviceForm);
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

  const activePeople = people.filter(
    (person) => person.is_active
  );

  const pendingVisitors = visitors.filter(
    (visitor) => visitor.status === "PENDING"
  );

  const todayVisitors = visitors.filter((visitor) => {
    if (!visitor.expected_arrival) {
      return false;
    }

    return (
      new Date(visitor.expected_arrival).toDateString() ===
      new Date().toDateString()
    );
  });

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
    <div className="min-h-screen bg-slate-950 text-white lg:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Topbar />

        <main className="mx-auto max-w-7xl space-y-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <header className="space-y-1">
            <p className="text-sm text-slate-400">
              Office security command center
            </p>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Smart Access Dashboard
            </h1>
          </header>

          {isLoading && (
            <StatusMessage>
              Loading security records...
            </StatusMessage>
          )}

          {hasError && (
            <StatusMessage tone="error">
              Some dashboard data failed to load.
            </StatusMessage>
          )}

          {!isLoading && (
            <>
              <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
                  label="Active People"
                  value={activePeople.length}
                />
                <SummaryCard
                  label="Pending Visitors"
                  value={pendingVisitors.length}
                  tone="text-amber-300"
                />
              </section>

              <nav
                aria-label="Dashboard sections"
                className="grid grid-cols-2 gap-2 rounded-lg border border-slate-800 bg-slate-900 p-2 sm:grid-cols-4"
              >
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() =>
                      setActiveSection(section.id)
                    }
                    className={
                      activeSection === section.id
                        ? "min-h-12 rounded-md bg-blue-600 px-3 py-3 text-sm font-semibold text-white"
                        : "min-h-12 rounded-md px-3 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
                    }
                  >
                    {section.label}
                  </button>
                ))}
              </nav>

              {activeSection === "overview" && (
                <OverviewSection
                  devices={devices}
                  users={users}
                  people={people}
                  visitors={visitors}
                  onlineDevices={onlineDevices.length}
                  offlineDevices={offlineDevices.length}
                  todayVisitors={todayVisitors.length}
                  pendingVisitors={pendingVisitors.length}
                  onOpenSection={setActiveSection}
                />
              )}

              {activeSection === "people" && (
                <PeopleSection
                  people={people}
                  form={personForm}
                  setForm={setPersonForm}
                  loading={createPersonMutation.isPending}
                  onSubmit={() => {
                    createPersonMutation.mutate({
                      ...personForm,
                      employee_id:
                        personForm.employee_id || null,
                      rfid_uid:
                        personForm.rfid_uid || null,
                      fingerprint_id:
                        personForm.fingerprint_id
                          ? Number(
                              personForm.fingerprint_id
                            )
                          : null,
                    });
                  }}
                />
              )}

              {activeSection === "visitors" && (
                <VisitorsSection
                  visitors={visitors}
                  form={visitorForm}
                  setForm={setVisitorForm}
                  loading={createVisitorMutation.isPending}
                  onSubmit={() => {
                    createVisitorMutation.mutate({
                      ...visitorForm,
                      expected_arrival:
                        visitorForm.expected_arrival ||
                        null,
                    });
                  }}
                />
              )}

              {activeSection === "devices" && (
                <DevicesSection
                  devices={devices}
                  form={deviceForm}
                  setForm={setDeviceForm}
                  loading={createDeviceMutation.isPending}
                  onSubmit={() => {
                    createDeviceMutation.mutate({
                      ...deviceForm,
                      ip_address:
                        deviceForm.ip_address || undefined,
                      firmware_version:
                        deviceForm.firmware_version ||
                        undefined,
                    });
                  }}
                />
              )}

            </>
          )}
        </main>
      </div>
    </div>
  );
}

function OverviewSection({
  devices,
  users,
  people,
  visitors,
  onlineDevices,
  offlineDevices,
  todayVisitors,
  pendingVisitors,
  onOpenSection,
}: {
  devices: ReturnType<typeof getDevices> extends Promise<infer T>
    ? T
    : never;
  users: ReturnType<typeof getUserProfiles> extends Promise<infer T>
    ? T
    : never;
  people: ReturnType<typeof getAccessPeople> extends Promise<infer T>
    ? T
    : never;
  visitors: ReturnType<typeof getVisitors> extends Promise<infer T>
    ? T
    : never;
  onlineDevices: number;
  offlineDevices: number;
  todayVisitors: number;
  pendingVisitors: number;
  onOpenSection: (section: DashboardSection) => void;
}) {
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ActivityPanel title="Activity Summary">
          <ActivityRow
            label="Devices online"
            value={`${onlineDevices}/${devices.length}`}
            tone="text-green-400"
          />
          <ActivityRow
            label="Devices needing attention"
            value={offlineDevices}
            tone={
              offlineDevices > 0
                ? "text-red-400"
                : "text-slate-200"
            }
          />
          <ActivityRow
            label="Visitors expected today"
            value={todayVisitors}
          />
          <ActivityRow
            label="Visitors awaiting action"
            value={pendingVisitors}
            tone="text-amber-300"
          />
        </ActivityPanel>

        <ActivityPanel title="Quick Actions">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <ActionButton
              label="Add Device"
              onClick={() => onOpenSection("devices")}
            />
            <ActionButton
              label="Register Person"
              onClick={() => onOpenSection("people")}
            />
            <ActionButton
              label="Add Visitor"
              onClick={() => onOpenSection("visitors")}
            />
            <ActionLink
              label="Open Settings"
              to="/settings"
            />
          </div>
        </ActivityPanel>

        <ActivityPanel title="System Coverage">
          <ActivityRow
            label="Registered people"
            value={people.length}
          />
          <ActivityRow
            label="Admin accounts"
            value={users.length}
          />
          <ActivityRow
            label="Visitor records"
            value={visitors.length}
          />
          <ActivityRow
            label="Registered devices"
            value={devices.length}
          />
        </ActivityPanel>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ActivityPanel title="Recent Visitors">
          <CompactList
            emptyText="No recent visitors"
            items={visitors.slice(0, 5).map((visitor) => ({
              title: visitor.full_name,
              meta: `${visitor.effective_visit_usage} - ${visitor.status} - ${visitor.host_name}`,
            }))}
          />
        </ActivityPanel>

        <ActivityPanel title="Device Status">
          {devices.length === 0 ? (
            <EmptyState
              title="No devices added"
              body="Add a device to start monitoring terminal locations, firmware, and heartbeat status."
            />
          ) : (
            <CompactList
              emptyText="No devices added"
              items={devices.slice(0, 5).map((device) => ({
                title: device.name,
                meta: `${device.status} - ${device.location} - Last seen: ${formatDate(device.last_seen)}`,
              }))}
            />
          )}
        </ActivityPanel>
      </section>
    </div>
  );
}

function PeopleSection({
  people,
  form,
  setForm,
  loading,
  onSubmit,
}: {
  people: ReturnType<typeof getAccessPeople> extends Promise<infer T>
    ? T
    : never;
  form: typeof initialPersonForm;
  setForm: (form: typeof initialPersonForm) => void;
  loading: boolean;
  onSubmit: () => void;
}) {
  return (
    <ManagementLayout
      title="People Directory"
      description="Register staff, office workers, visitors, contractors, and security users who need access records."
      listTitle="Registered People"
      list={
        <CompactList
          emptyText="No people added yet"
          items={people.slice(0, 8).map((person) => ({
            title: person.full_name,
            meta: `${person.person_type} - ${person.phone_number || "No phone"} - ${person.email || "No email"}`,
          }))}
        />
      }
    >
      <form
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Input
          label="Full name"
          value={form.full_name}
          onChange={(value) =>
            setForm({ ...form, full_name: value })
          }
          required
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
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(value) =>
            setForm({ ...form, email: value })
          }
        />
        <Select
          label="Person type"
          value={form.person_type}
          onChange={(value) =>
            setForm({
              ...form,
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
          value={form.employee_id}
          onChange={(value) =>
            setForm({
              ...form,
              employee_id: value,
            })
          }
        />
        <Input
          label="RFID UID"
          value={form.rfid_uid}
          onChange={(value) =>
            setForm({ ...form, rfid_uid: value })
          }
        />
        <Input
          label="Fingerprint ID"
          type="number"
          value={form.fingerprint_id}
          onChange={(value) =>
            setForm({
              ...form,
              fingerprint_id: value,
            })
          }
        />
        <Select
          label="Access level"
          value={form.access_level}
          onChange={(value) =>
            setForm({
              ...form,
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
          loading={loading}
        />
      </form>
    </ManagementLayout>
  );
}

function VisitorsSection({
  visitors,
  form,
  setForm,
  loading,
  onSubmit,
}: {
  visitors: ReturnType<typeof getVisitors> extends Promise<infer T>
    ? T
    : never;
  form: typeof initialVisitorForm;
  setForm: (form: typeof initialVisitorForm) => void;
  loading: boolean;
  onSubmit: () => void;
}) {
  return (
    <ManagementLayout
      title="Visitor Desk"
      description="Create visitor records, access codes, and visit purpose details before arrival."
      listTitle="Recent Visitors"
      list={
        <CompactList
          emptyText="No visitors added yet"
          items={visitors.slice(0, 8).map((visitor) => ({
            title: visitor.full_name,
            meta: `${visitor.effective_visit_usage} - ${visitor.status} - ${visitor.host_name}`,
          }))}
        />
      }
    >
      <form
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Input
          label="Full name"
          value={form.full_name}
          onChange={(value) =>
            setForm({ ...form, full_name: value })
          }
          required
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
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(value) =>
            setForm({ ...form, email: value })
          }
        />
        <Input
          label="Host name"
          value={form.host_name}
          onChange={(value) =>
            setForm({ ...form, host_name: value })
          }
          required
        />
        <Select
          label="Visit usage"
          value={form.visit_usage}
          onChange={(value) =>
            setForm({
              ...form,
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
          value={form.custom_visit_usage}
          onChange={(value) =>
            setForm({
              ...form,
              custom_visit_usage: value,
            })
          }
        />
        <Input
          label="Access code"
          value={form.access_code}
          onChange={(value) =>
            setForm({ ...form, access_code: value })
          }
          required
        />
        <Input
          label="Expected arrival"
          type="datetime-local"
          value={form.expected_arrival}
          onChange={(value) =>
            setForm({
              ...form,
              expected_arrival: value,
            })
          }
        />
        <Textarea
          label="Purpose"
          value={form.purpose}
          onChange={(value) =>
            setForm({ ...form, purpose: value })
          }
        />
        <SubmitButton
          label="Add Visitor"
          loading={loading}
        />
      </form>
    </ManagementLayout>
  );
}

function DevicesSection({
  devices,
  form,
  setForm,
  loading,
  onSubmit,
}: {
  devices: ReturnType<typeof getDevices> extends Promise<infer T>
    ? T
    : never;
  form: typeof initialDeviceForm;
  setForm: (form: typeof initialDeviceForm) => void;
  loading: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-6">
      {devices.length === 0 && (
        <StatusMessage tone="warning">
          No devices exist yet. Add the first device so terminals can report heartbeat activity.
        </StatusMessage>
      )}

      <ManagementLayout
        title="Device Setup"
        description="Register access terminals and monitor their location, serial number, firmware, IP address, and heartbeat status."
        listTitle="Device Inventory"
        list={<DeviceInventory devices={devices} />}
      >
        <div className="mb-5 rounded-lg border border-slate-700 bg-slate-800 p-4 text-sm text-slate-300">
          Add the device name, unique serial number, physical
          location, optional IP address, and firmware version.
          The serial number must match the value sent by the
          device heartbeat endpoint.
        </div>

        <form
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <Input
            label="Device name"
            value={form.name}
            onChange={(value) =>
              setForm({ ...form, name: value })
            }
            required
          />
          <Input
            label="Serial number"
            value={form.serial_number}
            onChange={(value) =>
              setForm({
                ...form,
                serial_number: value,
              })
            }
            required
          />
          <Input
            label="Location"
            value={form.location}
            onChange={(value) =>
              setForm({ ...form, location: value })
            }
            required
          />
          <Input
            label="IP address"
            value={form.ip_address}
            onChange={(value) =>
              setForm({ ...form, ip_address: value })
            }
          />
          <Input
            label="Firmware"
            value={form.firmware_version}
            onChange={(value) =>
              setForm({
                ...form,
                firmware_version: value,
              })
            }
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(value) =>
              setForm({ ...form, status: value })
            }
            options={[
              ["OFFLINE", "Offline"],
              ["ONLINE", "Online"],
              ["MAINTENANCE", "Maintenance"],
            ]}
          />
          <SubmitButton
            label="Add Device"
            loading={loading}
          />
        </form>
      </ManagementLayout>
    </div>
  );
}

function ManagementLayout({
  title,
  description,
  listTitle,
  list,
  children,
}: {
  title: string;
  description: string;
  listTitle: string;
  list: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 sm:p-5">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {description}
          </p>
        </div>
        {children}
      </div>

      <aside className="rounded-lg border border-slate-800 bg-slate-900 p-4 sm:p-5">
        <h3 className="text-lg font-semibold">
          {listTitle}
        </h3>
        {list}
      </aside>
    </section>
  );
}

function DeviceInventory({
  devices,
}: {
  devices: ReturnType<typeof getDevices> extends Promise<infer T>
    ? T
    : never;
}) {
  if (devices.length === 0) {
    return (
      <EmptyState
        title="No devices connected yet"
        body="Add a device to begin monitoring location, serial number, firmware, and heartbeat state."
      />
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {devices.map((device) => (
        <div
          key={device.id}
          className="rounded-lg border border-slate-700 bg-slate-800 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{device.name}</p>
              <p className="text-sm text-slate-400">
                {device.location}
              </p>
            </div>
            <p
              className={
                device.status === "ONLINE"
                  ? "font-semibold text-green-400"
                  : "font-semibold text-red-400"
              }
            >
              {device.status}
            </p>
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <Info
              label="Serial"
              value={device.serial_number}
            />
            <Info
              label="IP address"
              value={device.ip_address || "Not assigned"}
            />
            <Info
              label="Firmware"
              value={
                device.firmware_version || "Not recorded"
              }
            />
            <Info
              label="Last seen"
              value={formatDate(device.last_seen)}
            />
          </dl>
        </div>
      ))}
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
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 sm:p-5">
      <h2 className="text-sm text-slate-400">
        {label}
      </h2>
      <p className={`mt-2 text-3xl font-bold ${tone}`}>
        {value}
      </p>
    </div>
  );
}

function ActivityPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900 p-4 sm:p-5">
      <h2 className="mb-4 text-lg font-semibold">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ActivityRow({
  label,
  value,
  tone = "text-slate-100",
}: {
  label: string;
  value: number | string;
  tone?: string;
}) {
  return (
    <div className="flex min-h-12 items-center justify-between border-b border-slate-800 py-2 last:border-b-0">
      <span className="text-sm text-slate-400">
        {label}
      </span>
      <span className={`text-lg font-semibold ${tone}`}>
        {value}
      </span>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-12 rounded-lg bg-slate-800 px-4 py-3 text-left font-semibold text-slate-100 hover:bg-blue-600"
    >
      {label}
    </button>
  );
}

function ActionLink({
  label,
  to,
}: {
  label: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="flex min-h-12 items-center rounded-lg bg-slate-800 px-4 py-3 text-left font-semibold text-slate-100 hover:bg-blue-600"
    >
      {label}
    </Link>
  );
}

function StatusMessage({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "error" | "warning";
}) {
  const className =
    tone === "error"
      ? "border-red-400/30 bg-red-400/10 text-red-200"
      : tone === "warning"
        ? "border-amber-400/30 bg-amber-400/10 text-amber-100"
        : "border-slate-700 bg-slate-900 text-slate-300";

  return (
    <div className={`rounded-lg border p-4 ${className}`}>
      {children}
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
        className="min-h-12 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-base text-white outline-none focus:border-blue-500"
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
    <label className="block text-sm text-slate-300 md:col-span-2">
      <span className="mb-1 block">{label}</span>
      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="min-h-28 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-base text-white outline-none focus:border-blue-500"
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
      className="min-h-12 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
    <div className="mt-4 space-y-2">
      {items.map((item) => (
        <div
          key={`${item.title}-${item.meta}`}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-3"
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

function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="mt-4 rounded-lg border border-dashed border-slate-700 p-6 text-center">
      <p className="font-semibold text-slate-200">
        {title}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        {body}
      </p>
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
