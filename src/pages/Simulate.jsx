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
    const distractors = shuffle(
      DRINKS.filter((x) => x.id !== d.id).flatMap((x) => x.steps).filter((s) => !s.isWarning)
    ).slice(0, Math.min(4, realSteps.length));
    const fakes = distractors.map((s, i) => ({ ...s, id: `fake-${i}`, real: false }));

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

  function checkResult() {
    if (!drink) return;
    setTimerActive(false);
    clearInterval(timerRef.current);
    const current      = orderRef.current;
    const correctSteps = drink.steps.filter((s) => !s.isWarning);
    const userSteps    = current.filter((s) => s.real);
    let correct = 0;
    correctSteps.forEach((step, i) => {
      if (userSteps[i] && userSteps[i].text === step.text) correct++;
    });
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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">模拟制作</h2>
          <p className="text-gray-500 text-sm mt-1">选择饮品，按正确顺序排列制作步骤</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
          <p className="text-sm font-semibold text-amber-800 mb-1.5">📌 游戏说明</p>
          <ul className="space-y-0.5 text-sm text-amber-700">
            <li>• 从候选步骤中点击，按正确顺序加入「制作顺序」</li>
            <li>• 候选步骤中含有干扰项，注意甄别</li>
            <li>• 每步骤限时 15 秒，超时自动提交</li>
          </ul>
        </div>

        <div className="relative mb-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索饮品..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div className="space-y-2">
          {filteredDrinks.map((d) => {
            const meta = getCatMeta(d.category);
            return (
              <button
                key={d.id}
                onClick={() => { setDrinkId(d.id); startGame(d); }}
                className="group w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-300 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${meta.badge}`}>
                        {d.category}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">{d.cupSize}</span>
                    </div>
                    <p className="font-semibold text-gray-900">{d.chineseName}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{d.englishName}</p>
                    <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      {d.steps.filter((s) => !s.isWarning).length} 个操作步骤
                    </p>
                  </div>
                  <div className={`flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl text-2xl ${meta.bg}`}>
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
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">正在制作</p>
            <h3 className="font-bold text-gray-900 text-lg mt-0.5">{drink.chineseName}</h3>
          </div>
          <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-full border-[3px] font-bold text-lg ${
            timerPct > 0.4  ? "border-emerald-400 text-emerald-600" :
            timerPct > 0.15 ? "border-amber-400 text-amber-600" :
            "border-red-400 text-red-600"
          }`}>
            {timeLeft}
          </div>
        </div>

        {/* Progress */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-5">
          <div
            className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Order area */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            已排步骤 ({order.length}/{realCount})
          </p>
          <div className="min-h-[4rem] bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-2 space-y-1.5">
            {!order.length && (
              <p className="text-center text-gray-300 text-sm py-4">点击下方步骤加入这里 ↓</p>
            )}
            {order.map((step, i) => {
              const vs = VESSEL_STYLE[step.vessel] || VESSEL_STYLE.cup;
              return (
                <div key={step.id} className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${vs.bg}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${vs.dot}`}>
                    {i + 1}
                  </span>
                  <span className="text-sm">{vs.icon}</span>
                  <span className="text-sm text-gray-700 flex-1">{step.text}</span>
                  <button onClick={() => removeFromOrder(step)} className="text-gray-300 hover:text-red-400 text-lg leading-none p-0.5">
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pool */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            候选步骤（含干扰项，请仔细判断）
          </p>
          <div className="space-y-1.5">
            {pool.map((step) => {
              const vs = VESSEL_STYLE[step.vessel] || VESSEL_STYLE.cup;
              return (
                <button
                  key={step.id}
                  onClick={() => addToOrder(step)}
                  className={`w-full text-left flex items-center gap-2 border rounded-xl px-3 py-2.5 ${vs.bg} hover:shadow-sm active:scale-[0.99] transition-all`}
                >
                  <span className="text-sm flex-shrink-0">{vs.icon}</span>
                  <span className="text-xs text-gray-400 w-14 flex-shrink-0">{vs.label}</span>
                  <span className="text-sm text-gray-700 flex-1">{step.text}</span>
                  <svg className="h-4 w-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              );
            })}
            {!pool.length && (
              <p className="text-center text-gray-300 text-sm py-3">所有步骤已排列完毕</p>
            )}
          </div>
        </div>

        <button
          onClick={checkResult}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
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
        <div className={`rounded-xl p-5 mb-5 border shadow-sm ${pass ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">制作结果</p>
              <h3 className="text-xl font-bold text-gray-900">{drink.chineseName}</h3>
            </div>
            <span className="text-4xl">{score === 100 ? "🏆" : pass ? "👍" : "💪"}</span>
          </div>
          <div className="mt-4 flex items-end gap-4">
            <div>
              <p className={`text-5xl font-black ${pass ? "text-emerald-600" : "text-red-500"}`}>
                {score}<span className="text-2xl font-normal">%</span>
              </p>
              <p className="text-gray-500 text-sm mt-0.5">{result.correct}/{result.total} 步骤正确</p>
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
          <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">标准制作步骤</h4>
          <div className="space-y-1.5">
            {(() => {
              const correctSteps = drink.steps.filter((s) => !s.isWarning);
              const userSteps    = result.userSteps || [];
              let ci = 0;
              return drink.steps.map((step, i) => {
                const vs = VESSEL_STYLE[step.vessel] || VESSEL_STYLE.cup;
                if (step.isWarning) {
                  return (
                    <div key={i} className="flex items-center gap-2 border rounded-xl px-3 py-2.5 bg-amber-50 border-amber-200">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 bg-amber-400">{i + 1}</span>
                      <span className="text-sm">{vs.icon}</span>
                      <p className="text-sm text-amber-700 font-medium flex-1">{step.text}</p>
                    </div>
                  );
                }
                const j          = ci++;
                const userPlaced = userSteps[j];
                const isRight    = userPlaced && userPlaced.text === step.text;
                return (
                  <div key={i} className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 ${isRight ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200"}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${isRight ? "bg-emerald-500" : "bg-red-400"}`}>
                      {i + 1}
                    </span>
                    <span className="text-sm">{vs.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700">{step.text}</p>
                      {!isRight && userPlaced && <p className="text-xs text-red-500 mt-0.5">你填写了：{userPlaced.text}</p>}
                      {!isRight && !userPlaced && <p className="text-xs text-red-400 mt-0.5">未填写</p>}
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
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            🔄 重新练习
          </button>
          <button
            onClick={() => { setPhase("select"); setSearch(""); }}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            换一款
          </button>
        </div>
      </div>
    );
  }

  return null;
}
