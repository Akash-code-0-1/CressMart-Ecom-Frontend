// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// export type Language = "ENG" | "BAN";

// interface LanguageContextType {
//   language: Language;
//   setLanguage: (lang: Language) => void;
// }

// const LanguageContext = createContext<LanguageContextType>({
//   language: "ENG",
//   setLanguage: () => {},
// });

// export const LanguageProvider = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const [language, setLanguageState] = useState<Language>("ENG");
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     const saved = localStorage.getItem("language") as Language | null;

//     if (saved === "ENG" || saved === "BAN") {
//       setLanguageState(saved);

//       // Keep cookie in sync
//       document.cookie = `language=${saved}; path=/; max-age=31536000`;
//     }

//     setMounted(true);
//   }, []);

//   const setLanguage = (lang: Language) => {
//     setLanguageState(lang);

//     localStorage.setItem("language", lang);

//     // Save for Server Components
//     document.cookie = `language=${lang}; path=/; max-age=31536000`;
//   };

//   if (!mounted) return null;

//   return (
//     <LanguageContext.Provider
//       value={{
//         language,
//         setLanguage,
//       }}
//     >
//       {children}
//     </LanguageContext.Provider>
//   );
// };

// export const useLanguage = () => useContext(LanguageContext);





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
  language: "BAN", // 1. Changed default context value to BAN
  setLanguage: () => {},
});

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguageState] = useState<Language>("BAN"); // 2. Changed initial state to BAN
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language | null;

    if (saved === "ENG" || saved === "BAN") {
      setLanguageState(saved);
      // Keep cookie in sync
      document.cookie = `language=${saved}; path=/; max-age=31536000`;
    } else {
      // 3. If first visit, ensure the cookie is set to BAN for Server Components
      document.cookie = `language=BAN; path=/; max-age=31536000`;
    }

    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);

    localStorage.setItem("language", lang);

    // Save for Server Components
    document.cookie = `language=${lang}; path=/; max-age=31536000`;
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