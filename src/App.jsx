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
  const [page,       setPage]       = useState("home");
  const [selId,      setSelId]      = useState(null);
  const [simDrinkId, setSimDrinkId] = useState(null);

  const drink = DRINKS.find((d) => d.id === selId);

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav page={page} setPage={setPage} />
      <main className="pb-12">
        {page === "home"      && (
          <Home setPage={setPage} setSelId={setSelId} />
        )}
        {page === "drink"     && drink && (
          <DrinkDetail
            drink={drink}
            setPage={setPage}
            setSimDrinkId={setSimDrinkId}
          />
        )}
        {page === "simulate"  && (
          <Simulate initDrinkId={simDrinkId} setPage={setPage} />
        )}
        {page === "quiz"      && <Quiz />}
        {page === "checklist" && <Checklist />}
        {page === "contacts"  && <Contacts />}
      </main>
    </div>
  );
}
