import { useState } from "react";
import Nav        from "./components/Nav";
import Home       from "./pages/Home";
import DrinkDetail from "./pages/DrinkDetail";
import Simulate   from "./pages/Simulate";
import Quiz       from "./pages/Quiz";
import Checklist  from "./pages/Checklist";
import Contacts   from "./pages/Contacts";
import db         from "./data/drinks.json";

const DRINKS = db.drinks;

export default function App() {
  const [page,        setPage]        = useState("home");
  const [selId,       setSelId]       = useState(null);
  const [simDrinkId,  setSimDrinkId]  = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const drink = DRINKS.find((d) => d.id === selId);

  function navigate(p) {
    setPage(p);
    setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav page={page} setPage={navigate} open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content shifts right on desktop to make room for sidebar */}
      <div className="lg:pl-64">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span className="text-xl">🧋</span>
          <span className="font-semibold text-gray-900 text-sm">Rui Tea 培训手册</span>
        </div>

        <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl">
          {page === "home"      && <Home setPage={setPage} setSelId={setSelId} />}
          {page === "drink"     && drink && (
            <DrinkDetail drink={drink} setPage={setPage} setSimDrinkId={setSimDrinkId} />
          )}
          {page === "simulate"  && <Simulate initDrinkId={simDrinkId} setPage={setPage} />}
          {page === "quiz"      && <Quiz />}
          {page === "checklist" && <Checklist />}
          {page === "contacts"  && <Contacts />}
        </main>
      </div>
    </div>
  );
}
