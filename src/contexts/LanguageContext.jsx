import { createContext, useContext, useState } from "react";
import zh from "../i18n/zh.json";
import en from "../i18n/en.json";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem("ruitea-lang") || "zh"
  );

  /** Dot-path lookup: t("nav.menu") → "饮品菜单" or "Drink Menu" */
  const t = (key) => {
    const dict = lang === "zh" ? zh : en;
    return key.split(".").reduce((o, k) => o?.[k], dict) ?? key;
  };

  const toggle = () => {
    const next = lang === "zh" ? "en" : "zh";
    setLang(next);
    localStorage.setItem("ruitea-lang", next);
  };

  /** Pick the right field from a drink/checklist object.
   *  e.g. pick(step, "text") → step.textEn (if en) or step.text (if zh) */
  const pick = (obj, field) => {
    if (lang === "en") {
      const enField = field + "En";
      if (obj[enField] !== undefined) return obj[enField];
    }
    return obj[field];
  };

  return (
    <LanguageContext.Provider value={{ lang, t, toggle, pick }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
