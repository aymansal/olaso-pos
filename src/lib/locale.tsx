import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import { fr } from './fr.ts';

export type AppLanguage = 'en' | 'fr';

const LocaleContext = createContext<AppLanguage>('en');

export function translate(
  language: AppLanguage,
  english: string,
  vars?: Record<string, string | number>,
) {
  let text = language === 'fr' ? (fr[english] ?? english) : english;
  if (vars) {
    for (const [key, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${key}}`, String(value));
    }
  }
  return text;
}

export function LocaleProvider({
  language,
  children,
}: {
  language: AppLanguage;
  children: ReactNode;
}) {
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  return (
    <LocaleContext.Provider value={language}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LocaleContext);
}

export function useT() {
  const language = useLanguage();
  return (
    english: string,
    vars?: Record<string, string | number>,
  ) => translate(language, english, vars);
}
