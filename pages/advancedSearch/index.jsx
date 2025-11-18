import Head from "next/head";
import SearchFilterForm from "./SearchFilterForm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getNcsiSearchResults } from "@/services/searchService";
import { useTranslation } from "next-i18next";

const AdvancedSearch = ({ initialResults, initialQuery }) => {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("Advanced_search")}</title>
        <meta
          name="description"
          content="Search across NCSI modules, publications, and data"
        />
      </Head>

      <div className="_breadcrumb">
        <p className="_breadcrumb-header">{t("Advanced_search")}</p>
      </div>

      <div className="flex justify-center items-center min-h-[55vh] lg:min-h-[50vh] bg-[#fff]">
        <div className="w-full max-w-[1100px] px-6 sm:px-8 md:px-10">
          <SearchFilterForm
            initialResults={initialResults}
            initialQuery={initialQuery}
          />
        </div>
      </div>
    </>
  );
};

// ✅ Server-side rendering
export async function getServerSideProps({ query, locale }) {
  const q = query.q || "";
  let initialResults = [];

  // Fetch only if minimum 3 letters
  if (q.trim().length >= 3) {
    try {
      const res = await getNcsiSearchResults({
        q,
        modules: [],         // 🔥 show ALL modules by default in SSR
        sort: "relevance",   // 🔥 default sorting
        dir: "asc",
        currentpage: 1       // 🔥 correct parameter
      });

      initialResults = res.items || [];
    } catch (err) {
      console.error("SSR Search fetch failed:", err.message);
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      initialResults,
      initialQuery: q,
    },
  };
}

export default AdvancedSearch;
