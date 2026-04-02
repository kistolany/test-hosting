import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import translations from "./translations.json";

const STORAGE_KEY = "app_language";
const DEFAULT_LANGUAGE = "en";

const LanguageContext = createContext(null);

const resolveTranslation = (key, lang) => {
  const value = key
    .split(".")
    .reduce((acc, part) => (acc && typeof acc === "object" ? acc[part] : undefined), translations);

  if (!value) return key;
  if (typeof value === "string") return value;

  return value[lang] || value.en || key;
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "km" || saved === "en" ? saved : DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLanguage: setLang,
      toggleLanguage: () => setLang((prev) => (prev === "en" ? "km" : "en")),
      t: (key) => resolveTranslation(key, lang),
      fontClass: (type = "body") => (type === "title" ? "i18n-title" : "i18n-body"),
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
};
