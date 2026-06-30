import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { es } from './es';
import { en } from './en';

export type Language = 'es' | 'en';

type TranslationKeys = keyof typeof es;

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Read from localStorage if available, default to 'es'
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lfcc-portfolio-lang');
      if (saved === 'es' || saved === 'en') {
        return saved as Language;
      }
    }
    return 'es';
  });

  useEffect(() => {
    localStorage.setItem('lfcc-portfolio-lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  const t = (key: TranslationKeys): string => {
    const dictionary = language === 'es' ? es : en;
    return dictionary[key] || es[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
