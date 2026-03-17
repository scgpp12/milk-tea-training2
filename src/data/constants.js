export const CATEGORIES = [
  "All",
  "Exclusive Bobo",
  "Fresh Fruit Tea",
  "Cheese Foam Slush",
  "Milk Tea",
  "Coffee",
  "Hot Drinks",
];

export const CAT_META = {
  "Exclusive Bobo": {
    emoji: "🫧",
    badge: "bg-green-600 text-white",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
  },
  "Fresh Fruit Tea": {
    emoji: "🍊",
    badge: "bg-emerald-500 text-white",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
  },
  "Cheese Foam Slush": {
    emoji: "🧀",
    badge: "bg-yellow-500 text-white",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
  },
  "Milk Tea": {
    emoji: "🧋",
    badge: "bg-rose-500 text-white",
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
  },
  Coffee: {
    emoji: "☕",
    badge: "bg-stone-700 text-white",
    bg: "bg-stone-100",
    border: "border-stone-300",
    text: "text-stone-700",
  },
  "Hot Drinks": {
    emoji: "🔥",
    badge: "bg-orange-600 text-white",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
  },
};

export const VESSEL_STYLE = {
  cup: {
    icon: "🥤",
    label: "出品杯",
    bg: "bg-rose-50 border-rose-200",
    dot: "bg-rose-400",
  },
  shaker: {
    icon: "🧉",
    label: "Shaker杯",
    bg: "bg-blue-50 border-blue-200",
    dot: "bg-blue-400",
  },
  blender: {
    icon: "⚡",
    label: "Blender",
    bg: "bg-purple-50 border-purple-200",
    dot: "bg-purple-400",
  },
  mug: {
    icon: "☕",
    label: "咖啡杯",
    bg: "bg-orange-50 border-orange-200",
    dot: "bg-orange-400",
  },
  note: {
    icon: "⚠️",
    label: "注意",
    bg: "bg-amber-50 border-amber-300",
    dot: "bg-amber-500",
  },
};

/** Returns category meta or a safe fallback */
export const getCatMeta = (category) =>
  CAT_META[category] || {
    emoji: "🍵",
    badge: "bg-gray-400 text-white",
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-700",
  };

/** Simple array shuffle */
export const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
