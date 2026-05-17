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

  if (isLoading) {
    return (
      <div className="p-10 text-white">
        Loading devices...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-400">
        Failed to load devices
      </div>
    );
  }

  const onlineDevices =
    devices?.filter(
      (d) => d.status === "ONLINE"
    ) || [];

  const offlineDevices =
    devices?.filter(
      (d) => d.status !== "ONLINE"
    ) || [];

  return (
    <div className="p-10 text-white">

      <h1 className="text-4xl font-bold mb-8">
        Smart Access Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-slate-400">
            Total Devices
          </h2>

          <p className="text-4xl font-bold mt-2">
            {devices?.length || 0}
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-slate-400">
            Online Devices
          </h2>

          <p className="text-4xl font-bold mt-2 text-green-400">
            {onlineDevices.length}
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-slate-400">
            Offline Devices
          </h2>

          <p className="text-4xl font-bold mt-2 text-red-400">
            {offlineDevices.length}
          </p>
        </div>

      </div>

      {/* Device List */}
      <div className="bg-slate-900 rounded-2xl p-6">

        <h2 className="text-2xl font-semibold mb-6">
          Devices
        </h2>

        <div className="space-y-4">

          {devices?.map((device) => (
            <div
              key={device.id}
              className="bg-slate-800 p-4 rounded-xl flex justify-between items-center"
            >

              <div>
                <p className="font-semibold">
                  {device.name}
                </p>

                <p className="text-sm text-slate-400">
                  {device.ip_address}
                </p>
              </div>

              <div className="text-right">

                <p
                  className={
                    device.status === "ONLINE"
                      ? "text-green-400"
                      : "text-red-400"
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

    </div>
  );
}