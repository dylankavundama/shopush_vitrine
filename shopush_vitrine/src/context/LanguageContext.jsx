import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../constants/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('ush_language') || 'fr';
  });

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    const newLang = language === 'fr' ? 'en' : 'fr';
    setLanguage(newLang);
    localStorage.setItem('ush_language', newLang);
  };

  const setLang = (lang) => {
    setLanguage(lang);
    localStorage.setItem('ush_language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
