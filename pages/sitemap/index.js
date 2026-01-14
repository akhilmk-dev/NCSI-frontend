import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const { useTranslation } = require("next-i18next");

const Esurvey = () => {
  const { t } = useTranslation("common");
    const { locale } = useRouter();

    const fontFamilyStyle = {
    fontFamily: locale?.startsWith("ar")
      ? '"Janna LT", DroidKufiRegular'
      : '"Gill Sans MT", Arial, sans-serif',
    fontSize: "14px",
    lineHeight: "1.6",
  };

  return (
    <>
      <Head>
        <title>{t("sitemap")}</title>
        <meta id="ctl00_ctl00_SEO_description" name="description" content={t('meta_des_publications')}></meta>
        <meta id="ctl00_ctl00_SEO_keyWords" name="keywords" content="NCSI,NCSI Oman,Oman Statistics,Oman Indicators الإحصاء , المركز الوطنى للإحصاء والمعلومات , عمان, مؤشرات,Heba Elaraby,Adel Elaraby ,Omar Yusuf,Mahmoud AbdelSabour,Mahmoud Roushdy,Amr Eladly,Eachawy,Maab Ashraf,Yasmeen AbdelSattar,National,Centre,for,Statistics,and,Information,-,"></meta>

      </Head>

      <section className="events-section px-0 md:px-12 lg:px-20 bg-[#f4f4f4]">
        {/* Breadcrumb */}
        <div className="_breadcrumb">
          <p className="_breadcrumb-header uppercase">{t("sitemap")}</p>
        </div>  

<div className="bg-white py-20 px-[4rem] md:px-20">
  <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">

    {/* LEFT SIDE — SITE MAP */}
    <div>
      <h2  className={`text-[#b30000] text-[15px] md:text-[15.5px] fw-bold mb-1 ${
    locale?.startsWith("ar") ? "" : "px-0"
  }`}>
        {t("sitemap")}
      </h2>
<ul
  className={`list-disc text-[14px] space-y-3 [&_a]:text-black ${
    locale?.startsWith("ar") ? "pr-6" : "pl-6"
  }`}
  style={fontFamilyStyle}
>

  <li>
    <Link href="https://ncsi.gov.om/" target="_blank">
      {t("home")}
    </Link>
  </li>

  <li>
    <Link href="https://ncsi.gov.om/hierarchy" target="_blank">
      {t("About_Us")}
    </Link>
  </li>

  <li>
    <Link href="https://ncsi.gov.om/newsPage" target="_blank">
      {t("news")}
    </Link>
  </li>

  <li>
    <Link href="https://ncsi.gov.om/publications" target="_blank">
      {t("publications")}
    </Link>
  </li>

  <li>
    <Link href="https://ncsi.gov.om/events" target="_blank">
      {t("events_and_occasions")}
    </Link>
  </li>

    <li>
<Link
  href={
    locale?.startsWith("ar")
      ? "https://ncsi.gov.om/ar/Gov.%20Service-Guide.pdf"
      : "https://ncsi.gov.om/Gov.%20Service-Guide.pdf"
  }
  target="_blank"
>
  {t("service_guide")}
</Link>

  </li>
  <li>
    <Link href="https://ncsi.gov.om/Licenses" target="_blank">
      {t("request_for_license_to_conduct_a_survey_and_verify_license_submission")}
    </Link>
  </li>
  <li>
    <Link href="https://ncsi.gov.om/guidesAndClassifications" target="_blank">
      {t("guidelines_and_methodologies")}
    </Link>
  </li>
    <li>
    <Link href="https://ncsi.gov.om/ar/Disclaimer" target="_blank">
      {t("privacy_policy")}
    </Link>
  </li>
      <li>
    <Link href="https://ncsi.gov.om/ar/TermsAndConditions" target="_blank">
      {t("terms_of_use")}
    </Link>
  </li>
        <li>
    <Link href="https://ncsi.gov.om/ar/importantLinks" target="_blank">
      {t("related_websites")}
    </Link>
  </li>
          <li>
    <Link href="https://tajawob.om/p/home" target="_blank">
      {t("tajawob_platform")}
    </Link>
  </li>

  <li>
    <Link href="https://ncsi.gov.om/contact-us" target="_blank">
      {t("contact_us")}
    </Link>
  </li>
</ul>

    </div>

    {/* RIGHT SIDE — MAIN GATES */}
    <div  className="w-full max-w-[60rem]">
            <h2  className={`text-[#b30000] text-[15px] md:text-[15.5px] fw-bold mb-1 ${
    locale?.startsWith("ar") ? "" : "px-0"
  }`}>
        {t("main_gates")}
      </h2>

<ul
  className={`list-disc text-[14px] space-y-3 [&_a]:text-black ${
    locale?.startsWith("ar") ? "pr-6" : "pl-6"
  }`}
  style={fontFamilyStyle}
>

  <li>
    <Link href={
      locale?.startsWith("ar")
      ? "https://portal.ecensus.gov.om/web/#/ar/"
      : "https://portal.ecensus.gov.om/web/#/en/"
    }
    
    target="_blank">
      {t("electronic_census_portal")}
    </Link>
  </li>

  <li>
    <Link href={
      locale?.startsWith("ar")
      ? "https://sdg.ncsi.gov.om/sdgwebsite/"
      : "https://sdg.ncsi.gov.om/sdgwebsite/"
    }
    
    target="_blank">
      {t("sustainable_development")}
    </Link>
  </li>

  <li>
    <Link href={
      locale?.startsWith("ar")
      ? "https://www.ncsi.gov.om/ar/NationalStatistics"
      : "https://www.ncsi.gov.om/NationalStatistics"
    }
    
    target="_blank">
      {t("national_data")}
    </Link>
  </li>

  <li>
    <Link href="https://nsdig2gapps.ncsi.gov.om/nsdiportal/" target="_blank">
      {t("oman_spatial_data")}
    </Link>
  </li>

      <li>
    <Link href={
      locale?.startsWith("ar")
      ? "https://www.ncsi.gov.om/ar/women-in-oman"
      : "https://www.ncsi.gov.om/women-in-oman"
    }
    
    target="_blank">
      {t("women_in_the_sultanate_of_oman")}
    </Link>
  </li>

  <li>
    <Link href="https://manafeth.ncsi.gov.om/" target="_blank">
      {t("government_trade_portals")}
    </Link>
  </li>

</ul>

    </div>

  </div>
</div>


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


export default Esurvey;
