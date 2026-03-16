import { VESSEL_STYLE } from "../data/constants";

export default function RecipeSteps({ steps }) {
  return (
    <div className="space-y-1.5">
      {steps.map((step, i) => {
        const vs = VESSEL_STYLE[step.vessel] || VESSEL_STYLE.cup;
        const isWarning = step.isWarning;

        return (
          <div
            key={i}
            className={`flex gap-3 rounded-xl border px-4 py-3 ${
              isWarning
                ? "bg-amber-50 border-amber-200"
                : "bg-white border-zinc-200"
            }`}
          >
            {/* Step number */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                  isWarning ? "bg-amber-500" : vs.dot
                }`}
              >
                {i + 1}
              </span>
              <span className="text-xs leading-none">{vs.icon}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={`text-[10px] font-semibold uppercase tracking-widest mb-0.5 ${
                isWarning ? "text-amber-600" : "text-zinc-400"
              }`}>
                {vs.label}
              </p>
              <p className={`text-sm leading-relaxed ${
                isWarning ? "text-amber-700 font-medium" : "text-zinc-700"
              }`}>
                {step.text}
              </p>
            </div>
          </div>
        );
      })}

      {/* Vessel legend */}
      <div className="mt-4 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">
        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">容器图例</p>
        <div className="flex flex-wrap gap-4">
          {Object.entries(VESSEL_STYLE).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span>{v.icon}</span>
              <span>{v.label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
