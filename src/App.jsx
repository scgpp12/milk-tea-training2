import { useState } from "react";
import Nav        from "./components/Nav";
import Home       from "./pages/Home";
import DrinkDetail from "./pages/DrinkDetail";
import Simulate   from "./pages/Simulate";
import Quiz       from "./pages/Quiz";
import Checklist  from "./pages/Checklist";
import Contacts   from "./pages/Contacts";
import Login      from "./pages/Login";
import Register   from "./pages/Register";
import { useAuth } from "./context/AuthContext";
import db         from "./data/drinks.json";

const DRINKS = db.drinks;

export default function App() {
  const { user } = useAuth();
  const [authPage, setAuthPage] = useState("login"); // "login" | "register"
  const [page,        setPage]        = useState("home");
  const [selId,       setSelId]       = useState(null);
  const [simDrinkId,  setSimDrinkId]  = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const drink = DRINKS.find((d) => d.id === selId);

  function navigate(p) {
    setPage(p);
    setSidebarOpen(false);
  }

  // Show auth pages when not logged in
  if (!user) {
    if (authPage === "register")
      return <Register onGoLogin={() => setAuthPage("login")} />;
    return <Login onGoRegister={() => setAuthPage("register")} />;
  }

  return (
    <div className="min-h-screen bg-[#f0fdf4]">
      <Nav page={page} setPage={navigate} open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-green-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-60">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-green-100 bg-green-50/80 backdrop-blur-md px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-green-700 hover:bg-green-100 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-green-500 text-sm">
              🧋
            </div>
            <span className="font-semibold text-green-900 text-sm tracking-tight">Rui Tea</span>
          </div>
        </div>

        <main className="py-10 px-6 sm:px-8 lg:px-10 max-w-3xl">
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
