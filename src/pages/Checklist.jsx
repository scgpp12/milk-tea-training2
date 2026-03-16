import { useState } from "react";
import db from "../data/drinks.json";

const OPEN_ITEMS  = db.checklistOpen;
const CLOSE_ITEMS = db.checklistClose;
const STOCK_ITEMS = db.checklistStock;
const FRUIT_WEIGHTS = db.fruitWeights;

const TABS = [
  { k: "open",  label: "开班",  icon: "🌅", items: OPEN_ITEMS },
  { k: "close", label: "打烊",  icon: "🌙", items: CLOSE_ITEMS },
  { k: "stock", label: "备货",  icon: "📦", items: STOCK_ITEMS },
];

function ChecklistSection({ items, checked, toggle }) {
  const doneCount = items.filter((i) => checked[i.id]).length;
  const total     = items.length;
  const allDone   = doneCount === total;
  const pct       = Math.round((doneCount / total) * 100);

  return (
    <>
      {/* Progress */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-medium text-zinc-500">
            {doneCount} / {total} 已完成
          </span>
          <span className={`text-xs font-bold ${allDone ? "text-emerald-600" : "text-green-600"}`}>
            {allDone ? "全部完成 ✓" : `${pct}%`}
          </span>
        </div>
        <div className="w-full bg-zinc-100 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${allDone ? "bg-emerald-500" : "bg-amber-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1.5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border transition-all duration-150 ${
              checked[item.id]
                ? "bg-emerald-50 border-emerald-200"
                : item.isWarning
                ? "bg-amber-50 border-amber-200"
                : "bg-white border-zinc-200 hover:border-zinc-300"
            }`}
          >
            <span className={`flex-shrink-0 w-4.5 h-4.5 w-[18px] h-[18px] rounded border-2 flex items-center justify-center mt-0.5 transition-all ${
              checked[item.id] ? "bg-emerald-500 border-emerald-500" : "border-zinc-300"
            }`}>
              {checked[item.id] && (
                <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </span>
            <span className={`text-sm leading-relaxed ${
              checked[item.id]
                ? "line-through text-zinc-400"
                : item.isWarning
                ? "text-amber-700 font-medium"
                : "text-zinc-700"
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
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest text-green-600 uppercase mb-1">每日检查</p>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">开班清单</h2>
          <p className="text-zinc-500 text-sm mt-1">开班 & 打烊逐项检查</p>
        </div>
        <button
          onClick={resetCurrent}
          className="text-xs text-zinc-400 border border-zinc-200 px-3 py-1.5 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 transition-colors mt-1"
        >
          重置
        </button>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-zinc-200 mb-5 gap-0">
        {TABS.map((t) => {
          const done  = t.items.filter((i) => checked[i.id]).length;
          const total = t.items.length;
          const active = tab === t.k;
          return (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                active
                  ? "border-green-600 text-green-700"
                  : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
              }`}
            >
              <span className="text-base">{t.icon}</span>
              <span>{t.label}</span>
              {done > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  done === total ? "bg-emerald-100 text-emerald-700" : "bg-green-100 text-green-700"
                }`}>
                  {done}/{total}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Checklist content */}
      <ChecklistSection
        items={currentItems}
        checked={checked}
        toggle={toggle}
      />

      {/* Reference tables — only on open tab */}
      {tab === "open" && (
        <div className="mt-8 space-y-4">
          {/* Fruit weights */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50">
              <h3 className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">
                🍓 水果杯标准重量（不含杯重）
              </h3>
            </div>
            <div className="divide-y divide-zinc-50">
              {FRUIT_WEIGHTS.map((f) => (
                <div key={f.item} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-zinc-700 text-sm">{f.item}</span>
                  <span className="text-zinc-500 text-sm font-mono bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100">
                    {f.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Coffee standard */}
          <div className="bg-zinc-900 text-white rounded-xl p-5">
            <p className="font-semibold text-sm mb-3 text-zinc-200">☕ 咖啡制作标准</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 text-xs w-16">咖啡豆</span>
                <span className="text-amber-400 font-bold text-base">18.7g</span>
                <span className="text-zinc-500 text-xs">（每次必须称量）</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 text-xs w-16">萃取</span>
                <span className="text-amber-400 font-bold text-base">36g</span>
                <span className="text-zinc-500 text-xs">约 36 秒</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 text-xs w-16">奶比例</span>
                <span className="text-amber-400 font-semibold text-sm">30g 咖啡奶 + 70g organic milk</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
