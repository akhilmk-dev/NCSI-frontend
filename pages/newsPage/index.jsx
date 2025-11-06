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

    // Calculate the number of items to fetch (3, then 6, then 9…)
    const limit = PAGE_SIZE * nextPage;

    // Fetch total data up to that limit
    const allItems = await getNews(1, limit);

    // Slice only the "new" chunk (exclude previous ones)
    const startIndex = PAGE_SIZE * (page - 1);
    const endIndex = PAGE_SIZE * nextPage;
    const newChunk = allItems.slice(startIndex, endIndex);

   
    if (newChunk.length < PAGE_SIZE) setHasMore(false);

   
    setNewsList(newChunk);
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
              date={new Date(item.created_at).toLocaleDateString("en-GB")}
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
            {loadingMore ? t("Loading...") : t("load_more_news")}
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
