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
  { k: "guess",  e: "🔍", t: "猜饮品",      s: "根据制作步骤猜饮品名称" },
  { k: "steps",  e: "📋", t: "辨别真假步骤", s: "找出该饮品的正确步骤" },
  { k: "ice",    e: "🧊", t: "冰量测验",    s: "匹配正确的少冰/去冰说明" },
  { k: "vessel", e: "🥤", t: "容器测验",    s: "判断步骤应用哪个容器操作" },
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

  // ── Menu ────────────────────────────────────────────────────────────────────
  if (!type) {
    const pct = score.t > 0 ? Math.round((score.c / score.t) * 100) : 0;
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">知识测验</h2>
          <p className="text-gray-500 text-sm mt-1">测试你对 Rui Tea 真实配方的掌握程度！</p>
        </div>

        {score.t > 0 && (
          <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">本次得分</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {score.c}
                <span className="text-gray-400 font-normal text-lg"> / {score.t}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 w-32 bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-400"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold ${pct >= 80 ? "text-green-600" : pct >= 50 ? "text-amber-600" : "text-red-500"}`}>
                  {pct}%
                </span>
              </div>
            </div>
            <span className="text-4xl">{pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "💪"}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          {QUIZ_TYPES.map((item) => (
            <button
              key={item.k}
              onClick={() => startType(item.k)}
              className="text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-400 hover:shadow-md transition-all active:scale-[0.99]"
            >
              <span className="text-3xl block mb-2">{item.e}</span>
              <p className="font-semibold text-gray-800 text-sm">{item.t}</p>
              <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{item.s}</p>
            </button>
          ))}
        </div>

        {score.t > 0 && (
          <button
            onClick={() => setScore({ c: 0, t: 0 })}
            className="w-full py-2 border border-gray-200 rounded-lg text-gray-400 text-sm hover:bg-gray-50 transition-colors"
          >
            重置得分
          </button>
        )}
      </div>
    );
  }

  // ── Question ─────────────────────────────────────────────────────────────────
  if (!q) return null;
  const meta = getCatMeta(q.d.category);

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setType(null)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          测验菜单
        </button>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">得分</span>
          <span className="font-bold text-gray-900">{score.c}</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">{score.t}</span>
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5 shadow-sm">
        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${meta.badge} mb-3`}>
          {meta.emoji} {q.d.category}
        </div>

        {q.type === "guess" && (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              以下步骤属于哪款饮品？
            </p>
            <div className="space-y-1.5">
              {q.prev.map((x, i) => (
                <p key={i} className="text-gray-700 text-sm bg-gray-50 rounded-lg px-3 py-2">
                  {i + 1}. {x}
                </p>
              ))}
            </div>
          </>
        )}
        {q.type === "steps" && (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
              以下哪项是
            </p>
            <p className={`font-bold text-lg ${meta.text} mb-0.5`}>{q.d.chineseName}</p>
            <p className="text-gray-400 text-sm mb-1">{q.d.englishName}</p>
            <p className="text-sm text-gray-600">的第 <span className="font-bold text-gray-800">{q.idx}</span> 步？</p>
          </>
        )}
        {q.type === "ice" && (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              以下哪项是「<span className={meta.text}>{q.label}</span>」的正确说明？
            </p>
            <p className="text-xl font-bold text-gray-900">{q.d.chineseName}</p>
            <p className="text-gray-400 text-sm mt-0.5">{q.d.cupSize}</p>
          </>
        )}
        {q.type === "vessel" && (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              制作 <span className={meta.text}>{q.d.chineseName}</span> 时，以下步骤在哪个容器中操作？
            </p>
            <p className="text-gray-700 text-sm bg-gray-50 rounded-lg px-3 py-2 mt-2 font-medium">
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

          let cls = "w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all flex items-start gap-3 ";
          if (!shown)     cls += "bg-white border-gray-200 hover:border-amber-400 text-gray-700";
          else if (ok)    cls += "bg-emerald-50 border-emerald-400 text-emerald-700";
          else if (isSel) cls += "bg-red-50 border-red-300 text-red-600";
          else            cls += "bg-white border-gray-100 text-gray-400";

          return (
            <button key={i} onClick={() => answer(choice)} className={cls}>
              <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold mt-0.5 ${
                !shown ? "border-gray-300 text-gray-400" :
                ok     ? "border-emerald-500 bg-emerald-500 text-white" :
                isSel  ? "border-red-400 bg-red-400 text-white" :
                "border-gray-200 text-gray-300"
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
        <div className={`rounded-xl px-4 py-3.5 mb-4 border ${
          isOk(sel) ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
        }`}>
          <p className={`font-semibold text-sm ${isOk(sel) ? "text-emerald-700" : "text-red-600"}`}>
            {isOk(sel) ? "🎉 回答正确！" : "❌ 回答错误"}
          </p>
          {!isOk(sel) && (
            <p className="text-xs text-gray-500 mt-0.5">正确答案已用绿色标出。</p>
          )}
        </div>
      )}

      {shown && (
        <button
          onClick={next}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
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
