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
        <title>{t("e_survey")}</title>
        <meta id="ctl00_ctl00_SEO_description" name="description" content={t('meta_des_publications')}></meta>
        <meta id="ctl00_ctl00_SEO_keyWords" name="keywords" content="NCSI,NCSI Oman,Oman Statistics,Oman Indicators الإحصاء , المركز الوطنى للإحصاء والمعلومات , عمان, مؤشرات,Heba Elaraby,Adel Elaraby ,Omar Yusuf,Mahmoud AbdelSabour,Mahmoud Roushdy,Amr Eladly,Eachawy,Maab Ashraf,Yasmeen AbdelSattar,National,Centre,for,Statistics,and,Information,-,"></meta>

      </Head>

      <section className="events-section px-0 md:px-12 lg:px-20 bg-[#f4f4f4]">
        {/* Breadcrumb */}
        <div className="_breadcrumb">
          <p className="_breadcrumb-header uppercase">{t("e_survey")}</p>
        </div>  

        <div className="bg-white py-[10rem] flex flex-col gap-1 items-start px-[4rem] md:px-20">
          <Link
            href="https://apps1.ncsi.gov.om/PPI/"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline flex items-center gap-1"
             style={fontFamilyStyle}
          >
            <span className="text-black">-</span>
            <span className="text-[#149DCC] hover:text-[#149DCC]">
            {t("Producer_Price_Index_Survey")} 
            </span>
          </Link>

          <Link
            href="https://apps2.ncsi.gov.om/fis/survey/fislogin_execute.action"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline flex items-center gap-1"
             style={fontFamilyStyle}
          >
            <span className="text-black">-</span>
            <span className="text-[#663399] hover:text-[#149DCC]">
              {t("Foreign_Investment_Survey")} 
            </span>
          </Link>
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
