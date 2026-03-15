import { getCatMeta } from "../data/constants";

export default function DrinkCard({ drink, onClick }) {
  const meta      = getCatMeta(drink.category);
  const stepCount = drink.steps.filter((s) => !s.isWarning).length;

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-300 hover:shadow-md active:scale-[0.99] transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${meta.badge}`}>
              {drink.category}
            </span>
            <span className="text-xs text-gray-400 font-mono">{drink.cupSize}</span>
          </div>
          <p className="text-base font-bold text-gray-900">{drink.chineseName}</p>
          <p className="text-gray-500 text-sm mt-0.5">{drink.englishName}</p>
          <p className="text-gray-400 text-xs mt-1 line-clamp-1 leading-relaxed">{drink.description}</p>
        </div>
        <div className={`flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${meta.bg}`}>
          {meta.emoji}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          {stepCount} 步
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
          {drink.sugarOptions[0]}
        </span>
        <span className="ml-auto text-amber-500 group-hover:translate-x-0.5 transition-transform">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </span>
      </div>
    </button>
  );
}
