import Head from "next/head";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NewsCard from "./newsCard";
import { getNews } from "../../services/newsService";

const PAGE_SIZE = 3;

const News = ({ initialNews }) => {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  const [newsList, setNewsList] = useState(initialNews);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialNews.length === PAGE_SIZE);

  const formatDesc = (html) => {
    const plain = html.replace(/<[^>]+>/g, "");
    return plain.length > 200 ? plain.slice(0, 200) + "..." : plain;
  };

const onLoadMore = async () => {
  try {
    setLoadingMore(true);
    const nextPage = page + 1;

    // Fetch next page only
    const newItems = await getNews(nextPage, PAGE_SIZE);

    // Append new items to the existing list
    setNewsList((prev) => [...prev, ...newItems]);

    // If fewer than PAGE_SIZE items returned, we reached the end
    if (newItems.length < PAGE_SIZE) {
      setHasMore(false);
    }

    setPage(nextPage);
  } catch (err) {
    console.error("Error loading more news:", err);
  } finally {
    setLoadingMore(false);
  }
};


  return (
    <>
      <Head>
        <title>{t("Home-NCSI PORTAL")}</title>
        <meta id="ctl00_ctl00_SEO_description" name="description" content={t('meta_des_publications')}></meta>
        <meta id="ctl00_ctl00_SEO_keyWords" name="keywords" content="NCSI,NCSI Oman,Oman Statistics,Oman Indicators الإحصاء , المركز الوطنى للإحصاء والمعلومات , عمان, مؤشرات,Heba Elaraby,Adel Elaraby ,Omar Yusuf,Mahmoud AbdelSabour,Mahmoud Roushdy,Amr Eladly,Eachawy,Maab Ashraf,Yasmeen AbdelSattar,National,Centre,for,Statistics,and,Information,-,"></meta>
      </Head>

      {/* Top News Header */}
      <section className="events-section px-0 md:px-12 lg:px-20 bg-[#f4f4f4]">
        <div className="_breadcrumb">
          <p className="_breadcrumb-header text-[22px] font-semibold text-[#222]">
            {t("Top_News")}
          </p>
        </div>
      </section>

      {/* News List */}
<section className="bg-[#e5e5e5] py-6 px-8 sm:px-10 md:px-20 lg:px-28 xl:px-32">
  {newsList.length === 0 ? (
    <p className="text-center text-gray-600 text-lg">{t("No News Found")}</p>
  ) : (
    <>
      <div className="flex flex-col gap-2">
        {newsList.map((item, index) => (
          <div
            key={item.id}
            className="animate-fadeInUp transition-all duration-700 ease-in-out"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: "both",
            }}
          >
            <NewsCard
              id={item.id}
              title={locale === "ar" ? item.title_ar : item.title_en}
              description={
                locale === "ar"
                  ? formatDesc(item.content_ar)
                  : formatDesc(item.content_en)
              }
            date={
  item.news_date
    ? new Date(item.news_date).toLocaleDateString("en-GB")
    : ""
}

              image={item.img_url}
              link={`/newsPage/newsDetail?id=${item.id}`}
            />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="text-[#f58220] font-extrabold text-lg md:text-[16px] disabled:opacity-60 hover:underline"
          >
            {loadingMore ? t("loading") : t("load_more_news")}
          </button>
        </div>
      )}
    </>
  )}
</section>

    </>
  );
};

//  Server-Side Fetch
export async function getServerSideProps({ locale }) {
  const initialNews = await getNews(1, PAGE_SIZE);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      initialNews,
    },
  };
}

export default News;
