import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const WomenInOman = () => {
  
    const { t } = useTranslation('common');
     const { locale } = useRouter();

    const iframeUrl = locale === 'ar'
      ? 'https://app.powerbi.com/view?r=eyJrIjoiZWY4MDBiNGUtNTk2YS00N2IxLTljYTItYTEyYzBiYzg0ZWVlIiwidCI6ImUxNjhmYTA0LTVkNGUtNDI4MS1iZGM0LTBjYzM0NjQ0NDVlYSIsImMiOjl9'
      : 'https://app.powerbi.com/view?r=eyJrIjoiY2I2ODE4MzQtNWQ1Ny00MmU5LWJjMGEtNzU0MzgwZmZiMzhmIiwidCI6ImUxNjhmYTA0LTVkNGUtNDI4MS1iZGM0LTBjYzM0NjQ0NDVlYSIsImMiOjl9';


  return (
    <>
     <Head>
        <title>{t('women_in_oman')}</title>
        <meta id="ctl00_ctl00_SEO_description" name="description" content={t('meta_des_publications')}></meta>
        <meta id="ctl00_ctl00_SEO_keyWords" name="keywords" content="NCSI,NCSI Oman,Oman Statistics,Oman Indicators الإحصاء , المركز الوطنى للإحصاء والمعلومات , عمان, مؤشرات,Heba Elaraby,Adel Elaraby ,Omar Yusuf,Mahmoud AbdelSabour,Mahmoud Roushdy,Amr Eladly,Eachawy,Maab Ashraf,Yasmeen AbdelSattar,National,Centre,for,Statistics,and,Information,-,"></meta>
    </Head>
    <section className="women-in-oman-section">

      <div className="powerbi-iframe-wrapper" style={{ width: "100%", height: "100vh", marginTop: "20px" }}>
        <iframe
          title="Power BI Report"
          width="100%"
          height="100%"
          src={iframeUrl}
          frameBorder="0"
          allowFullScreen
        ></iframe>
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

export default WomenInOman;
