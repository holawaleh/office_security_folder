import Sidebar from "../components/layout/sidebar";
import Topbar from "../components/layout/topbar";

export default function AccessLogsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white lg:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Topbar />

        <main className="mx-auto max-w-7xl space-y-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <header>
            <p className="text-sm text-slate-400">
              Entry and access activity
            </p>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Access Logs
            </h1>
          </header>

          <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-semibold">
              Activity feed
            </h2>
            <p className="mt-2 text-slate-400">
              Access event reporting is ready for a dedicated
              feed here. The dashboard currently summarizes
              devices, people, and visitor activity.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
