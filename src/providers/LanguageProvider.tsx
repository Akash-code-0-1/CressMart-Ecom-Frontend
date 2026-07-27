"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type Language = "ENG" | "BAN";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "ENG",
  setLanguage: () => {},
});

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguageState] = useState<Language>("ENG");
  const [mounted, setMounted] = useState(false);

  // Load saved language
  useEffect(() => {
    const saved = localStorage.getItem("language");

    if (saved === "BAN" || saved === "ENG") {
      setLanguageState(saved);
    }

    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  if (!mounted) return null;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);