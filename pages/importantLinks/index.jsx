import { useTranslation } from "next-i18next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ExternalLinksList from "./externalLinksList";

const ImportantLinks = () => {
  const { t } = useTranslation("common");

  // Pass only translation KEYS (not translated text)
  const externalLinks = [
    { key: "ITU", href: "#" },
    { key: "UN_data", href: "#" },
    { key: "UNESCO_Statistics_Institute", href: "#" },
    { key: "Central_Bank_of_Oman", href: "#" },
    { key: "unicef", href: "#" },
    { key: "United_Nations_Statistical_Commission", href: "#" },
    { key: "WHO", href: "#" },
    { key: "GCC_STAT", href: "#" },
    { key: "General_Authority_for_Statistics,_Kingdom_of_Saudi_Arabia", href: "#" },
    { key: "Information_&_eGovernment_Authority__Kingdom_of_Bahrain", href: "#" },
    { key: "Official_data_portal_of_the_UAE_Government", href: "#" },
    { key: "Kuwait_Central_Statistical_Bureau", href: "#" },
    { key: "Planning_and_Statistics_Authority_Qatar", href: "#" },
    { key: "SESRIC", href: "#" },
    { key: "Arab_Institute_for_Training_&_Research_in_Statics", href: "#" },
    { key: "National_Open_Data_Portal", href: "#" },
  ];

  return (
    <>
      <Head>
        <title>{t("important_links")}</title>
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
