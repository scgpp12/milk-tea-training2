import { VESSEL_STYLE } from "../data/constants";

export default function RecipeSteps({ steps, badgeClass }) {
  return (
    <div className="space-y-2">
      {steps.map((step, i) => {
        const vs = VESSEL_STYLE[step.vessel] || VESSEL_STYLE.cup;
        return (
          <div
            key={i}
            className={`flex gap-3 border rounded-xl px-4 py-3 ${
              step.isWarning ? "bg-amber-50 border-amber-300" : vs.bg
            }`}
          >
            {/* Step number + vessel icon */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  step.isWarning ? "bg-amber-500" : vs.dot
                } ${badgeClass || ""}`}
              >
                {i + 1}
              </span>
              <span className="text-xs">{vs.icon}</span>
            </div>

            {/* Content */}
            <div className="flex-1">
              <p
                className={`text-xs font-bold mb-0.5 ${
                  step.isWarning ? "text-amber-600" : "text-stone-400"
                }`}
              >
                {vs.label}
              </p>
              <p
                className={`text-sm leading-relaxed ${
                  step.isWarning
                    ? "text-amber-700 font-medium"
                    : "text-stone-700"
                }`}
              >
                {step.text}
              </p>
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="mt-4 bg-stone-50 border border-stone-100 rounded-xl p-3">
        <p className="text-xs font-bold text-stone-400 mb-2">容器图例</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(VESSEL_STYLE).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1 text-xs text-stone-500">
              {v.icon} {v.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
