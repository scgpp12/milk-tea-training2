import { VESSEL_STYLE } from "../data/constants";

export default function RecipeSteps({ steps }) {
  return (
    <div className="space-y-2">
      {steps.map((step, i) => {
        const vs = VESSEL_STYLE[step.vessel] || VESSEL_STYLE.cup;
        const isWarning = step.isWarning;

        return (
          <div
            key={i}
            className={`flex gap-3 rounded-xl border px-4 py-3 ${
              isWarning
                ? "bg-amber-50 border-amber-200"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Step number */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  isWarning ? "bg-amber-500" : vs.dot
                }`}
              >
                {i + 1}
              </span>
              <span className="text-sm leading-none">{vs.icon}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${
                isWarning ? "text-amber-600" : "text-gray-400"
              }`}>
                {vs.label}
              </p>
              <p className={`text-sm leading-relaxed ${
                isWarning ? "text-amber-700 font-medium" : "text-gray-700"
              }`}>
                {step.text}
              </p>
            </div>
          </div>
        );
      })}

      {/* Vessel legend */}
      <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">容器图例</p>
        <div className="flex flex-wrap gap-4">
          {Object.entries(VESSEL_STYLE).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>{v.icon}</span>
              <span>{v.label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
