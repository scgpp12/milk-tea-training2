import { useState } from "react";
import { CATEGORIES, getCatMeta } from "../data/constants";
import DrinkCard from "../components/DrinkCard";
import db from "../data/drinks.json";

const DRINKS = db.drinks;

export default function Home({ setPage, setSelId }) {
  const [cat, setCat] = useState("All");
  const [q,   setQ]   = useState("");

  const filtered = DRINKS.filter(
    (d) =>
      (cat === "All" || d.category === cat) &&
      (!q ||
        d.chineseName.includes(q) ||
        d.englishName.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-green-600 uppercase mb-1">
          Rui Tea · Jersey City
        </p>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">饮品菜单</h1>
        <p className="text-zinc-500 text-sm mt-1">{DRINKS.length} 款饮品</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索饮品..."
          className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-xl text-sm bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
        {CATEGORIES.map((c) => {
          const active = cat === c;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                active
                  ? "bg-green-600 text-white border-green-600 shadow-sm shadow-green-200"
                  : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700"
              }`}
            >
              {c !== "All" && <span>{getCatMeta(c).emoji}</span>}
              <span>{c === "All" ? "全部" : c}</span>
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
        {filtered.length} 款
      </p>

      {/* Drink list */}
      <div className="space-y-2">
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
        <div className="text-center py-20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 mb-4">
            <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-zinc-700 font-semibold text-sm">没有找到相关饮品</p>
          <p className="text-zinc-400 text-xs mt-1">请尝试其他关键词</p>
        </div>
      )}
    </div>
  );
}
