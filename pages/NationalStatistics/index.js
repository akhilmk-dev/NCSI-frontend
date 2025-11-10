import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Image from "next/image";

const NationalStatistics = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  //  Section 1: Main data (already existing)
  const leftData = [
    {
      title: "National Accounts_(GDP)",
      buttons: ["browse_data", "download_in_sdmx", "dsbb_metadata"],
      links: [
        "https://nsdp.ncsi.gov.om/NationalAccounts.xlsx",
        "https://nsdp.ncsi.gov.om/NationalAccounts.XML",
        "https://dsbb.imf.org/e-gdds/dqaf-base/country/OMN/category/NAG00",
      ],
    },
    {
      title: "Consumer_Price_Index",
      buttons: ["browse_data", "download_in_sdmx", "dsbb_metadata"],
      links: [
        "https://nsdp.ncsi.gov.om/ConsumerPriceIndex.xlsx",
        "https://nsdp.ncsi.gov.om/NationalAccounts.XML",
        "https://dsbb.imf.org/e-gdds/dqaf-base/country/OMN/category/CPI00",
      ],
    },
    { title: "General_Government_Operations", buttons: [] },
    {
      title: "Central_Government_Operations",
      buttons: ["browse_data", "download_in_sdmx", "dsbb_metadata"],
      links: [
        "https://nsdp.ncsi.gov.om/CentralGovernmentOperations.xlsx",
        "https://nsdp.ncsi.gov.om/CentralGovernmentOperations.xml",
        "https://dsbb.imf.org/e-gdds/dqaf-base/country/OMN/category/CGO00",
      ],
    },
    {
      title: "Central_Government_Gross_Debt",
      buttons: ["dsbb_metadata"],
      links: [
        "https://dsbb.imf.org/e-gdds/dqaf-base/country/OMN/category/CGD00",
      ],
    },
    {
      title: "Depository Corporations Survey",
      buttons: ["browse_data", "download_in_sdmx", "dsbb_metadata"],
      links: [
        "https://nsdp.ncsi.gov.om/DepositoryCorporationsSurvey.xlsx",
        "https://nsdp.ncsi.gov.om/DepositoryCorporationsSurvey.xml",
        "https://dsbb.imf.org/e-gdds/dqaf-base/country/OMN/category/AAB00",
      ],
    },
    {
      title: "Central_Bank_Survey",
      buttons: ["browse_data", "download_in_sdmx", "dsbb_metadata"],
      links: [
        "https://nsdp.ncsi.gov.om/CentralBankSurvey.xlsx",
        "https://nsdp.ncsi.gov.om/CentralBankSurvey.xml",
        "https://dsbb.imf.org/e-gdds/dqaf-base/country/OMN/category/AAC00",
      ],
    },
    {
      title: "Interest_Rates",
      buttons: ["browse_data", "download_in_sdmx", "dsbb_metadata"],
      links: [
        "https://nsdp.ncsi.gov.om/InterestRates.xlsx",
        "https://nsdp.ncsi.gov.om/InterestRates.xml",
        "https://dsbb.imf.org/e-gdds/dqaf-base/country/OMN/category/INR00",
      ],
    },
  ];

  const rightData = [
    {
      title: "stock_market",
      buttons: ["browse_data", "download_in_sdmx", "dsbb_metadata"],
      links: [
        "https://nsdp.ncsi.gov.om/StockMarket.xlsx",
        "https://nsdp.ncsi.gov.om/StockMarket.XML",
        "https://dsbb.imf.org/e-gdds/dqaf-base/country/OMN/category/SPI00",
      ],
    },
    {
      title: "Balance_of_Payments",
      buttons: ["browse_data", "download_in_sdmx", "dsbb_metadata"],
      links: [
        "https://nsdp.ncsi.gov.om/BalanceofPayments.xlsx",
        "https://nsdp.ncsi.gov.om/BalanceofPayments.xml",
        "https://dsbb.imf.org/e-gdds/dqaf-base/country/OMN/category/BOP00",
      ],
    },
    {
      title: "External_Debt",
      buttons: ["dsbb_metadata"],
      links: [
        "https://dsbb.imf.org/e-gdds/dqaf-base/country/OMN/category/EXD00",
      ],
    },
    {
      title: "official_reserve_assets",
      buttons: ["browse_data", "download_in_sdmx", "dsbb_metadata"],
      links: [
        "https://nsdp.ncsi.gov.om/OfficialReserveAssets.xlsx",
        "https://nsdp.ncsi.gov.om/OfficialReserveAssets.xml",
        "https://dsbb.imf.org/e-gdds/dqaf-base/country/OMN/category/ILV00",
      ],
    },
    {
      title: "Merchandise_Trade",
      buttons: ["browse_data", "download_in_sdmx", "dsbb_metadata"],
      links: [
        "https://nsdp.ncsi.gov.om/MerchandiseTrade.xlsx",
        "https://nsdp.ncsi.gov.om/MerchandiseTrade.XML",
        "https://dsbb.imf.org/e-gdds/dqaf-base/country/OMN/category/MET00",
      ],
    },
    { title: "International_Investment_Position_(IIP)", buttons: [] },
    {
      title: "Exchange_Rates",
      buttons: ["browse_data", "download_in_sdmx", "dsbb_metadata"],
      links: [
        "https://nsdp.ncsi.gov.om/ExchangeRates.xlsx",
        "https://nsdp.ncsi.gov.om/ExchangeRates.xml",
        "https://dsbb.imf.org/e-gdds/dqaf-base/country/OMN/category/EXR00",
      ],
    },
  ];

  //  Section 2: Encouraged Data
  const encouragedLeft = [
    {
      title: "Production_Index",
      buttons: ["dsbb_metadata"],
      links: [
        "https://dsbb.imf.org/e-gdds/dqaf-base/country/OMN/category/IND00",
      ],
    },
    {
      title: "Labour_Market",
      buttons: ["browse_data", "download_in_sdmx", "dsbb_metadata"],
      links: [
        "https://nsdp.ncsi.gov.om/LaborMarket.xlsx",
        "https://nsdp.ncsi.gov.om/LaborMarket.xml",
        "https://dsbb.imf.org/e-gdds/country/OMN/category",
      ],
    },
  ];

  const encouragedRight = [
    {
      title: "Producer_Price_Index",
      buttons: ["browse_data", "download_in_sdmx", "dsbb_metadata"],
      links: [
        "https://nsdp.ncsi.gov.om/ProducerPriceIndex.xlsx",
        "https://nsdp.ncsi.gov.om/ProducerPriceIndex.XML",
        "https://dsbb.imf.org/e-gdds/dqaf-base/country/OMN/category/PPI00",
      ],
    },
    {
      title: "Financial_Soundness_Indicators_(FSIs)",
      buttons: ["browse_data", "download_in_sdmx"],
      links: [
        "https://nsdp.ncsi.gov.om/FinancialSoundnessIndicators.xlsx",
        "https://nsdp.ncsi.gov.om/FinancialSoundnessIndicators.xml",
      ],
    },
  ];

  //  Section 3: Demographic Data
  const demoLeft = [
    {
      title: "Population",
      buttons: ["browse_data", "download_in_sdmx", "dsbb_metadata"],
      links: [
        "https://nsdp.ncsi.gov.om/Population.xlsx",
        "https://nsdp.ncsi.gov.om/Population.xml",
        "https://dsbb.imf.org/e-gdds/dqaf-base/country/OMN/category/POP00",
      ],
    },
  ];

  const demoRight = [
    {
      title: "Socio-Demographic Indicators",
      buttons: ["browse_data"],
      links: ["/"],
    },
  ];

  //  Section 4: Additional Datasets
  const additionalLeft = [
    {
      title: "Oil_production",
      buttons: ["browse_data", "download_in_sdmx"],
      links: [
        "https://nsdp.ncsi.gov.om/OilProduction.xlsx",
        "https://nsdp.ncsi.gov.om/OilProduction.XML",
      ],
    },
    {
      title: "Depository_Corporations_Survey_(detailed presentation)",
      buttons: ["browse_data", "download_in_sdmx"],
      links: [
        "https://nsdp.ncsi.gov.om/DepositoryCorporationsSurveydetailedpresentationOman.xlsx",
        "https://nsdp.ncsi.gov.om/DepositoryCorporationsSurveydetailedpresentationOman.XML",
      ],
    },
    {
      title: "Financial_Access_Survey",
      buttons: ["browse_data", "download_in_sdmx"],
      links: [
        "https://nsdp.ncsi.gov.om/FinancialAccessSurveyOman.xlsx",
        "https://nsdp.ncsi.gov.om/FinancialAccessSurveyOman.XML",
      ],
    },
  ];

  const additionalRight = [
    {
      title: "Balance_of_Payments_(detailed presentation)",
      buttons: ["browse_data", "download_in_sdmx"],
      links: [
        "https://nsdp.ncsi.gov.om/BalanceofPaymentsdetailedpresentation.xlsx",
        "https://nsdp.ncsi.gov.om/BalanceofPaymentsdetailedpresentation.XML",
      ],
    },
    {
      title: "Direction_of_Trade",
      buttons: ["browse_data", "download_in_sdmx"],
      links: [
        "https://nsdp.ncsi.gov.om/DirectionofTrade.xlsx",
        "https://nsdp.ncsi.gov.om/DirectionofTrade.XML",
      ],
    },
  ];

  // Common button style
  const btn = `text-[11px] font-[500] border border-[#ccc] rounded-full px-1 py-[3px] min-w-[120px] text-center font-semibold`;

  // Common Section Renderer
  const renderTable = (left, right) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-10">
      {[left, right].map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col w-full">
          {column.map((item, idx) => {
            const isWhite = idx % 2 === 0;
            return (
              <div
                key={idx}
                className={`flex items-center justify-between flex-wrap md:flex-nowrap ${
                  isWhite ? "bg-white" : "bg-[#e5e5e5]"
                } py-[6px] px-[18px] border border-[#ddd]`}
              >
                {/* Title */}
                <p
                  className="text-[#6d6e71] text-[14px] md:text-[14px] font-semibold mb-2 md:mb-0"
                  style={{ fontFamily: '"Janna LT", DroidKufiRegular' }}
                >
                  {t(item.title)}
                </p>

                {/* Buttons */}
                <div className="flex gap-2 flex-wrap">
                  {item.buttons.map((btnText, i) => {
                    // --- Hover color logic ---
                    const hoverStyle =
                      btnText === "browse_data"
                        ? "hover:bg-[#133c8b] hover:text-white hover:border-[#133c8b]"
                        : btnText === "download_in_sdmx"
                        ? "hover:bg-[#00a895] hover:text-white hover:border-[#00a895]"
                        : "hover:bg-[#6d6e71] hover:text-white hover:border-[#6d6e71]";

                    // --- Fix: unified neutral base color that contrasts with both white & gray rows ---
                    const baseBg = "bg-[#f4f4f4]"; // stays visible on both white and gray backgrounds
                    const link = item.links?.[i] || "#";

                    return (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${btn} ${baseBg} transition-colors duration-200 ease-in-out ${hoverStyle} no-underline text-[#6d6e71]`}
                        style={{ fontFamily: '"Janna LT", DroidKufiRegular' }}
                      >
                        {t(btnText)}
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Head>
        <title>{t("national_statistics")}</title>
        <meta
          id="ctl00_ctl00_SEO_description"
          name="description"
          content={t("meta_des_publications")}
        ></meta>
        <meta
          id="ctl00_ctl00_SEO_keyWords"
          name="keywords"
          content="NCSI,NCSI Oman,Oman Statistics,Oman Indicators الإحصاء , المركز الوطنى للإحصاء والمعلومات , عمان, مؤشرات,Heba Elaraby,Adel Elaraby ,Omar Yusuf,Mahmoud AbdelSabour,Mahmoud Roushdy,Amr Eladly,Eachawy,Maab Ashraf,Yasmeen AbdelSattar,National,Centre,for,Statistics,and,Information,-,"
        ></meta>
      </Head>

      {/* Breadcrumb */}
      <div className="_breadcrumb flex  ">
        <div className="container d-flex px-5 align-items-center justify-center ">
          <div className="d-flex  md:w-[30%]  ">
            <Image
              src="/assets/images/sdmx-logo.png"
              alt="SDMX Logo"
              width={120}
              height={30}
              className="object-contain hidden md:block"
            />
          </div>
          <div className="d-flex w-full md:w-[70%]">
            {/* Title */}
            <p className="_breadcrumb-header  !text-[22px] md:!text-[26px] ">
              {t("National_Summary_Data_Page_(NSDP)_-Oman")}
            </p>
          </div>
        </div>

        {/* Logo */}
      </div>

      {/* Main Section */}
      <div className="flex flex-col min-h-screen bg-[#e5e5e5]">
      <section className="flex-grow py-8 md:py-16 px-6 sm:px-10 md:px-20 lg:px-28 xl:px-32">
        {/* Description */}
        <p className="text-[#3a3a3a] text-[14px] md:text-[18px] leading-relaxed mb-16">
          {t("national_summary_data_title")}&nbsp;
          <span className="font-semibold">
            {t("please_visit_the")}{" "}
            <a
              href="https://dsbb.imf.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:!underline hover:text-[#3a3a3a] cursor-pointer text-[#3a3a3a]"
            >
              {t("dsbb_home_page")}
            </a>
            .
          </span>
        </p>

        {/* Main Header */}
        <div className="bg-[#00a895] flex items-center justify-center py-2 mb-3">
          <h2 className="text-white text-[18px] font-semibold text-center">
            {t("Macroeconomic_and_Financial_Data")}
          </h2>
        </div>

        {/* Section 1 */}
        {renderTable(leftData, rightData)}

        {/* Section 2 - Encouraged Data */}
        <div className="bg-[#00a895] flex items-center justify-center py-2 mb-3">
          <h2 className="text-white text-[18px] font-semibold text-center">
            {t("Macroeconomic_and_Financial_Data_Encouraged_Data")}
          </h2>
        </div>
        {renderTable(encouragedLeft, encouragedRight)}

        {/* Section 3 - Demographic and Socio-Economic Indicators */}
        <div className="bg-[#00a895] flex items-center justify-center py-2 mb-3">
          <h2 className="text-white text-[18px] font-semibold text-center">
            {t("Demographic_and_Selected_Socio-Economic_Indicators")}
          </h2>
        </div>
        {renderTable(demoLeft, demoRight)}

        {/* Section 4 - Additional Datasets */}
        <div className="bg-[#00a895] flex items-center justify-center py-2 mb-3">
          <h2 className="text-white text-[18px] font-semibold text-center">
            {t("Additional_Datasets")}
          </h2>
        </div>
        {renderTable(additionalLeft, additionalRight)}


      </section>
      

<div className="flex justify-center py-0 bg-[#e5e5e5]">
  <p
    className="text-[#f58220] font-extrabold text-lg md:text-[16px] no-underline transition-all duration-200 rounded-full px-6 py-2 text-center"
    style={{ fontFamily: '"Janna LT", DroidKufiRegular' }}
  >
    {t("For_more_Country_data_and_information,_please_go")}{" "}
    <a
      href="https://dsbb.imf.org/egdds/country/OMN/category" 
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#663399] hover:!underline hover:text-[#6d6e71]"
    >
      {t("here")}
    </a>
  </p>
</div>

</div>
        

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

export default NationalStatistics;
