import { useTranslation } from "next-i18next";
import Head from "next/head";

const NationalStatistics = () => {
  const { t } = useTranslation("common");

  const leftData = [
    "National Accounts (GDP)",
    "Consumer Price Index",
    "General Government Operations",
    "Central Government Operations",
    "Central Government Gross Debt",
    "Depository Corporations Survey",
    "Central Bank Survey",
    "Interest Rates",
  ];

  const rightData = [
    "Stock Market",
    "Balance of Payments",
    "External Debt",
    "Official Reserve Assets",
    "Merchandise Trade",
    "International Investment Position (IIP)",
    "Exchange Rates",
  ];

  // common button styles
  const btn = `text-[11px] font-[500] border border-[#ccc] rounded-full px-2 py-[6px] min-w-[120px] text-center`;

  return (
    <>
      <Head>
        <title>{t("national_statistics")}</title>
      </Head>

      {/* Breadcrumb */}
      <section className="events-section px-0 md:px-12 lg:px-20 bg-[#f4f4f4]">
        <div className="_breadcrumb">
          <p className="_breadcrumb-header">
            {t("National Summary Data Page (NSDP)-Oman")}
          </p>
        </div>
      </section>

      {/* Main section */}
      <section className="bg-[#e5e5e5] py-8 px-6 sm:px-10 md:px-20 lg:px-28 xl:px-32 ">
        {/* Description */}
        <h5 className="text-[#3a3a3a] text-[14px] md:text-[15px] leading-relaxed mb-6">
          Data linked from this page correspond to data described in the International Monetary Fund's DSBB. 
          For a fuller explanation of the DSBB and the enhanced General Data Dissemination System in which 
          Oman participates, please visit the DSBB home page.
        </h5>

        {/* Green header */}
        <div className="bg-[#00a895] flex items-center justify-center py-2  mb-8">
          <h2 className="text-white text-[18px] font-semibold text-center">
            {t("Macroeconomic and Financial Data")}
          </h2>
        </div>

        {/* === Two column layout === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {[leftData, rightData].map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col w-full">
              {column.map((title, idx) => {
                const isWhite = idx % 2 === 0;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between flex-wrap md:flex-nowrap ${
                      isWhite ? "bg-white" : "bg-[#e5e5e5]"
                    } py-[3px] px-[18px] border border-[#ddd]`}
                  >
                    {/* Title */}
                    <p className="text-[#6d6e71] text-[14px] md:text-[14px] font-semibold mb-2 md:mb-0"
                     style={{ fontFamily: '"Janna LT", DroidKufiRegular' }}>
                      {t(title)}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      {/* First button set (for white row) */}
                      {isWhite ? (
                        <>
                          <button className={`${btn} bg-[#e5e5e5]`}>
                            {t("Browse Data")}
                          </button>
                          <button className={`${btn} bg-[#e5e5e5]`}>
                            {t("Download in SDMX")}
                          </button>
                          <button className={`${btn} bg-[#e5e5e5]`}>
                            {t("DSBB Metadata")}
                          </button>
                        </>
                      ) : (
                        /* For grey row: white buttons */
                        <>
                          <button className={`${btn} bg-white`}>
                            {t("Browse Data")}
                          </button>
                          <button className={`${btn} bg-white`}>
                            {t("Download in SDMX")}
                          </button>
                          <button className={`${btn} bg-white`}>
                            {t("DSBB Metadata")}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default NationalStatistics;
