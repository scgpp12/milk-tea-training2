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
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        返回菜单
      </button>

      {/* Hero card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${meta.badge}`}>
                {drink.category}
              </span>
              <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">
                {drink.cupSize}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{drink.chineseName}</h2>
            <p className="text-gray-500 mt-1 font-medium">{drink.englishName}</p>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">{drink.description}</p>
          </div>
          <div className={`flex-shrink-0 flex h-16 w-16 items-center justify-center rounded-xl text-3xl ${meta.bg}`}>
            {meta.emoji}
          </div>
        </div>
      </div>

      {/* Practice CTA */}
      <button
        onClick={() => {
          setSimDrinkId(drink.id);
          setPage("simulate");
        }}
        className="w-full mb-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        </svg>
        模拟制作练习
      </button>

      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 mb-6 gap-0">
        {TABS.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.k
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span>🧊</span> 冰量调整
            </h3>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {[
                ["full", "正常冰"],
                ["less", "少冰"],
              ].map(([k, l], i, a) => (
                <div
                  key={k}
                  className={`px-4 py-3.5 ${i < a.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${meta.text}`}>{l}</p>
                  <p className="text-gray-700 text-sm">{drink.lessIce[k]}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span>🍬</span> 甜度选项
            </h3>
            <div className="flex flex-wrap gap-2">
              {drink.sugarOptions.map((s) => (
                <span
                  key={s}
                  className={`${meta.bg} border ${meta.border} ${meta.text} px-4 py-2 rounded-lg text-sm font-semibold`}
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
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <span>🫧</span> 配料
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {drink.toppings.map((t) => (
              <div
                key={t}
                className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-700 text-sm font-medium flex items-center gap-2 shadow-sm"
              >
                <svg className="h-4 w-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
