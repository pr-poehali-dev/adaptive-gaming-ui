import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Language, TRANSLATIONS } from '@/lib/i18n';

const STORAGE_KEY = 'facet-language-v1';

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved && TRANSLATIONS[saved]) return saved;
  } catch { /* noop */ }
  return 'ru';
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(detectInitialLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch { /* noop */ }
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Language) => setLangState(l), []);

  const t = useCallback(
    (key: string) => TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.ru[key] ?? key,
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
