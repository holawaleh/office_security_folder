export default function Topbar() {
  return (
    <header className="min-h-16 border-b border-slate-800 flex items-center justify-between gap-4 px-4 sm:px-6 bg-slate-950">

      <div className="min-w-0">
        <h2 className="truncate text-white text-base sm:text-lg font-semibold">
          Smart Access System
        </h2>
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
        className="min-h-11 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
      >
        Logout
      </button>

    </header>
  );
}
