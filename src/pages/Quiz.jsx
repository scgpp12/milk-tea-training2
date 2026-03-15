import { useState } from "react";
import { getCatMeta, shuffle } from "../data/constants";
import db from "../data/drinks.json";

const DRINKS = db.drinks;

const VESSEL_LABEL = {
  cup:     "🥤 出品杯",
  shaker:  "🧉 Shaker杯",
  blender: "⚡ Blender",
};

const QUIZ_TYPES = [
  { k: "guess",  e: "🔍", t: "猜饮品",     s: "根据制作步骤猜饮品名称" },
  { k: "steps",  e: "📋", t: "辨别真假步骤", s: "找出该饮品的正确步骤" },
  { k: "ice",    e: "🧊", t: "冰量测验",    s: "匹配正确的少冰/去冰说明" },
  { k: "vessel", e: "🥤", t: "容器测验",    s: "判断步骤应用哪个容器操作" },
];

// ── Question generators ────────────────────────────────────────────────────────
function makeGuess() {
  const d = DRINKS[Math.floor(Math.random() * DRINKS.length)];
  const o = shuffle(DRINKS.filter((x) => x.id !== d.id)).slice(0, 3);
  const choices = shuffle([d, ...o]);
  const prev = shuffle(d.steps.filter((s) => !s.isWarning))
    .slice(0, 2)
    .map((s) => s.text);
  return { type: "guess", d, choices, prev };
}

function makeSteps() {
  const d  = DRINKS[Math.floor(Math.random() * DRINKS.length)];
  const rs = d.steps.filter((s) => !s.isWarning);
  if (!rs.length) return makeSteps();
  const s  = rs[Math.floor(Math.random() * rs.length)];
  const w  = shuffle(
    DRINKS.filter((x) => x.id !== d.id)
      .flatMap((x) => x.steps)
      .filter((x) => !x.isWarning && x.text !== s.text)
  ).slice(0, 3);
  const choices = shuffle([s, ...w]);
  const idx = d.steps.indexOf(s) + 1;
  return { type: "steps", d, s, choices, idx };
}

function makeIce() {
  const d     = DRINKS[Math.floor(Math.random() * DRINKS.length)];
  const k     = ["full", "less", "noIce"][Math.floor(Math.random() * 3)];
  const c     = d.lessIce[k];
  const w     = shuffle(
    DRINKS.filter((x) => x.id !== d.id)
      .map((x) => x.lessIce[k])
      .filter(Boolean)
  ).slice(0, 3);
  const choices = shuffle([c, ...w]);
  const label   = { full: "正常冰", less: "少冰", noIce: "去冰" }[k];
  return { type: "ice", d, k, c, choices, label };
}

function makeVessel() {
  const d  = DRINKS[Math.floor(Math.random() * DRINKS.length)];
  const rs = d.steps.filter((s) => !s.isWarning);
  if (!rs.length) return makeVessel();
  const s       = rs[Math.floor(Math.random() * rs.length)];
  const vessels = ["cup", "shaker", "blender"];
  const correct = s.vessel;
  const wrongs  = shuffle(vessels.filter((v) => v !== correct));
  const choices = shuffle([correct, ...wrongs.slice(0, 2)]);
  return { type: "vessel", d, s, correct, choices };
}

const GENERATORS = { guess: makeGuess, steps: makeSteps, ice: makeIce, vessel: makeVessel };

