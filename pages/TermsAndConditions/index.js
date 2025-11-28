import Head from "next/head";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const TermsAndConditions = () => {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  // choose font dynamically based on locale
  const contentFontStyle = locale?.startsWith("ar")
    ? {
        fontFamily: '"Janna LT", "DroidKufiRegular", sans-serif',
        fontSize: "17.3px",
        color: "#666666",
      }
    : {
        fontFamily: "Gill Sans MT, Arial, sans-serif",
      };

  return (
    <>
      <Head>
        <title>{t("terms_of_use")}</title>
        <meta id="ctl00_ctl00_SEO_description" name="description" content={t('meta_des_publications')}></meta>
        <meta id="ctl00_ctl00_SEO_keyWords" name="keywords" content="NCSI,NCSI Oman,Oman Statistics,Oman Indicators الإحصاء , المركز الوطنى للإحصاء والمعلومات , عمان, مؤشرات,Heba Elaraby,Adel Elaraby ,Omar Yusuf,Mahmoud AbdelSabour,Mahmoud Roushdy,Amr Eladly,Eachawy,Maab Ashraf,Yasmeen AbdelSattar,National,Centre,for,Statistics,and,Information,-,"></meta>

      </Head>

      <section className="events-section px-0 md:px-12 lg:px-20">
        {/* === Breadcrumb Header === */}
        <div className="_breadcrumb">
          <p className="_breadcrumb-header">{t("terms_of_use")}</p>
        </div>

        {/* === Terms of Use Section === */}
        <div
          className="
            bg-[#ffff]
            py-10
             md:py-28
            px-6
            sm:px-6
            md:px-10        
            lg:px-[6.5rem]
          "
        >
          <div className="w-full">
            {/* Red Heading */}
            <h2
              className="text-[#cc0000]  text-[16px] md:text-[16px] mb-3"
              style={
                locale?.startsWith("ar")
                  ? {
                      fontFamily: '"Janna LT", "DroidKufiRegular", sans-serif',
                      fontWeight: "bold",
                    }
                  : {}
              }
            >
              {t("terms_of_use")}
            </h2>
            {/* Paragraphs (Arabic font applied dynamically) */}
            
            
            <div className="text-[#3A372A] " style={contentFontStyle}>

              <p className="text-[17px] md:text-[17px] leading-[1] mb-3">
                {t("terms_of_use_paragraph1")}
              </p>

              <p className="text-[17px] md:text-[17px] leading-[1] mb-3">
                {t("terms_of_use_paragraph2")}
              </p>

              <p className="text-[17px] md:text-[17px] leading-[1.90] mb-1">
                {t("terms_of_use_paragraph3")}
              </p>

              {/* Lucida Console paragraph */}
              <p
                className="text-[17px] md:text-[17px] leading-[1.90] mb-1"
                // style={{
                //   fontFamily: '"Lucida Console", Monaco, sans-serif',
                //   fontSize: "13pt",
                //   lineHeight: "1.60",
                // }}
              >
                {t("terms_of_use_paragraph4")}
              </p>
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

export default TermsAndConditions;