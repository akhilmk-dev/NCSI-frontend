import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import SearchResult from "./searchResult";
import Survey from "./survey-request";

const Licenses = () => {
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  const isRTL = locale?.startsWith("ar");

  const [activeTab, setActiveTab] = useState("survey-request"); // default tab

  // ✅ Dynamic font
  const fontStyle = {
    fontFamily: locale?.startsWith("ar")
      ? '"Janna LT", DroidKufiRegular'
      : '"Gill Sans MT", Arial, sans-serif',
  };

  // ✅ Dynamic breadcrumb
  const breadcrumbTitle =
    activeTab === "survey-request"
      ? t("survey_request")
      : t("Search Licenses");

  return (
    <>
      <Head>
        <title>{t("Licenses")}</title>
      </Head>

      {/* === Breadcrumb === */}
      <section className="events-section px-0 md:px-12 lg:px-20 bg-[#f4f4f4]">
        <div className="_breadcrumb">
          <p
            className="_breadcrumb-header text-[22px] font-semibold text-[#222]"
          
          >
            {breadcrumbTitle}
          </p>
        </div>
      </section>

      {/* === Tabs Section (Aligned with table/search bar) === */}
      <section className={`w-full flex flex-col items-center  py-4`}>
        <div className="w-full max-w-6xl">
          <div
            className={`flex mb-10 ${
              isRTL ? "justify-end px-4" : "justify-start px-4"
            }`}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab("survey-request")}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === "survey-request"
                    ? "bg-[#00A895] text-white"
                    : "bg-white border border-[#00A895] text-[#00A895]"
                }`}
                // style={fontStyle}
              >
                {t("Submit a new application")}
              </button>

              <button
                onClick={() => setActiveTab("search-licenses")}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === "search-licenses"
                    ? "bg-[#00A895] text-white"
                    : "bg-white border border-[#00A895] text-[#00A895]"
                }`}
                style={fontStyle}
              >
                {t("Verify License")}
              </button>
            </div>
          </div>

          {/* === Tab Content === */}
          <div>
            {activeTab === "survey-request" ? <Survey /> : <SearchResult />}
          </div>
        </div>
      </section>
    </>
  );
};

export default Licenses;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
