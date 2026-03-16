import { useState } from "react";
import { getCatMeta } from "../data/constants";
import RecipeSteps from "../components/RecipeSteps";

const TABS = [
  { k: "recipe",   l: "配方步骤" },
  { k: "ice",      l: "冰量 / 甜度" },
  { k: "toppings", l: "配料" },
];

export default function DrinkDetail({ drink, setPage, setSimDrinkId }) {
  const [tab, setTab] = useState("recipe");
  const meta = getCatMeta(drink.category);

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => setPage("home")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-700 mb-6 transition-colors uppercase tracking-wide"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        返回菜单
      </button>

      {/* Hero card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 mb-3">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100 text-3xl">
            {meta.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.badge}`}>
                {drink.category}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100">
                {drink.cupSize}
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{drink.chineseName}</h2>
            <p className="text-zinc-400 text-sm mt-0.5">{drink.englishName}</p>
            <p className="text-zinc-500 text-xs mt-2 leading-relaxed">{drink.description}</p>
          </div>
        </div>
      </div>

      {/* Practice CTA */}
      <button
        onClick={() => {
          setSimDrinkId(drink.id);
          setPage("simulate");
        }}
        className="w-full mb-6 py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm shadow-green-200"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        </svg>
        模拟制作练习
      </button>

      {/* Tab navigation */}
      <div className="flex border-b border-zinc-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.k
                ? "border-green-600 text-green-700"
                : "border-transparent text-zinc-400 hover:text-zinc-700 hover:border-zinc-300"
            }`}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* Recipe tab */}
      {tab === "recipe" && <RecipeSteps steps={drink.steps} />}

      {/* Ice & sugar tab */}
      {tab === "ice" && (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">🧊 冰量调整</p>
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
              {[
                ["full", "正常冰"],
                ["less", "少冰"],
              ].map(([k, l], i, a) => (
                <div
                  key={k}
                  className={`px-4 py-3.5 ${i < a.length - 1 ? "border-b border-zinc-100" : ""}`}
                >
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${meta.text}`}>{l}</p>
                  <p className="text-zinc-700 text-sm">{drink.lessIce[k]}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">🍬 甜度选项</p>
            <div className="flex flex-wrap gap-2">
              {drink.sugarOptions.map((s) => (
                <span
                  key={s}
                  className="bg-zinc-50 border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toppings tab */}
      {tab === "toppings" && (
        <div>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">🫧 配料</p>
          <div className="grid grid-cols-2 gap-2">
            {drink.toppings.map((t) => (
              <div
                key={t}
                className="bg-white border border-zinc-200 rounded-lg px-4 py-3 text-zinc-700 text-sm font-medium flex items-center gap-2"
              >
                <svg className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {t}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
