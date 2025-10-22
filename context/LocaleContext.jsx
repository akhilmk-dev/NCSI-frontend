// context/LocaleContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const LocaleContext = createContext();

export function LocaleProvider({ children }) {
  const { locale: routerLocale, push, pathname, query, asPath } = useRouter();
  const [locale, setLocale] = useState(routerLocale || 'en');

  const changeLocale = (newLocale) => {
    setLocale(newLocale);
    push({ pathname, query }, asPath, { locale: newLocale });
  };

  useEffect(() => {
    setLocale(routerLocale);
  }, [routerLocale]);

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
