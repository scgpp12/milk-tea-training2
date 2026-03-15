import { getCatMeta } from "../data/constants";

export default function DrinkCard({ drink, onClick }) {
  const meta = getCatMeta(drink.category);
  const stepCount = drink.steps.filter((s) => !s.isWarning).length;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left ${meta.bg} border ${meta.border} rounded-2xl p-4 hover:shadow-md active:scale-[0.99] transition-all`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meta.badge}`}>
              {drink.category}
            </span>
            <span className="text-xs text-stone-400 font-mono">{drink.cupSize}</span>
          </div>
          <p className="text-xl font-bold text-stone-800">{drink.chineseName}</p>
          <p className="text-stone-500 text-sm mt-0.5">{drink.englishName}</p>
          <p className="text-stone-400 text-xs mt-1 line-clamp-1">{drink.description}</p>
        </div>
        <span className="text-4xl flex-shrink-0">{meta.emoji}</span>
      </div>
      <div className="mt-2.5 flex gap-3 text-xs text-stone-400">
        <span>📋 {stepCount} 步</span>
        <span>🍬 {drink.sugarOptions[0]}</span>
      </div>
    </button>
  );
}
