export default function Topbar() {
  return (
    <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950">

      <div>
        <h2 className="text-white text-lg font-semibold">
          Smart Access System
        </h2>
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
      >
        Logout
      </button>

    </header>
  );
}