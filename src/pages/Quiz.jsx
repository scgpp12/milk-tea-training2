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
  { k: "guess",  e: "🔍", t: "猜饮品",      s: "根据制作步骤猜饮品名称",   card: "bg-violet-50 border-violet-200 hover:border-violet-400", icon: "bg-violet-100 text-violet-600" },
  { k: "steps",  e: "📋", t: "辨别真假步骤", s: "找出该饮品的正确步骤",     card: "bg-sky-50 border-sky-200 hover:border-sky-400",          icon: "bg-sky-100 text-sky-600" },
  { k: "ice",    e: "🧊", t: "冰量测验",    s: "匹配正确的少冰/去冰说明", card: "bg-cyan-50 border-cyan-200 hover:border-cyan-400",        icon: "bg-cyan-100 text-cyan-600" },
  { k: "vessel", e: "🥤", t: "容器测验",    s: "判断步骤应用哪个容器操作", card: "bg-rose-50 border-rose-200 hover:border-rose-400",        icon: "bg-rose-100 text-rose-600" },
];

function makeGuess() {
  const d = DRINKS[Math.floor(Math.random() * DRINKS.length)];
  const o = shuffle(DRINKS.filter((x) => x.id !== d.id)).slice(0, 3);
  const choices = shuffle([d, ...o]);
  const prev = shuffle(d.steps.filter((s) => !s.isWarning)).slice(0, 2).map((s) => s.text);
  return { type: "guess", d, choices, prev };
}

function makeSteps() {
  const d  = DRINKS[Math.floor(Math.random() * DRINKS.length)];
  const rs = d.steps.filter((s) => !s.isWarning);
  if (!rs.length) return makeSteps();
  const s  = rs[Math.floor(Math.random() * rs.length)];
  const w  = shuffle(
    DRINKS.filter((x) => x.id !== d.id).flatMap((x) => x.steps).filter((x) => !x.isWarning && x.text !== s.text)
  ).slice(0, 3);
  const choices = shuffle([s, ...w]);
  const idx = d.steps.indexOf(s) + 1;
  return { type: "steps", d, s, choices, idx };
}

