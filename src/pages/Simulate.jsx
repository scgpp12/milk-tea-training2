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

  // ── Start game ──────────────────────────────────────────────────────────────
  function startGame(d) {
    const realSteps = d.steps.map((s, i) => ({
      ...s,
      id: `real-${i}`,
      real: true,
      idx: i,
    }));
    const distractors = shuffle(
      DRINKS.filter((x) => x.id !== d.id)
        .flatMap((x) => x.steps)
        .filter((s) => !s.isWarning)
    ).slice(0, Math.min(4, realSteps.length));
    const fakes = distractors.map((s, i) => ({
      ...s,
      id: `fake-${i}`,
      real: false,
    }));

    setPool(shuffle([...realSteps, ...fakes]));
    setOrder([]);
    orderRef.current = [];
    setResult(null);
    const stepCount = d.steps.filter((s) => !s.isWarning).length;
    setTimeLeft(stepCount * 15);
    setTimerActive(true);
    setPhase("playing");
  }

  // ── Timer ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!timerActive) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setTimerActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  useEffect(() => {
    if (timeLeft === 0 && phase === "playing") checkResult();
  }, [timeLeft]); // eslint-disable-line

  // ── Check result ─────────────────────────────────────────────────────────────
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

    setResult({
      correct,
      total:     correctSteps.length,
      fakeCount: current.filter((s) => !s.real).length,
      userSteps,
    });
    setPhase("result");
  }

  // ── Order manipulation ───────────────────────────────────────────────────────
  function addToOrder(step) {
    if (orderRef.current.find((s) => s.id === step.id)) return;
    setPool((prev) => prev.filter((s) => s.id !== step.id));
    setOrder((prev) => {
      const next = [...prev, step];
      orderRef.current = next;
      return next;
    });
  }
  function removeFromOrder(step) {
    setOrder((prev) => {
      const next = prev.filter((s) => s.id !== step.id);
      orderRef.current = next;
      return next;
    });
    setPool((prev) => shuffle([...prev, step]));
  }

  const score = result ? Math.round((result.correct / result.total) * 100) : 0;

  // ═══════════════ SELECT PHASE ════════════════════════════════════════════════
  if (phase === "select") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-5">
        <button
          onClick={() => setPage("home")}
          className="flex items-center gap-1 text-stone-500 mb-4 text-sm font-medium"
        >
          ← 返回
        </button>
        <h2 className="text-2xl font-bold text-stone-800 mb-1">🎮 模拟制作</h2>
        <p className="text-stone-400 text-sm mb-4">选择饮品，按正确顺序排列制作步骤</p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-700">
          <p className="font-bold mb-1">📌 游戏说明</p>
          <p>• 从候选步骤中点击，按正确顺序加入「制作顺序」</p>
          <p>• 候选步骤中含有干扰项，注意甄别</p>
          <p>• 每步骤限时 15秒，超时自动提交</p>
        </div>

        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索饮品..."
            className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 bg-white"
          />
        </div>

        <div className="space-y-2">
          {filteredDrinks.map((d) => {
            const meta = getCatMeta(d.category);
            return (
              <button
                key={d.id}
                onClick={() => { setDrinkId(d.id); startGame(d); }}
                className={`w-full text-left ${meta.bg} border ${meta.border} rounded-xl p-3.5 hover:shadow-md transition-all active:scale-[0.99]`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meta.badge} mr-2`}>
                      {d.category}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">{d.cupSize}</span>
                    <p className="font-bold text-stone-800 mt-1">{d.chineseName}</p>
                    <p className="text-stone-500 text-xs">{d.englishName}</p>
                  </div>
                  <span className="text-3xl">{meta.emoji}</span>
                </div>
                <p className="text-xs text-stone-400 mt-1.5">
                  📋 {d.steps.filter((s) => !s.isWarning).length} 个操作步骤
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══════════════ PLAYING PHASE ═══════════════════════════════════════════════
  if (phase === "playing" && drink) {
    const realCount  = drink.steps.filter((s) => !s.isWarning).length;
    const progress   = order.filter((s) => s.real).length / realCount;
    const timerPct   = timeLeft / (realCount * 15);

    return (
      <div className="max-w-2xl mx-auto px-4 py-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-stone-400">正在制作</p>
            <h3 className="font-bold text-stone-800 text-lg">{drink.chineseName}</h3>
          </div>
          <div
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full border-4 font-bold text-lg ${
              timerPct > 0.4
                ? "border-green-400 text-green-600"
                : timerPct > 0.15
                ? "border-amber-400 text-amber-600"
                : "border-red-400 text-red-600"
            }`}
          >
            {timeLeft}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-stone-100 rounded-full h-2 mb-4">
          <div
            className="bg-amber-400 h-2 rounded-full transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Order area */}
        <div className="mb-4">
          <p className="text-xs font-bold text-stone-500 uppercase mb-2">
            📋 已排步骤（{order.length}/{realCount}）
          </p>
          <div className="min-h-16 bg-stone-50 border-2 border-dashed border-stone-200 rounded-xl p-2 space-y-1.5">
            {!order.length && (
              <p className="text-center text-stone-300 text-sm py-4">点击下方步骤加入这里 ↓</p>
            )}
            {order.map((step, i) => {
              const vs = VESSEL_STYLE[step.vessel] || VESSEL_STYLE.cup;
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${vs.bg}`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${vs.dot}`}>
                    {i + 1}
                  </span>
                  <span className="text-xs">{vs.icon}</span>
                  <span className="text-sm text-stone-700 flex-1">{step.text}</span>
                  <button
                    onClick={() => removeFromOrder(step)}
                    className="text-stone-300 hover:text-red-400 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pool area */}
        <div className="mb-4">
          <p className="text-xs font-bold text-stone-500 uppercase mb-2">
            🎯 候选步骤（含干扰项，请仔细判断）
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
                  <span className="text-sm">{vs.icon}</span>
                  <span className="text-xs text-stone-400 w-16 flex-shrink-0">{vs.label}</span>
                  <span className="text-sm text-stone-700 flex-1">{step.text}</span>
                  <span className="text-stone-300 text-lg">+</span>
                </button>
              );
            })}
            {!pool.length && (
              <p className="text-center text-stone-300 text-sm py-3">所有步骤已排列完毕</p>
            )}
          </div>
        </div>

        <button
          onClick={checkResult}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors"
        >
          ✅ 提交答案
        </button>
      </div>
    );
  }

  // ═══════════════ RESULT PHASE ════════════════════════════════════════════════
  if (phase === "result" && drink && result) {
    const meta = getCatMeta(drink.category);
    const pass = score >= 80;

    return (
      <div className="max-w-2xl mx-auto px-4 py-5">
        {/* Score card */}
        <div className={`rounded-2xl p-5 mb-5 border ${pass ? "bg-green-50 border-green-300" : "bg-red-50 border-red-200"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase mb-1 text-stone-400">制作结果</p>
              <h3 className="text-xl font-bold text-stone-800">{drink.chineseName}</h3>
            </div>
            <span className="text-5xl">{score === 100 ? "🏆" : pass ? "👍" : "💪"}</span>
          </div>
          <div className="mt-4 flex items-end gap-4">
            <div>
              <p className={`text-5xl font-black ${pass ? "text-green-600" : "text-red-500"}`}>
                {score}<span className="text-2xl">%</span>
              </p>
              <p className="text-stone-500 text-sm">
                {result.correct}/{result.total} 步骤正确
              </p>
            </div>
            {result.fakeCount > 0 && (
              <div className="bg-red-100 text-red-600 px-3 py-1.5 rounded-xl text-sm font-medium">
                ⚠️ 加入了 {result.fakeCount} 个干扰步骤
              </div>
            )}
          </div>
        </div>

        {/* Step-by-step comparison */}
        <div className="mb-5">
          <h4 className="font-bold text-stone-700 mb-3">✅ 标准制作步骤</h4>
          <div className="space-y-1.5">
            {(() => {
              const correctSteps = drink.steps.filter((s) => !s.isWarning);
              const userSteps    = result.userSteps || [];
              let correctIdx     = 0;
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
                const j         = correctIdx++;
                const userPlaced = userSteps[j];
                const isRight   = userPlaced && userPlaced.text === step.text;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 ${
                      isRight ? "bg-green-50 border-green-300" : "bg-white border-stone-200"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${isRight ? "bg-green-500" : "bg-red-400"}`}>
                      {i + 1}
                    </span>
                    <span className="text-sm">{vs.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm text-stone-700">{step.text}</p>
                      {!isRight && userPlaced && (
                        <p className="text-xs text-red-500 mt-0.5">你填写了：{userPlaced.text}</p>
                      )}
                      {!isRight && !userPlaced && (
                        <p className="text-xs text-red-500 mt-0.5">未填写</p>
                      )}
                    </div>
                    <span>{isRight ? "✅" : "❌"}</span>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => startGame(drink)}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors"
          >
            🔄 重新练习
          </button>
          <button
            onClick={() => { setPhase("select"); setSearch(""); }}
            className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors"
          >
            换一款
          </button>
        </div>
      </div>
    );
  }

  return null;
}
