'use client';

import React from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale, asPath } = router;

  const toggleLanguage = (e) => {
    e.preventDefault();
    const newLocale = locale === 'en' ? 'ar' : 'en';
    Cookies.set('lng',newLocale)
    router.push(asPath, asPath, { locale: newLocale });
  };

  // Decide icon class based on current locale
  const iconClass = locale === 'en'
    ? 'icons-custom-AR header-icons icon-en-ar bg-orange'
    : 'icons-custom-EN header-icons icon-ar-en bg-orange'; 

  return (
    <a href="#" onClick={toggleLanguage}>
      <i className={iconClass}></i>
    </a>
  );
};

export default LanguageSwitcher;
