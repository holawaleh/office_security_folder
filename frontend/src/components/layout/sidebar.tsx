import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="border-b border-slate-800 bg-slate-950 p-4 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:p-6">

      <h1 className="mb-4 text-xl font-bold text-white lg:mb-10 lg:text-2xl">
        Smart Access
      </h1>

      <nav className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:block lg:space-y-3">

        <Link
          to="/dashboard"
          className="min-h-11 rounded-lg bg-slate-900 px-3 py-3 text-center text-sm font-semibold text-slate-300 hover:text-white lg:block lg:bg-transparent lg:text-left"
        >
          Dashboard
        </Link>

        <Link
          to="/devices"
          className="min-h-11 rounded-lg bg-slate-900 px-3 py-3 text-center text-sm font-semibold text-slate-300 hover:text-white lg:block lg:bg-transparent lg:text-left"
        >
          Devices
        </Link>

        <Link
          to="/access-logs"
          className="min-h-11 rounded-lg bg-slate-900 px-3 py-3 text-center text-sm font-semibold text-slate-300 hover:text-white lg:block lg:bg-transparent lg:text-left"
        >
          Access Logs
        </Link>

        <Link
          to="/visitors"
          className="min-h-11 rounded-lg bg-slate-900 px-3 py-3 text-center text-sm font-semibold text-slate-300 hover:text-white lg:block lg:bg-transparent lg:text-left"
        >
          Visitors
        </Link>

        <Link
          to="/settings"
          className="min-h-11 rounded-lg bg-slate-900 px-3 py-3 text-center text-sm font-semibold text-slate-300 hover:text-white lg:block lg:bg-transparent lg:text-left"
        >
          Settings
        </Link>

      </nav>

    </aside>
  );
}
