import { getCatMeta } from "../data/constants";
import { useLanguage } from "../contexts/LanguageContext";

export default function DrinkCard({ drink, onClick }) {
  const { lang, pick } = useLanguage();
  const meta      = getCatMeta(drink.category);
  const stepCount = drink.steps.filter((s) => !s.isWarning).length;
  const primaryName   = lang === "en" ? drink.englishName : drink.chineseName;
  const secondaryName = lang === "en" ? drink.chineseName : drink.englishName;

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white border border-zinc-200 rounded-xl p-4 hover:border-green-300 hover:shadow-sm active:scale-[0.99] transition-all duration-150"
    >
      <div className="flex items-center gap-4">
        {/* Emoji icon */}
        <div className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100 text-xl">
          {meta.emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-semibold text-zinc-900 truncate">{primaryName}</p>
            <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.badge}`}>
              {drink.category}
            </span>
          </div>
          <p className="text-zinc-400 text-xs truncate">{secondaryName}</p>
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-zinc-400">
            <span>{stepCount} {lang === "en" ? "steps" : "步制作"}</span>
            <span className="text-zinc-200">·</span>
            <span>{drink.cupSize}</span>
            <span className="text-zinc-200">·</span>
            <span>{drink.sugarOptions[0]}</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 text-zinc-300 group-hover:text-green-500 group-hover:translate-x-0.5 transition-all duration-150">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>
    </button>
  );
}
