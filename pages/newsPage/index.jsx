import Head from "next/head";
import { useTranslation } from "next-i18next";
import React from "react";
import { useRouter } from "next/router";
import NewsCard from "./newsCard";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const NewsPage = () => {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  return (
    <>
      <Head>
        <title>{t("Top News")}</title>
      </Head>

      {/* === Top News Header Section === */}
      <section className="events-section px-0 md:px-12 lg:px-20 bg-[#f4f4f4]">
        <div className="_breadcrumb">
          <p className="_breadcrumb-header text-[22px] font-semibold text-[#222]">
            {t("Top News")}
          </p>
        </div>
      </section>

      {/* === News Section BELOW Top News === */}
      <section className="bg-[#e5e5e5] py-12 px-[5rem] sm:px-10 md:px-20 lg:px-28 xl:px-36">
        <div className="flex flex-col gap-12">
          <NewsCard
            title="NCSI Receives an Iraqi Delegation to Strengthen Arab Statistical Cooperation"
            description="The National Centre for Statistics and Information (NCSI) received on Wednesday, 15 October 2025, a delegation from the General Authority for Statistics and Geographical Systems of the Republic of Iraq."
            date="2025/10/15"
            image="/assets/images/gallery/news-img-4.jpg"
            link="#"
          />

          <NewsCard
            title="Oman's total refinery output rises by 1.6%"
            description="According to preliminary data from the National Centre for Statistics and Information (NCSI), gasoline and diesel posted notable gains."
            date="2025/09/21"
            image="/assets/images/gallery/news-img-1.jpg"
            link="#"
          />
                    <NewsCard
            title="Oman's total refinery output rises by 1.6%"
            description="According to preliminary data from the National Centre for Statistics and Information (NCSI), gasoline and diesel posted notable gains."
            date="2025/09/21"
            image="/assets/images/gallery/news-img-2.jpg"
            link="#"
          />
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

export default NewsPage;
