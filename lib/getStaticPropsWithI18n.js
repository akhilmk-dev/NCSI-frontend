// lib/getStaticPropsWithI18n.js
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getStaticPropsWithI18n(locale, namespaces = ['common']) {
  return {
    props: {
      ...(await serverSideTranslations(locale, namespaces)),
    },
  };
}
