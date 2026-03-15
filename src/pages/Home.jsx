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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">饮品菜单</h1>
        <p className="text-gray-500 text-sm mt-1">
          Rui Tea · Jersey City, NJ · {DRINKS.length} 款饮品
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索饮品名..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1">
        {CATEGORIES.map((c) => {
          const active = cat === c;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                active
                  ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-700"
              }`}
            >
              {c !== "All" && <span>{getCatMeta(c).emoji}</span>}
              <span>{c === "All" ? "全部" : c}</span>
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
        {filtered.length} 款饮品
      </p>

      {/* Drink list */}
      <div className="space-y-3">
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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">没有找到相关饮品</p>
          <p className="text-gray-400 text-sm mt-1">请尝试其他关键词</p>
        </div>
      )}
    </div>
  );
}
