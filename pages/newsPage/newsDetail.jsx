import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getNewsDetails } from "../../services/newsService";
import Link from "next/link";

const NewsDetail = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { id } = router.query;
  const { locale } = router;

  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);

  //  dynamic font based on locale
  const fontFamilyStyle =
    locale?.startsWith("ar")
      ? { fontFamily: '"GE_SS_Medium", Arial, sans-serif' }
      : { fontFamily: '"Gill Sans MT", Arial, sans-serif' };

  useEffect(() => {
    if (!id) return;

    const fetchNewsDetails = async () => {
      try {
        const data = await getNewsDetails(id);
        setNewsData(data.news || data);
      } catch (err) {
        console.error("Error fetching news details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [id]);

  if (loading)
    return (
      <>
        <Head>
          <title>{t("Details")}</title>
        </Head>

        <div className="_breadcrumb bg-[#f4f4f4] py-6 px-6 sm:px-12 md:px-20">
          <p className="_breadcrumb-header text-[22px] font-semibold text-[#222] mb-2">
            {t("Details")}
          </p>
        </div>

        <section className="flex items-center justify-center min-h-[70vh] bg-[#f9f9f9]">
          <p className="text-center text-gray-600 text-lg">{t("Loading...")}</p>
        </section>
      </>
    );

  if (!newsData)
    return (
      <p className="text-center text-gray-600 text-lg mt-20">
        {t("No News Found")}
      </p>
    );

  return (
    <>
      <Head>
        <title>{locale === "ar" ? newsData.title_ar : newsData.title_en}</title>
      </Head>

      {/* === Breadcrumb Header === */}
      <div className="_breadcrumb bg-[#f4f4f4] py-6 px-6 sm:px-12 md:px-20">
        <p className="_breadcrumb-header text-[22px] font-semibold text-[#222] mb-2">
          {t("Details")}
        </p>
      </div>

      {/* === News Detail Section === */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-24 xl:px-36 py-1 bg-[#f9f9f9]">
        {/* === Breadcrumb Navigation === */}
        <div className="lg:p-4 p-6 sm:p-8 md:p-10 ">
          <nav
            className="text-[13px] md:text-[12px] text-gray-600 lg:p-2 shadow-sm"
              style={fontFamilyStyle}
          >
            <Link
              href="/"
              className="text-[#666666]  hover:text-decoration-line:underline; transition-colors"
               style={fontFamilyStyle}
            >
              {t("home")}
            </Link>
            <span className="mx-1">{">"}</span>
            <Link
              href="/newsPage"
              className="text-[#666666] transition-colors"
               style={fontFamilyStyle}
            >
              {t("news")}
            </Link>
            <span className="mx-1">{">"}</span>
            <span
              className="text-[#b30000] text-[12px] md:text-[12px]"
                style={fontFamilyStyle}
            >
              {locale === "ar" ? newsData.title_ar : newsData.title_en}
            </span>
          </nav>
        </div>

        <div className=" py-2 p-6 sm:p-8 md:p-10 lg:p-4">
          {/* === Header Section: Title + Date + Floated Image === */}
          <div className="relative">
            {newsData.img_url && (
              <div
                className={`${
                  locale === "ar" ? "float-left mr-6" : "float-right ml-6"
                } mb-3 w-full sm:w-72 md:w-80 lg:w-96 relative`}
              >
                <Image
                  src={newsData.img_url}
                  alt={newsData.title_en || "News image"}
                  width={400}
                  height={300}
                  className="object-cover rounded-sm"
                />
              </div>
            )}

            {/* Title and Date — aligned with image top */}
            <h2
              className="text-[#CC0000] text-[15px] md:text-[16px] leading-tight mb-2"
              style={fontFamilyStyle}
            >
              {locale === "ar" ? newsData.title_ar : newsData.title_en}
            </h2>

            <p
              className="text-[#666666] text-sm md:text-xs mb-2"
              style={fontFamilyStyle}
            >
              {new Date(newsData.created_at).toLocaleDateString("en-GB")}
            </p>
          </div>

          {/* === Text Content (wraps beside & under image) === */}
          <div
            className={`mt-2 news-content s  ${locale?.startsWith("ar") ? "arabic" : ""}`}
            style={{
              color: "#666666",
             fontSize: locale?.startsWith("ar") ? "14px" : "12px",
              ...fontFamilyStyle,
            }}
            dangerouslySetInnerHTML={{
              __html:
                locale === "ar"
                  ? newsData.content_ar
                  : newsData.content_en,
            }}
          />  

          {/* === Clear float === */}
          <div className="clear-both"></div>
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

export default NewsDetail;