// ── Component ─────────────────────────────────────────────────────────────────
export default function Quiz() {
  const [type,  setType]  = useState(null);
  const [q,     setQ]     = useState(null);
  const [sel,   setSel]   = useState(null);
  const [score, setScore] = useState({ c: 0, t: 0 });
  const [shown, setShown] = useState(false);

  function startType(t) {
    setType(t);
    setQ(GENERATORS[t]());
    setSel(null);
    setShown(false);
  }

  function answer(choice) {
    if (shown) return;
    setSel(choice);
    setShown(true);
    const ok = isOk(choice);
    setScore((s) => ({ c: s.c + (ok ? 1 : 0), t: s.t + 1 }));
  }

  function isOk(choice) {
    if (!q) return false;
    if (q.type === "guess")  return choice.id   === q.d.id;
    if (q.type === "steps")  return choice.text === q.s.text;
    if (q.type === "ice")    return choice       === q.c;
    return choice === q.correct;
  }

  function next() {
    setQ(GENERATORS[type]());
    setSel(null);
    setShown(false);
  }

  // ── Menu screen ──────────────────────────────────────────────────────────────
  if (!type) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-stone-800 mb-1">🎯 知识测验</h2>
        <p className="text-stone-500 mb-5 text-sm">测试你对 Rui Tea 真实配方的掌握程度！</p>

        {score.t > 0 && (
          <div className="mb-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-700 font-medium">本次得分</p>
              <p className="text-2xl font-bold text-amber-800">
                {score.c}/{score.t}{" "}
                <span className="text-base font-normal text-amber-600">
                  ({Math.round((score.c / score.t) * 100)}%)
                </span>
              </p>
            </div>
            <span className="text-4xl">
              {score.c / score.t >= 0.8 ? "🏆" : score.c / score.t >= 0.5 ? "👍" : "💪"}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {QUIZ_TYPES.map((item) => (
            <button
              key={item.k}
              onClick={() => startType(item.k)}
              className="text-left bg-white border border-stone-200 rounded-2xl p-4 hover:border-amber-400 hover:shadow-md transition-all"
            >
              <span className="text-3xl block mb-2">{item.e}</span>
              <p className="font-bold text-stone-800 text-sm">{item.t}</p>
              <p className="text-stone-400 text-xs mt-0.5">{item.s}</p>
            </button>
          ))}
        </div>

        {score.t > 0 && (
          <button
            onClick={() => setScore({ c: 0, t: 0 })}
            className="mt-4 w-full py-2 border border-stone-200 rounded-xl text-stone-400 text-sm"
          >
            重置得分
          </button>
        )}
      </div>
    );
  }

  // ── Question screen ──────────────────────────────────────────────────────────
  if (!q) return null;
  const meta = getCatMeta(q.d.category);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setType(null)} className="text-stone-500 text-sm font-medium">
          ← 测验菜单
        </button>
        <span className="text-sm text-stone-500 font-medium">
          ✅ {score.c} / {score.t}
        </span>
      </div>

      {/* Question prompt */}
      <div className={`${meta.bg} border ${meta.border} rounded-2xl p-5 mb-5`}>
        {q.type === "guess" && (
          <>
            <p className="text-xs font-bold text-stone-400 uppercase mb-3">
              以下步骤属于哪款饮品？
            </p>
            {q.prev.map((x, i) => (
              <p key={i} className="text-stone-700 font-medium text-sm">• {x}</p>
            ))}
          </>
        )}
        {q.type === "steps" && (
          <>
            <p className="text-xs font-bold text-stone-400 uppercase mb-2">
              以下哪项是{" "}
              <span className={meta.text}>{q.d.chineseName}</span> 的第 {q.idx} 步？
            </p>
            <p className="text-stone-500 text-sm">{q.d.englishName}</p>
          </>
        )}
        {q.type === "ice" && (
          <>
            <p className="text-xs font-bold text-stone-400 uppercase mb-2">
              以下哪项是{" "}
              <span className={meta.text}>{q.label}</span> 的正确说明？
            </p>
            <p className="text-xl font-bold text-stone-800">{q.d.chineseName}</p>
            <p className="text-stone-400 text-sm">{q.d.cupSize}</p>
          </>
        )}
        {q.type === "vessel" && (
          <>
            <p className="text-xs font-bold text-stone-400 uppercase mb-2">
              制作{" "}
              <span className={meta.text}>{q.d.chineseName}</span> 时，以下步骤应在哪个容器中操作？
            </p>
            <p className="text-stone-700 font-medium text-sm bg-white/70 rounded-lg px-3 py-2 mt-2">
              「{q.s.text}」
            </p>
          </>
        )}
      </div>

      {/* Choices */}
      <div className="space-y-2 mb-4">
        {q.choices.map((choice, i) => {
          const label =
            q.type === "guess"  ? `${choice.chineseName} (${choice.englishName})` :
            q.type === "steps"  ? choice.text :
            q.type === "vessel" ? VESSEL_LABEL[choice] :
            choice;

          const ok    = isOk(choice);
          const isSel =
            q.type === "guess"  ? sel?.id   === choice.id :
            q.type === "steps"  ? sel?.text === choice.text :
            sel === choice;

          let cls =
            "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ";
          if (!shown)    cls += "bg-white border-stone-200 hover:border-amber-400 text-stone-700";
          else if (ok)   cls += "bg-green-50 border-green-400 text-green-700";
          else if (isSel)cls += "bg-red-50 border-red-400 text-red-700";
          else           cls += "bg-white border-stone-100 text-stone-400";

          return (
            <button key={i} onClick={() => answer(choice)} className={cls}>
              <span className="mr-2">
                {shown ? (ok ? "✓" : isSel ? "✗" : "·") : "○"}
              </span>
              {label}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {shown && (
        <div
          className={`rounded-xl p-4 mb-4 ${
            isOk(sel)
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <p className={`font-bold ${isOk(sel) ? "text-green-700" : "text-red-700"}`}>
            {isOk(sel) ? "🎉 回答正确！" : "❌ 回答错误"}
          </p>
          {!isOk(sel) && (
            <p className="text-sm text-stone-500 mt-1">正确答案已用绿色标出。</p>
          )}
        </div>
      )}

      {shown && (
        <button
          onClick={next}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors"
        >
          下一题 →
        </button>
      )}
    </div>
  );
}
