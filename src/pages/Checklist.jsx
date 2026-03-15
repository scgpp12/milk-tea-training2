import { useState } from "react";
import db from "../data/drinks.json";

const CHECKLIST_ITEMS = db.checklist;
const FRUIT_WEIGHTS   = db.fruitWeights;

export default function Checklist() {
  const [checked, setChecked] = useState({});

  const toggle    = (id) => setChecked((p) => ({ ...p, [id]: !p[id] }));
  const doneCount = CHECKLIST_ITEMS.filter((i) => checked[i.id]).length;
  const allDone   = doneCount === CHECKLIST_ITEMS.length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-5">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">✅ 开班备货清单</h2>
          <p className="text-stone-400 text-sm mt-0.5">每日开班前逐项检查</p>
        </div>
        <button
          onClick={() => setChecked({})}
          className="text-xs text-stone-400 border border-stone-200 px-3 py-1.5 rounded-lg hover:border-stone-300 mt-1"
        >
          重置
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="font-medium text-stone-600">
            {doneCount} / {CHECKLIST_ITEMS.length} 已完成
          </span>
          {allDone && <span className="text-green-600 font-bold">🎉 全部完成！</span>}
        </div>
        <div className="w-full bg-stone-100 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(doneCount / CHECKLIST_ITEMS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2 mb-6">
        {CHECKLIST_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border transition-all ${
              checked[item.id]
                ? "bg-green-50 border-green-300"
                : item.isWarning
                ? "bg-amber-50 border-amber-200"
                : "bg-white border-stone-200 hover:border-stone-300"
            }`}
          >
            <span
              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all ${
                checked[item.id] ? "bg-green-500 border-green-500" : "border-stone-300"
              }`}
            >
              {checked[item.id] && (
                <span className="text-white text-xs font-bold">✓</span>
              )}
            </span>
            <span
              className={`text-sm leading-relaxed ${
                checked[item.id]
                  ? "line-through text-stone-400"
                  : item.isWarning
                  ? "text-amber-700 font-medium"
                  : "text-stone-700"
              }`}
            >
              {item.text}
            </span>
          </button>
        ))}
      </div>

      {/* Fruit weights reference */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-4">
        <h3 className="font-bold text-stone-700 mb-3">
          🍓 水果杯标准重量（不含杯重）
        </h3>
        <div className="space-y-1.5">
          {FRUIT_WEIGHTS.map((f) => (
            <div
              key={f.item}
              className="flex items-center justify-between py-1.5 border-b border-stone-50 last:border-0"
            >
              <span className="text-stone-700 font-medium text-sm">{f.item}</span>
              <span className="text-stone-500 text-sm font-mono bg-stone-50 px-2 py-0.5 rounded">
                {f.weight}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Coffee standard */}
      <div className="bg-stone-800 text-white rounded-2xl p-4">
        <p className="font-bold mb-2">☕ 咖啡制作标准</p>
        <p className="text-stone-300 text-sm">
          咖啡豆{" "}
          <span className="text-amber-400 font-bold">18.7g</span>（每次必须称量）
        </p>
        <p className="text-stone-300 text-sm">
          萃取出{" "}
          <span className="text-amber-400 font-bold">36g</span> 咖啡，约{" "}
          <span className="text-amber-400 font-bold">36秒</span>
        </p>
      </div>
    </div>
  );
}
