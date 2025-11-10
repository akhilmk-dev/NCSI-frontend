import { useTranslation } from "next-i18next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ExternalLinksList from "./externalLinksList";

const ImportantLinks = () => {
  const { t } = useTranslation("common");

  // Pass only translation KEYS (not translated text)
  const externalLinks = [
    { key: "ITU", href: "https://www.itu.int/en/Pages/default.aspx" },
    { key: "UN_data", href: "https://www.one.org/" },
    { key: "UNESCO_Statistics_Institute", href: "https://www.uis.unesco.org/Pages/default.aspx" },
    { key: "Central_Bank_of_Oman", href: "https://cbo.gov.om/ar" },
    { key: "unicef", href: "https://www.unicef.org/" },
    { key: "United_Nations_Statistical_Commission", href: "https://unstats.un.org/UNSDWebsite/" },
    { key: "WHO", href: "https://www.who.int/en/" },
    { key: "GCC_STAT", href: "https://gccstat.org/ar/" },
    { key: "General_Authority_for_Statistics,_Kingdom_of_Saudi_Arabia", href: "https://www.stats.gov.sa/" },
    { key: "Information_&_eGovernment_Authority__Kingdom_of_Bahrain", href: "https://www.iga.gov.bh/" },
    { key: "Official_data_portal_of_the_UAE_Government", href: "https://bayanat.ae/en" },
    { key: "Kuwait_Central_Statistical_Bureau", href: "https://www.csb.gov.kw/" },
    { key: "Planning_and_Statistics_Authority_Qatar", href: "https://www.npc.qa/Pages/redirect.aspx" },
    { key: "SESRIC", href: "https://www.sesric.org/ar/" },
    { key: "Arab_Institute_for_Training_&_Research_in_Statics", href: "https://www.aitrs.org/" },
    { key: "National_Open_Data_Portal", href: "https://opendata.gov.om/en" },
  ];

  return (
    <>
      <Head>
        <title>{t("important_links")}</title>
        <meta id="ctl00_ctl00_SEO_description" name="description" content={t('meta_des_publications')}></meta>
        <meta id="ctl00_ctl00_SEO_keyWords" name="keywords" content="NCSI,NCSI Oman,Oman Statistics,Oman Indicators الإحصاء , المركز الوطنى للإحصاء والمعلومات , عمان, مؤشرات,Heba Elaraby,Adel Elaraby ,Omar Yusuf,Mahmoud AbdelSabour,Mahmoud Roushdy,Amr Eladly,Eachawy,Maab Ashraf,Yasmeen AbdelSattar,National,Centre,for,Statistics,and,Information,-,"></meta>

      </Head>

      <section className="events-section px-0 md:px-12 lg:px-20 bg-[#f4f4f4]">
        {/* Breadcrumb */}
        <div className="_breadcrumb">
          <p className="_breadcrumb-header">{t("important_links")}</p>
        </div>

        {/* Pass keys to the component */}
        <ExternalLinksList links={externalLinks} />
      </section>
    </>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default ImportantLinks;