function makeIce() {
  const d   = DRINKS[Math.floor(Math.random() * DRINKS.length)];
  const k   = ["full", "less", "noIce"][Math.floor(Math.random() * 3)];
  const c   = d.lessIce[k];
  const w   = shuffle(DRINKS.filter((x) => x.id !== d.id).map((x) => x.lessIce[k]).filter(Boolean)).slice(0, 3);
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

  // ── Menu ─────────────────────────────────────────────────────────────────────
  if (!type) {
    const pct = score.t > 0 ? Math.round((score.c / score.t) * 100) : 0;
    return (
      <div>
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-green-600 uppercase mb-1">挑战自我</p>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">知识测验</h2>
          <p className="text-zinc-500 text-sm mt-1">测试你对 Rui Tea 真实配方的掌握程度！</p>
        </div>

        {score.t > 0 && (
          <div className="mb-6 bg-white border border-zinc-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">本次得分</p>
              <p className="text-2xl font-bold text-zinc-900 mt-1">
                {score.c}
                <span className="text-zinc-400 font-normal text-lg"> / {score.t}</span>
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="w-28 bg-zinc-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-green-600" : "bg-red-400"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className={`text-xs font-bold ${pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-green-700" : "text-red-500"}`}>
                  {pct}%
                </span>
              </div>
            </div>
            <span className="text-3xl">{pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "💪"}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          {QUIZ_TYPES.map((item) => (
            <button
              key={item.k}
              onClick={() => startType(item.k)}
              className={`text-left border rounded-2xl p-4 hover:shadow-md transition-all duration-150 active:scale-[0.98] ${item.card}`}
            >
              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl mb-3 ${item.icon}`}>
                {item.e}
              </span>
              <p className="font-bold text-zinc-800 text-sm leading-tight">{item.t}</p>
              <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{item.s}</p>
            </button>
          ))}
        </div>

        {score.t > 0 && (
          <button
            onClick={() => setScore({ c: 0, t: 0 })}
            className="w-full py-2 border border-zinc-200 rounded-lg text-zinc-400 text-xs hover:bg-zinc-50 transition-colors"
          >
            重置得分
          </button>
        )}
      </div>
    );
  }

  // ── Question ──────────────────────────────────────────────────────────────────
  if (!q) return null;
  const meta = getCatMeta(q.d.category);

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setType(null)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-700 transition-colors uppercase tracking-wide"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          测验菜单
        </button>
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-zinc-400 text-xs">得分</span>
          <span className="font-bold text-zinc-900">{score.c}</span>
          <span className="text-zinc-300">/</span>
          <span className="text-zinc-500 text-xs">{score.t}</span>
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 mb-4">
        <div className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.badge} mb-3`}>
          {meta.emoji} {q.d.category}
        </div>

        {q.type === "guess" && (
          <>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
              以下步骤属于哪款饮品？
            </p>
            <div className="space-y-1.5">
              {q.prev.map((x, i) => (
                <p key={i} className="text-zinc-700 text-sm bg-zinc-50 rounded-lg px-3 py-2">
                  {i + 1}. {x}
                </p>
              ))}
            </div>
          </>
        )}
        {q.type === "steps" && (
          <>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">
              以下哪项是
            </p>
            <p className={`font-bold text-lg ${meta.text} mb-0.5`}>{q.d.chineseName}</p>
            <p className="text-zinc-400 text-sm mb-1">{q.d.englishName}</p>
            <p className="text-sm text-zinc-600">的第 <span className="font-bold text-zinc-800">{q.idx}</span> 步？</p>
          </>
        )}
        {q.type === "ice" && (
          <>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
              以下哪项是「<span className={meta.text}>{q.label}</span>」的正确说明？
            </p>
            <p className="text-xl font-bold text-zinc-900">{q.d.chineseName}</p>
            <p className="text-zinc-400 text-sm mt-0.5">{q.d.cupSize}</p>
          </>
        )}
        {q.type === "vessel" && (
          <>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
              制作 <span className={meta.text}>{q.d.chineseName}</span> 时，以下步骤在哪个容器中操作？
            </p>
            <p className="text-zinc-700 text-sm bg-zinc-50 rounded-lg px-3 py-2 mt-2 font-medium">
              「{q.s.text}」
            </p>
          </>
        )}
      </div>

      {/* Choices */}
      <div className="space-y-2 mb-4">
        {q.choices.map((choice, i) => {
          const label =
            q.type === "guess"  ? `${choice.chineseName}（${choice.englishName}）` :
            q.type === "steps"  ? choice.text :
            q.type === "vessel" ? VESSEL_LABEL[choice] :
            choice;

          const ok    = isOk(choice);
          const isSel =
            q.type === "guess"  ? sel?.id   === choice.id :
            q.type === "steps"  ? sel?.text === choice.text :
            sel === choice;

          let cls = "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-start gap-3 ";
          if (!shown)     cls += "bg-white border-zinc-200 hover:border-green-300 text-zinc-700";
          else if (ok)    cls += "bg-emerald-50 border-emerald-300 text-emerald-700";
          else if (isSel) cls += "bg-red-50 border-red-300 text-red-600";
          else            cls += "bg-white border-zinc-100 text-zinc-300";

          return (
            <button key={i} onClick={() => answer(choice)} className={cls}>
              <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                !shown ? "border-zinc-300 text-zinc-400" :
                ok     ? "border-emerald-500 bg-emerald-500 text-white" :
                isSel  ? "border-red-400 bg-red-400 text-white" :
                "border-zinc-200 text-zinc-300"
              }`}>
                {shown ? (ok ? "✓" : isSel ? "✗" : "") : String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {shown && (
        <div className={`rounded-xl px-4 py-3 mb-4 border ${
          isOk(sel) ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
        }`}>
          <p className={`font-semibold text-sm ${isOk(sel) ? "text-emerald-700" : "text-red-600"}`}>
            {isOk(sel) ? "🎉 回答正确！" : "❌ 回答错误"}
          </p>
          {!isOk(sel) && (
            <p className="text-xs text-zinc-500 mt-0.5">正确答案已用绿色标出。</p>
          )}
        </div>
      )}

      {shown && (
        <button
          onClick={next}
          className="w-full py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-green-200"
        >
          下一题
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}
    </div>
  );
}
