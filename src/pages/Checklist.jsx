import { useState } from "react";
import db from "../data/drinks.json";

const OPEN_ITEMS  = db.checklistOpen;
const CLOSE_ITEMS = db.checklistClose;
const STOCK_ITEMS = db.checklistStock;
const FRUIT_WEIGHTS = db.fruitWeights;

const TABS = [
  { k: "open",  label: "开班清单", icon: "🌅", items: OPEN_ITEMS },
  { k: "close", label: "打烊清单", icon: "🌙", items: CLOSE_ITEMS },
  { k: "stock", label: "备货管理", icon: "📦", items: STOCK_ITEMS },
];

function ChecklistSection({ items, checked, toggle }) {
  const doneCount = items.filter((i) => checked[i.id]).length;
  const total     = items.length;
  const allDone   = doneCount === total;
  const pct       = Math.round((doneCount / total) * 100);

  return (
    <>
      {/* Progress */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {doneCount} / {total} 已完成
          </span>
          <span className={`text-sm font-semibold ${allDone ? "text-emerald-600" : "text-gray-400"}`}>
            {allDone ? "🎉 全部完成！" : `${pct}%`}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${allDone ? "bg-emerald-500" : "bg-amber-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className={`w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-all ${
              checked[item.id]
                ? "bg-emerald-50 border-emerald-200"
                : item.isWarning
                ? "bg-amber-50 border-amber-200"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all ${
              checked[item.id] ? "bg-emerald-500 border-emerald-500" : "border-gray-300"
            }`}>
              {checked[item.id] && (
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </span>
            <span className={`text-sm leading-relaxed ${
              checked[item.id]
                ? "line-through text-gray-400"
                : item.isWarning
                ? "text-amber-700 font-medium"
                : "text-gray-700"
            }`}>
              {item.text}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

export default function Checklist() {
  const [tab,     setTab]     = useState("open");
  const [checked, setChecked] = useState({});

  const toggle       = (id) => setChecked((p) => ({ ...p, [id]: !p[id] }));
  const currentItems = TABS.find((t) => t.k === tab).items;
  const resetCurrent = () => {
    const cleared = { ...checked };
    currentItems.forEach((i) => { delete cleared[i.id]; });
    setChecked(cleared);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">每日清单</h2>
          <p className="text-gray-500 text-sm mt-1">开班 & 打烊逐项检查</p>
        </div>
        <button
          onClick={resetCurrent}
          className="text-xs text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors mt-1"
        >
          重置当前
        </button>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 mb-5 gap-0">
        {TABS.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
              tab === t.k
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
            {/* Done badge */}
            {(() => {
              const done  = t.items.filter((i) => checked[i.id]).length;
              const total = t.items.length;
              if (done === 0) return null;
              const allDone = done === total;
              return (
                <span className={`ml-1 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  allDone ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {done}/{total}
                </span>
              );
            })()}
          </button>
        ))}
      </div>

      {/* Checklist content */}
      <ChecklistSection
        items={currentItems}
        checked={checked}
        toggle={toggle}
      />

      {/* Reference tables — only on open tab */}
      {tab === "open" && (
        <div className="mt-6 space-y-4">
          {/* Fruit weights */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                🍓 水果杯标准重量（不含杯重）
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {FRUIT_WEIGHTS.map((f) => (
                <div key={f.item} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-gray-700 text-sm">{f.item}</span>
                  <span className="text-gray-500 text-sm font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                    {f.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Coffee standard */}
          <div className="bg-gray-900 text-white rounded-xl p-4">
            <p className="font-semibold text-sm mb-2">☕ 咖啡制作标准</p>
            <div className="space-y-1.5 text-sm text-gray-300">
              <p>
                咖啡豆{" "}
                <span className="text-amber-400 font-bold text-base">18.7g</span>
                <span className="text-gray-400 text-xs ml-1">（每次必须称量）</span>
              </p>
              <p>
                萃取{" "}
                <span className="text-amber-400 font-bold text-base">36g</span>
                {" "}咖啡，约{" "}
                <span className="text-amber-400 font-bold text-base">36秒</span>
              </p>
              <p>
                咖啡奶比例：
                <span className="text-amber-400 font-bold ml-1">30g 咖啡奶 + 70g organic milk</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
