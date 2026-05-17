import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 h-screen p-6">

      <h1 className="text-2xl font-bold text-white mb-10">
        Smart Access
      </h1>

      <nav className="space-y-4">

        <Link
          to="/dashboard"
          className="block text-slate-300 hover:text-white"
        >
          Dashboard
        </Link>

        <Link
          to="/devices"
          className="block text-slate-300 hover:text-white"
        >
          Devices
        </Link>

        <Link
          to="/access-logs"
          className="block text-slate-300 hover:text-white"
        >
          Access Logs
        </Link>

        <Link
          to="/visitors"
          className="block text-slate-300 hover:text-white"
        >
          Visitors
        </Link>

        <Link
          to="/settings"
          className="block text-slate-300 hover:text-white"
        >
          Settings
        </Link>

      </nav>

    </aside>
  );
}