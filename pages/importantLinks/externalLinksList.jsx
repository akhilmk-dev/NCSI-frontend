import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React from "react";

const ExternalLinksList = ({ links = []}) => {
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  return (
    <section className="bg-white  px-16 sm:px-24 md:px-40 lg:px-56 xl:px-72"
    style={{ paddingTop: '7rem', paddingBottom: '1rem' }}

    >
      <ul className="divide-y   max-w-[1200px] mx-auto">
        {links.map((item, index) => (<li key={index} className="py-0.5 " style={{ borderColor: '#999999' }}>

            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#666666] text-[13px] hover:text-[#c00] transition-colors duration-300"
            >
              ▪ {t(item?.key)}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};


export default ExternalLinksList;
export async function getStaticProps({locale}) {
   return {
            props: {
            ...(await serverSideTranslations(locale, ['common'])), // load your namespaces
      },
   };
}