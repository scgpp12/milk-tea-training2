import { useState } from "react";

const NAV_ITEMS = [
  { k: "home",      icon: "📋", label: "菜单" },
  { k: "simulate",  icon: "🎮", label: "模拟制作" },
  { k: "quiz",      icon: "🎯", label: "测验" },
  { k: "checklist", icon: "✅", label: "开班清单" },
  { k: "contacts",  icon: "📞", label: "联系" },
];

export default function Nav({ page, setPage }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-between h-14">
        <button
          onClick={() => setPage("home")}
          className="font-bold text-stone-800 text-lg flex items-center gap-2"
        >
          <span className="text-2xl">🧋</span>
          <span className="hidden sm:inline">Rui Tea 培训手册</span>
          <span className="sm:hidden font-bold">Rui Tea</span>
        </button>

        {/* Desktop */}
        <div className="hidden sm:flex gap-1">
          {NAV_ITEMS.map((n) => (
            <button
              key={n.k}
              onClick={() => setPage(n.k)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                page === n.k
                  ? "bg-amber-500 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {n.icon} {n.label}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 text-xl"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-stone-100 px-4 pb-3 flex flex-col gap-1 bg-white">
          {NAV_ITEMS.map((n) => (
            <button
              key={n.k}
              onClick={() => {
                setPage(n.k);
                setOpen(false);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium text-left ${
                page === n.k
                  ? "bg-amber-500 text-white"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              {n.icon} {n.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
