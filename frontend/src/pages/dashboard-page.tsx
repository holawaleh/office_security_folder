import Sidebar from "../components/layout/sidebar";
import Topbar from "../components/layout/topbar";

import { useQuery } from "@tanstack/react-query";

import { getDevices } from "../api/device-api";

export default function DashboardPage() {

  const {
    data: devices,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["devices"],
    queryFn: getDevices,
  });

  const onlineDevices =
    devices?.filter(
      (d) => d.status === "ONLINE"
    ) || [];

  const offlineDevices =
    devices?.filter(
      (d) => d.status !== "ONLINE"
    ) || [];

  return (
    <div className="flex bg-slate-950 min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">

        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="p-10 text-white">

          {/* Loading State */}
          {isLoading && (
            <div className="text-white">
              Loading devices...
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-red-400">
              Failed to load devices
            </div>
          )}

          {/* Dashboard Content */}
          {!isLoading && !error && (
            <>
              <h1 className="text-4xl font-bold mb-8">
                Smart Access Dashboard
              </h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                {/* Total Devices */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                  <h2 className="text-slate-400">
                    Total Devices
                  </h2>

                  <p className="text-4xl font-bold mt-2">
                    {devices?.length || 0}
                  </p>
                </div>

                {/* Online Devices */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                  <h2 className="text-slate-400">
                    Online Devices
                  </h2>

                  <p className="text-4xl font-bold mt-2 text-green-400">
                    {onlineDevices.length}
                  </p>
                </div>

                {/* Offline Devices */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                  <h2 className="text-slate-400">
                    Offline Devices
                  </h2>

                  <p className="text-4xl font-bold mt-2 text-red-400">
                    {offlineDevices.length}
                  </p>
                </div>

              </div>

              {/* Device List */}
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

                <div className="flex items-center justify-between mb-6">

                  <h2 className="text-2xl font-semibold">
                    Devices
                  </h2>

                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white">
                    Add Device
                  </button>

                </div>

                {/* Empty State */}
                {devices?.length === 0 && (
                  <div className="text-center py-20">

                    <p className="text-slate-400 text-lg mb-4">
                      No devices connected yet
                    </p>

                    <p className="text-slate-500">
                      Registered Raspberry Pi devices will appear here
                    </p>

                  </div>
                )}

                {/* Device Cards */}
                <div className="space-y-4">

                  {devices?.map((device) => (
                    <div
                      key={device.id}
                      className="bg-slate-800 p-4 rounded-xl flex justify-between items-center border border-slate-700"
                    >

                      {/* Device Info */}
                      <div>

                        <p className="font-semibold text-lg">
                          {device.name}
                        </p>

                        <p className="text-sm text-slate-400">
                          {device.ip_address}
                        </p>

                      </div>

                      {/* Device Status */}
                      <div className="text-right">

                        <p
                          className={
                            device.status === "ONLINE"
                              ? "text-green-400 font-semibold"
                              : "text-red-400 font-semibold"
                          }
                        >
                          {device.status}
                        </p>

                        <p className="text-sm text-slate-500">
                          {device.last_heartbeat}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>

              </div>
            </>
          )}

        </main>

      </div>

    </div>
  );
}