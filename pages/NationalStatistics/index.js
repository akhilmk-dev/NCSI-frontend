import { useTranslation } from "next-i18next";
import Head from "next/head";

const NationalStatistics = () => {
  const { t } = useTranslation("common");

  const leftColumn = [
    "National Accounts (GDP)",
    "Consumer Price Index",
    "General Government Operations",
    "Central Government Operations",
    "Central Government Gross Debt",
    "Depository Corporations Survey",
    "Central Bank Survey",
    "Interest Rates",
  ];

  const rightColumn = [
    "Stock Market",
    "Balance of Payments",
    "External Debt",
    "Official Reserve Assets",
    "Merchandise Trade",
    "International Investment Position (IIP)",
    "Exchange Rates",
  ];

  return (
    <>
      <Head>
        <title>{t("national_statistics")}</title>
      </Head>

      <section className="events-section px-0 md:px-12 lg:px-20 bg-[#f4f4f4]">
        {/* Breadcrumb */}
        <div className="_breadcrumb">
          <p className="_breadcrumb-header">
            {t("National Summary Data Page (NSDP)-Oman")}
          </p>
        </div>
      </section>

      <section className="bg-[#e5e5e5] py-8 px-6 sm:px-10 md:px-20 lg:px-28 xl:px-32">
        {/* Info paragraph */}
        <h5 className="text-[#3a3a3a] text-[14px] md:text-[15px] leading-relaxed mb-6">
          Data linked from this page correspond to data described in the International Monetary Fund's DSBB. 
          For a fuller explanation of the DSBB and the enhanced General Data Dissemination System in which 
          Oman participates, please visit the DSBB home page.
        </h5>

        {/* Green Heading Bar */}
        <div className="bg-[#00a895] flex items-center justify-center mt-6 py-2 md:py-3 rounded">
          <h2 className="text-white text-base sm:text-lg md:text-lg font-semibold leading-tight text-center">
            {t("Macroeconomic and Financial Data")}
          </h2>
        </div>

        {/* === Data Table Section === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-6">
          {/* Left Column */}
          <div>
            {leftColumn.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between px-5 h-[65px] ${
                  (index + 1) % 2 === 0 ? "bg-[#e5e5e5]" : "bg-white"
                }`}
              >
                {/* Title */}
                <p
                  className="text-[14 px] font-semibold text-[#3a3a3a]"
                  style={{
                    fontFamily: '"Janna LT", "DroidKufiRegular", Arial, sans-serif',
                  }}
                >
                  {item}
                </p>

                {/* Buttons */}
                <div className="flex gap-2 min-w-[260px] justify-end">
                  <button
                    className="bg-[#d1d1d1] text-[#3a3a3a] text-[13px] font-medium px-3 py-[3px] rounded-full w-[115px]"
                    style={{
                      fontFamily: '"Janna LT", "DroidKufiRegular", Arial, sans-serif',
                    }}
                  >
                    Browse Data
                  </button>
                  <button
                    className="bg-[#d1d1d1] text-[#3a3a3a] text-[13px] font-medium px-3 py-[3px] rounded-full w-[145px]"
                    style={{
                      fontFamily: '"Janna LT", "DroidKufiRegular", Arial, sans-serif',
                    }}
                  >
                    Download in SDMX
                  </button>
                  <button
                    className="bg-[#d1d1d1] text-[#3a3a3a] text-[13px] font-medium px-3 py-[3px] rounded-full w-[120px]"
                    style={{
                      fontFamily: '"Janna LT", "DroidKufiRegular", Arial, sans-serif',
                    }}
                  >
                    DSBB Metadata
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div>
            {rightColumn.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between px-5 h-[65px] ${
                  (index + 1) % 2 === 0 ? "bg-[#e5e5e5]" : "bg-white"
                }`}
              >
                {/* Title */}
                <p
                  className="text-[15px] font-semibold text-[#3a3a3a]"
                  style={{
                    fontFamily: '"Janna LT", "DroidKufiRegular", Arial, sans-serif',
                  }}
                >
                  {item}
                </p>

                {/* Buttons */}
                <div className="flex gap-2 min-w-[260px] justify-end">
                  <button
                    className="bg-[#d1d1d1] text-[#3a3a3a] text-[13px] font-medium px-3 py-[3px] rounded-full w-[115px]"
                    style={{
                      fontFamily: '"Janna LT", "DroidKufiRegular", Arial, sans-serif',
                    }}
                  >
                    Browse Data
                  </button>
                  <button
                    className="bg-[#d1d1d1] text-[#3a3a3a] text-[13px] font-medium px-3 py-[3px] rounded-full w-[145px]"
                    style={{
                      fontFamily: '"Janna LT", "DroidKufiRegular", Arial, sans-serif',
                    }}
                  >
                    Download in SDMX
                  </button>
                  <button
                    className="bg-[#d1d1d1] text-[#3a3a3a] text-[13px] font-medium px-3 py-[3px] rounded-full w-[120px]"
                    style={{
                      fontFamily: '"Janna LT", "DroidKufiRegular", Arial, sans-serif',
                    }}
                  >
                    DSBB Metadata
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default NationalStatistics;
