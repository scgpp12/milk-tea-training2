import { useState, useEffect, useRef } from "react";
import { getCatMeta, VESSEL_STYLE, shuffle } from "../data/constants";
import db from "../data/drinks.json";

const DRINKS = db.drinks;

export default function Simulate({ initDrinkId, setPage }) {
  const [drinkId,     setDrinkId]     = useState(initDrinkId);
  const [phase,       setPhase]       = useState("select");
  const [pool,        setPool]        = useState([]);
  const [order,       setOrder]       = useState([]);
  const orderRef                      = useRef([]);
  const [result,      setResult]      = useState(null);
  const [timeLeft,    setTimeLeft]    = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef                      = useRef(null);
  const [search,      setSearch]      = useState("");

  const drink = DRINKS.find((d) => d.id === drinkId);
  const filteredDrinks = DRINKS.filter(
    (d) =>
      !search ||
      d.chineseName.includes(search) ||
      d.englishName.toLowerCase().includes(search.toLowerCase())
  );

  function startGame(d) {
    const realSteps = d.steps.map((s, i) => ({ ...s, id: `real-${i}`, real: true, idx: i }));

    // Deduplicate fakes: exclude any text that already appears in real steps or other fakes
    const seenTexts = new Set(realSteps.map((s) => s.text));
    const uniqueFakes = [];
    for (const s of shuffle(
      DRINKS.filter((x) => x.id !== d.id).flatMap((x) => x.steps).filter((s) => !s.isWarning)
    )) {
      if (!seenTexts.has(s.text)) {
        seenTexts.add(s.text);
        uniqueFakes.push(s);
        if (uniqueFakes.length >= Math.min(4, realSteps.length)) break;
      }
    }
    const fakes = uniqueFakes.map((s, i) => ({ ...s, id: `fake-${i}`, real: false }));

    setPool(shuffle([...realSteps, ...fakes]));
    setOrder([]);
    orderRef.current = [];
    setResult(null);
    const stepCount = d.steps.filter((s) => !s.isWarning).length;
    setTimeLeft(stepCount * 15);
    setTimerActive(true);
    setPhase("playing");
  }

  useEffect(() => {
    if (!timerActive) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); setTimerActive(false); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  useEffect(() => {
    if (timeLeft === 0 && phase === "playing") checkResult();
  }, [timeLeft]); // eslint-disable-line

  // All vessel steps are order-independent — only need to include the right ones.
  // Kept as a helper so result display can reuse the same logic.
  const isShakeIngredient = () => false; // no longer used for splitting; kept to avoid breaking result render

  function checkResult() {
    if (!drink) return;
    setTimerActive(false);
    clearInterval(timerRef.current);
    const current      = orderRef.current;
    const correctSteps = drink.steps.filter((s) => !s.isWarning);
    const userSteps    = current.filter((s) => s.real);

    // Full set-based scoring: order doesn't matter, just need the right steps
    const userTextSet = new Set(userSteps.map((s) => s.text));
    let correct = 0;
    correctSteps.forEach((step) => { if (userTextSet.has(step.text)) correct++; });

    setResult({ correct, total: correctSteps.length, fakeCount: current.filter((s) => !s.real).length, userSteps });
    setPhase("result");
  }

  function addToOrder(step) {
    if (orderRef.current.find((s) => s.id === step.id)) return;
    setPool((prev) => prev.filter((s) => s.id !== step.id));
    setOrder((prev) => { const next = [...prev, step]; orderRef.current = next; return next; });
  }
  function removeFromOrder(step) {
    setOrder((prev) => { const next = prev.filter((s) => s.id !== step.id); orderRef.current = next; return next; });
    setPool((prev) => shuffle([...prev, step]));
  }

  const score = result ? Math.round((result.correct / result.total) * 100) : 0;

  // ── SELECT ────────────────────────────────────────────────────────────────────
  if (phase === "select") {
    return (
      <div>
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-green-600 uppercase mb-1">实操练习</p>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">模拟制作</h2>
          <p className="text-zinc-500 text-sm mt-1">选择饮品，按正确顺序排列制作步骤</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5">
          <p className="text-sm font-semibold text-green-900 mb-1.5">📌 游戏说明</p>
          <ul className="space-y-0.5 text-sm text-green-800">
            <li>• 从候选步骤中点击加入「制作顺序」，排除干扰项</li>
            <li>• 顺序不影响评分，只需选出所有正确步骤即可</li>
            <li>• 每步骤限时 15 秒，超时自动提交</li>
          </ul>
        </div>

        <div className="relative mb-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索饮品..."
            className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-xl text-sm bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          {filteredDrinks.map((d) => {
            const meta = getCatMeta(d.category);
            return (
              <button
                key={d.id}
                onClick={() => { setDrinkId(d.id); startGame(d); }}
                className="group w-full text-left bg-white border border-zinc-200 rounded-xl p-4 hover:border-green-300 hover:shadow-sm transition-all duration-150 active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.badge}`}>
                        {d.category}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">{d.cupSize}</span>
                    </div>
                    <p className="font-semibold text-zinc-900 text-sm">{d.chineseName}</p>
                    <p className="text-zinc-400 text-xs mt-0.5 truncate">{d.englishName}</p>
                    <p className="text-[11px] text-zinc-400 mt-1.5">
                      {d.steps.filter((s) => !s.isWarning).length} 个操作步骤
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100 text-xl">
                    {meta.emoji}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── PLAYING ───────────────────────────────────────────────────────────────────
  if (phase === "playing" && drink) {
    const realCount = drink.steps.filter((s) => !s.isWarning).length;
    const progress  = order.filter((s) => s.real).length / realCount;
    const timerPct  = timeLeft / (realCount * 15);

    return (
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">正在制作</p>
            <h3 className="font-bold text-zinc-900 text-lg mt-0.5 tracking-tight">{drink.chineseName}</h3>
          </div>
          <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-full border-[3px] font-bold text-lg ${
            timerPct > 0.4  ? "border-emerald-400 text-emerald-600" :
            timerPct > 0.15 ? "border-amber-400 text-green-700" :
            "border-red-400 text-red-600"
          }`}>
            {timeLeft}
          </div>
        </div>

        {/* Progress */}
        <div className="w-full bg-zinc-100 rounded-full h-1.5 mb-5">
          <div
            className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Order area */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
            已排步骤 ({order.length}/{realCount})
          </p>
          <div className="min-h-[4rem] bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-xl p-2 space-y-1.5">
            {!order.length && (
              <p className="text-center text-zinc-300 text-sm py-4">点击下方步骤加入这里 ↓</p>
            )}
            {order.map((step, i) => {
              const vs = VESSEL_STYLE[step.vessel] || VESSEL_STYLE.cup;
              return (
                <div key={step.id} className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${vs.bg}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${vs.dot}`}>
                    {i + 1}
                  </span>
                  <span className="text-sm">{vs.icon}</span>
                  <span className="text-sm text-zinc-700 flex-1">{step.text}</span>
                  <button onClick={() => removeFromOrder(step)} className="text-zinc-300 hover:text-red-400 text-lg leading-none p-0.5 transition-colors">
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pool */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
            候选步骤（含干扰项，请仔细判断）
          </p>
          <p className="text-xs text-green-600 mb-2">顺序不限，选出所有正确步骤即可得分</p>
          <div className="space-y-1.5">
            {pool.map((step) => {
              const vs = VESSEL_STYLE[step.vessel] || VESSEL_STYLE.cup;
              return (
                <button
                  key={step.id}
                  onClick={() => addToOrder(step)}
                  className={`w-full text-left flex items-center gap-2 border rounded-xl px-3 py-2.5 ${vs.bg} hover:shadow-sm active:scale-[0.99] transition-all duration-150`}
                >
                  <span className="text-sm flex-shrink-0">{vs.icon}</span>
                  <span className="text-xs text-zinc-400 w-14 flex-shrink-0">{vs.label}</span>
                  <span className="text-sm text-zinc-700 flex-1">{step.text}</span>
                  <svg className="h-4 w-4 text-zinc-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              );
            })}
            {!pool.length && (
              <p className="text-center text-zinc-300 text-sm py-3">所有步骤已排列完毕</p>
            )}
          </div>
        </div>

        <button
          onClick={checkResult}
          className="w-full py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-green-200 flex items-center justify-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          提交答案
        </button>
      </div>
    );
  }

  // ── RESULT ────────────────────────────────────────────────────────────────────
  if (phase === "result" && drink && result) {
    const meta = getCatMeta(drink.category);
    const pass = score >= 80;

    return (
      <div>
        {/* Score card */}
        <div className={`rounded-xl p-5 mb-5 border ${pass ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">制作结果</p>
              <h3 className="text-xl font-bold text-zinc-900 tracking-tight">{drink.chineseName}</h3>
            </div>
            <span className="text-4xl">{score === 100 ? "🏆" : pass ? "👍" : "💪"}</span>
          </div>
          <div className="mt-4 flex items-end gap-4">
            <div>
              <p className={`text-5xl font-black tracking-tight ${pass ? "text-emerald-600" : "text-red-500"}`}>
                {score}<span className="text-2xl font-normal">%</span>
              </p>
              <p className="text-zinc-500 text-sm mt-0.5">{result.correct}/{result.total} 步骤正确</p>
            </div>
            {result.fakeCount > 0 && (
              <div className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold">
                ⚠️ 加入了 {result.fakeCount} 个干扰步骤
              </div>
            )}
          </div>
        </div>

        {/* Step comparison */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">标准制作步骤</p>
          <div className="space-y-1.5">
            {(() => {
              const userSteps  = result.userSteps || [];
              const userTextSet = new Set(userSteps.map((s) => s.text));
              return drink.steps.map((step, i) => {
                const vs = VESSEL_STYLE[step.vessel] || VESSEL_STYLE.cup;
                if (step.isWarning) {
                  return (
                    <div key={i} className="flex items-center gap-2 border rounded-xl px-3 py-2.5 bg-green-50 border-green-200">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 bg-green-500">{i + 1}</span>
                      <span className="text-sm">{vs.icon}</span>
                      <p className="text-sm text-green-800 font-medium flex-1">{step.text}</p>
                    </div>
                  );
                }
                const isRight = userTextSet.has(step.text);
                return (
                  <div key={i} className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 ${isRight ? "bg-emerald-50 border-emerald-200" : "bg-white border-zinc-200"}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${isRight ? "bg-emerald-500" : "bg-red-400"}`}>
                      {i + 1}
                    </span>
                    <span className="text-sm">{vs.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-700">{step.text}</p>
                      {!isRight && <p className="text-xs text-red-400 mt-0.5">未加入</p>}
                    </div>
                    <span className="flex-shrink-0">{isRight ? "✅" : "❌"}</span>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => startGame(drink)}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-green-200"
          >
            🔄 重新练习
          </button>
          <button
            onClick={() => { setPhase("select"); setSearch(""); }}
            className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold rounded-xl transition-colors"
          >
            换一款
          </button>
        </div>
      </div>
    );
  }

  return null;
}
