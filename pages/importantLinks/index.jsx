import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ExternalLinksList from './externalLinksList';

const externalLinks = [
    { title: "ITU", href: "#" },
    { title: "UN data", href: "#" },
    { title: "UNESCO Statistics Institute", href: "#" },
    { title: "Central Bank of Oman", href: "#" },
    { title: "unicef", href: "#" },
    { title: "United Nations Statistical Commission", href: "#" },
    { title: "WHO", href: "#" },
    { title: "GCC-STAT", href: "#" },
    { title: "General Authority for Statistics, Kingdom of Saudi Arabia", href: "#" },
    { title: "Information & eGovernment Authority — Kingdom of Bahrain", href: "#" },
    { title: "Official data portal of the UAE Government", href: "#" },
    { title: "Kuwait Central Statistical Bureau", href: "#" },
    { title: "Planning and Statistics Authority — Qatar", href: "#" },
    { title: "SESRIC", href: "#" },
    { title: "Arab Institute for Training & Research in Statics", href: "#" },
    { title: "National Open Data Portal", href: "#" },
  ];

const importantLinks=()=>{
    const {t}=useTranslation("common");
    const {locale}=useRouter();

    return (
        
        <>
        
        <Head>
            <title>{t('important links')}</title>
        </Head>
            <section className="events-section px-0 md:px-12 lg:px-20 bg-[#f4f4f4]">
                                   <div class="_breadcrumb">
          <p class="_breadcrumb-header">{t('Important Links')}</p>
        </div>

         <ExternalLinksList links={externalLinks} />
            </section>

    
        </>
    )
}

export default importantLinks;