import { useState } from "react";
import { getCatMeta } from "../data/constants";
import RecipeSteps from "../components/RecipeSteps";

const TABS = [
  { k: "recipe",   l: "配方步骤" },
  { k: "ice",      l: "冰量/甜度" },
  { k: "toppings", l: "配料" },
];

export default function DrinkDetail({ drink, setPage, setSimDrinkId }) {
  const [tab, setTab] = useState("recipe");
  const meta = getCatMeta(drink.category);

  return (
    <div className="max-w-2xl mx-auto px-4 py-5">
      <button
        onClick={() => setPage("home")}
        className="flex items-center gap-1 text-stone-500 hover:text-stone-800 mb-4 text-sm font-medium"
      >
        ← 返回菜单
      </button>

      {/* Header card */}
      <div className={`${meta.bg} border ${meta.border} rounded-2xl p-5 mb-4`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meta.badge}`}>
                {drink.category}
              </span>
              <span className="text-xs text-stone-400 font-mono">{drink.cupSize}</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-800">{drink.chineseName}</h2>
            <p className="text-stone-500 mt-0.5 font-medium">{drink.englishName}</p>
            <p className="text-stone-400 text-sm mt-1.5 leading-relaxed">{drink.description}</p>
          </div>
          <span className="text-5xl">{meta.emoji}</span>
        </div>
      </div>

      {/* Simulate CTA */}
      <button
        onClick={() => {
          setSimDrinkId(drink.id);
          setPage("simulate");
        }}
        className="w-full mb-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
      >
        🎮 模拟制作练习
      </button>

      {/* Tabs */}
      <div className="flex bg-stone-100 rounded-xl p-1 mb-5 gap-1">
        {TABS.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.k ? "bg-white shadow-sm text-stone-800" : "text-stone-500"
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
        <div className="space-y-5">
          <div>
            <h3 className="font-bold text-stone-700 mb-3">🧊 冰量调整</h3>
            <div className="bg-white border border-stone-100 rounded-xl overflow-hidden">
              {[
                ["full",  "正常冰"],
                ["less",  "少冰"],
                ["noIce", "去冰"],
              ].map(([k, l], i, a) => (
                <div
                  key={k}
                  className={`px-4 py-3 ${i < a.length - 1 ? "border-b border-stone-50" : ""}`}
                >
                  <p className={`text-xs font-bold uppercase mb-1 ${meta.text}`}>{l}</p>
                  <p className="text-stone-700 text-sm">{drink.lessIce[k]}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-stone-700 mb-3">🍬 甜度选项</h3>
            <div className="flex flex-wrap gap-2">
              {drink.sugarOptions.map((s) => (
                <span
                  key={s}
                  className={`${meta.bg} border ${meta.border} ${meta.text} px-4 py-2 rounded-xl text-sm font-semibold`}
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
          <h3 className="font-bold text-stone-700 mb-3">🫧 配料</h3>
          <div className="grid grid-cols-2 gap-2">
            {drink.toppings.map((t) => (
              <div
                key={t}
                className="bg-white border border-stone-100 rounded-xl px-4 py-3 text-stone-700 text-sm font-medium flex items-center gap-2"
              >
                <span className="text-green-400">✓</span>
                {t}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
