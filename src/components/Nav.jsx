const NAV_ITEMS = [
  {
    k: "home",
    label: "饮品菜单",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    k: "simulate",
    label: "模拟制作",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
      </svg>
    ),
  },
  {
    k: "quiz",
    label: "知识测验",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    k: "checklist",
    label: "开班清单",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    k: "contacts",
    label: "紧急联系",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
];

import { useAuth } from "../context/AuthContext";

function SidebarContent({ page, setPage, onClose }) {
  const { user, logout } = useAuth();
  return (
    <div className="flex h-full flex-col" style={{ background: "linear-gradient(180deg, #14532d 0%, #166534 100%)" }}>
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 bg-green-300 -translate-y-8 translate-x-8 pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-24 h-24 rounded-full opacity-10 bg-green-400 translate-y-4 -translate-x-8 pointer-events-none" />

      {/* Brand */}
      <div className="relative flex h-16 items-center gap-3 px-5 border-b border-green-800/50">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-400 text-base shadow-sm flex-shrink-0">
          🧋
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-white text-sm leading-tight tracking-tight">Rui Tea</p>
          <p className="text-xs text-green-300/70 truncate">员工培训手册</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-green-400/60 hover:text-green-200 transition-colors lg:hidden flex-shrink-0"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
        <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-green-600 uppercase">
          导航
        </p>
        {NAV_ITEMS.map((n) => {
          const active = page === n.k || (page === "drink" && n.k === "home");
          return (
            <button
              key={n.k}
              onClick={() => setPage(n.k)}
              className={`group w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-green-400/15 text-green-300"
                  : "text-green-200/60 hover:bg-green-800/50 hover:text-green-100"
              }`}
            >
              <span className={`flex-shrink-0 transition-colors ${
                active ? "text-green-300" : "text-green-600 group-hover:text-green-300"
              }`}>
                {n.icon}
              </span>
              <span className="truncate">{n.label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-green-400 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer: user info + logout */}
      <div className="relative border-t border-green-800/50 px-4 py-3">
        {user && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/30 text-green-300 text-xs font-bold flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-green-200 truncate">{user.name}</p>
              <p className="text-[10px] text-green-600 truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              title="退出登录"
              className="flex-shrink-0 p-1 rounded-md text-green-500 hover:text-green-200 hover:bg-green-800/50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
          <p className="text-xs text-green-600 truncate">Jersey City · 10 Provost St</p>
        </div>
      </div>
    </div>
  );
}

export default function Nav({ page, setPage, open, setOpen }) {
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-60 lg:flex-col lg:shadow-xl relative overflow-hidden">
        <SidebarContent page={page} setPage={setPage} />
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-60 flex-col shadow-2xl transition-transform duration-200 ease-in-out lg:hidden overflow-hidden ${
          open ? "flex translate-x-0" : "flex -translate-x-full"
        }`}
      >
        <SidebarContent page={page} setPage={setPage} onClose={() => setOpen(false)} />
      </div>
    </>
  );
}
