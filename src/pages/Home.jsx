import { useState } from "react";
import { CATEGORIES, getCatMeta } from "../data/constants";
import DrinkCard from "../components/DrinkCard";
import db from "../data/drinks.json";

const DRINKS = db.drinks;

export default function Home({ setPage, setSelId }) {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  const filtered = DRINKS.filter(
    (d) =>
      (cat === "All" || d.category === cat) &&
      (!q ||
        d.chineseName.includes(q) ||
        d.englishName.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-5">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-stone-800">饮品菜单</h1>
        <p className="text-stone-400 text-sm mt-0.5">
          Rui Tea · Jersey City, NJ · {DRINKS.length} 款饮品
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
          🔍
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索饮品名..."
          className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 bg-white"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              cat === c
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white text-stone-600 border-stone-200 hover:border-amber-300"
            }`}
          >
            {c !== "All" && getCatMeta(c).emoji} {c === "All" ? "全部" : c}
          </button>
        ))}
      </div>

      <p className="text-xs text-stone-400 mb-3">{filtered.length} 款饮品</p>

      <div className="space-y-2.5">
        {filtered.map((d) => (
          <DrinkCard
            key={d.id}
            drink={d}
            onClick={() => {
              setSelId(d.id);
              setPage("drink");
            }}
          />
        ))}
      </div>

      {!filtered.length && (
        <div className="text-center py-16 text-stone-400">
          <p className="text-4xl mb-3">🔍</p>
          <p>没有找到相关饮品</p>
        </div>
      )}
    </div>
  );
}
