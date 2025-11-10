import Head from "next/head";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styles from "./hierarchy.module.css";

import PersonCard from "./PersonCard";

import AwardsCarousel from "./AwardsCarousel";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getHierarchyPage } from "@/services/hierarchyService";
import HoverCard from "@/components/cards/hoverCard";

const Hierarchy = ({ hierarchyData, achievements, achBaseUrl, orgMembers, orgBaseUrl }) => {
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const data = hierarchyData?.content?.items?.data || {};
 

  return (
    <>
      <Head>
        <title  key="title">{t("Hierarchy")}</title>
        <meta id="ctl00_ctl00_SEO_description" name="description" content={t('meta_des_publications')}></meta>
        <meta id="ctl00_ctl00_SEO_keyWords" name="keywords" content="NCSI,NCSI Oman,Oman Statistics,Oman Indicators الإحصاء , المركز الوطنى للإحصاء والمعلومات , عمان, مؤشرات,Heba Elaraby,Adel Elaraby ,Omar Yusuf,Mahmoud AbdelSabour,Mahmoud Roushdy,Amr Eladly,Eachawy,Maab Ashraf,Yasmeen AbdelSattar,National,Centre,for,Statistics,and,Information,-,"></meta>

      </Head>

      <section className="events-section px-0 md:px-12 lg:px-20">
        <div className="_breadcrumb">
          <p className="_breadcrumb-header">{t("Who_are_we")}</p>
        </div>

        <div className={`${styles["home-body-hierarchy"]}`}>
          <div className="max-w-[85rem] mx-auto bg-white shadow-md leading-relaxed py-7 px-3 md:px-16 content-width">

            {/* === CEO MESSAGE === */}

            <section className="text-[#333]">
              <h2 className="text-[16px] font-semibold text-[#003366] mb-2">
                {t("ceo_message")}
              </h2>

              {/* State to toggle expand/collapse */}
              {(() => {
                

                const message =
                  locale === "ar"
                    ? hierarchyData?.content?.items?.data?.ceo_message_ar?.trim()
                    : hierarchyData?.content?.items?.data?.ceo_message_en?.trim();

                // If no message, don't render
                if (!message) return null;

                return (
                  <>
                    {/* Text with 3-line clamp when collapsed */}
                    <p
                      className={`text-justify text-[14px] text-[#3a372a] text-sm/7 ${!isExpanded ? "line-clamp-3" : ""
                        }`}
                    >
                      {message}
                    </p>

                    {/* Toggle button */}
                    <div
                      className={`mt-3 ${locale === "ar" ? "text-left" : "text-right"}`}
                      dir={locale === "ar" ? "rtl" : "ltr"}
                    >
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
                      >
                        {isExpanded ? t("Read_less") : t("Read_more")}
                      </button>
                    </div>

                  </>
                );
              })()}

              <div className="bg-[#00a895] flex items-center justify-center mt-6 py-1 md:py-2">
                <h2 className="text-white text-base sm:text-lg md:text-lg font-semibold leading-tight text-center">
                  {t("Decrees_Laws_And_Decisions")}
                </h2>
              </div>
            </section>



            {/* === DECREES SECTION === */}
            <section className="bg-white py-10 md:py-6">
              <div className="w-[95%]">
                {/* === DECREES / LAWS / DECISIONS === */}
                {hierarchyData?.content?.items?.data?.decrees_laws_decisions?.length > 0 && (
                  <div
                    className={`${styles["decrees-container"]} grid grid-cols-1 md:grid-cols-2 gap-x-14`}
                  >
                    {/* Left Column */}
                    <div className="flex flex-col gap-2">
                      {hierarchyData.content.items.data.decrees_laws_decisions
                        .filter((_, i) => i % 2 === 0)
                        .map((item, index) => {
                          const title =
                            locale === "ar"
                              ? item.title_ar || item.title_en
                              : item.title_en || item.title_ar;
                          const pdf =
                            locale === "ar"
                              ? item.pdf_ar || item.pdf_en
                              : item.pdf_en || item.pdf_ar;
                          const pdfUrl = pdf
                            ? `${hierarchyData.content.base_url}/${pdf}`
                            : null;

                          return pdfUrl ? (
                            <a
                              key={index}
                              href={pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold block leading-snug tracking-normal hover:!underline transition-all duration-150"
                              style={{
                                fontSize: "16px",
                                lineHeight: "1.6",
                                color: "#6d6e71",
                              }}
                            >
                              {title}
                            </a>
                          ) : (
                            <p
                              key={index}
                              className="font-semibold text-[#333] leading-snug tracking-normal hover:!underline transition-all duration-150"
                              style={{ fontSize: "15px", lineHeight: "1.6" }}
                            >
                              {title}
                            </p>
                          );
                        })}
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-2">
                      {hierarchyData.content.items.data.decrees_laws_decisions
                        .filter((_, i) => i % 2 !== 0)
                        .map((item, index) => {
                          const title =
                            locale === "ar"
                              ? item.title_ar || item.title_en
                              : item.title_en || item.title_ar;
                          const pdf =
                            locale === "ar"
                              ? item.pdf_ar || item.pdf_en
                              : item.pdf_en || item.pdf_ar;
                          const pdfUrl = pdf
                            ? `${hierarchyData.content.base_url}/${pdf}`
                            : null;

                          return pdfUrl ? (
                            <a
                              key={index}
                              href={pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold block leading-snug tracking-normal hover:!underline transition-all duration-150"
                              style={{
                                fontSize: "16px",
                                lineHeight: "1.6",
                                color: "#6d6e71",
                              }}
                            >
                              {title}
                            </a>
                          ) : (
                            <p
                              key={index}
                              className="font-semibold text-[#333] leading-snug tracking-normal hover:!underline transition-all duration-150"
                              style={{ fontSize: "15px", lineHeight: "1.6" }}
                            >
                              {title}
                            </p>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>

              {/* === ROADMAP SECTION === */}
              <div className="bg-[#00a895] flex items-center justify-center mt-6 py-1 md:py-2">
                <h2 className="text-white text-base sm:text-lg md:text-lg font-semibold leading-tight text-center">
                  {t("Roadmap")}
                </h2>
              </div>
<div
  className={`grid gap-6 py-8 ${
    locale === "ar"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" // 3 per row for Arabic
      : "grid-cols-1 md:grid-cols-2" // 2 per row for English
  }`}
  dir={locale === "ar" ? "rtl" : "ltr"}
  // style={{
  //   fontFamily: locale === "ar"
  //     ? '"Janna LT", DroidKufiRegular'
  //     : '"Gill Sans MT", Arial, sans-serif',
  // }}
>
  {locale === "ar" ? (
    <>
      {/* === Row 1 === */}
      <HoverCard
        title="رؤيتنا"
        color="#FF851B"
        description={data.vision_ar}
      />

      <HoverCard
        title="مهمتنا"
        color="#FF851B"
        description={data.mission_ar}
      />

      <HoverCard
        title="السياسة العامة للمركز الوطني للإحصاء والمعلومات"
        color="#FF851B"
        description={data.arabic_2}
      />

      {/* === Row 2 === */}
      <HoverCard
        title="سياسة الجودة"
        color="#FF851B"
        description={data.arabic_1}
      />

      <HoverCard
        title="الأهداف الإستراتيجية للمركز الوطني للإحصاء والمعلومات"
        color="#FF851B"
        description={data.goals_ar}
      />

      <HoverCard
        title="قيمنا"
        color="#FF851B"
        description={data.values_ar}
      />
    </>
  ) : (
    <>
      <HoverCard
        title="Our Vision"
        color="#FF851B"
        description={data.vision_en}
      />

      <HoverCard
        title="Our Mission"
        color="#FF851B"
        description={data.mission_en}
      />

      <HoverCard
        title="The Strategic Goals of NCSI"
        color="#FF851B"
        description={data.goals_en}
      />

      <HoverCard
        title="Our Values"
        color="#FF851B"
        description={data.values_en}
      />
    </>
  )}
</div>

              {/* === ORGANIZATION CHART === */}
              <div className="bg-[#00a895] flex items-center justify-center mt-6 py-1 md:py-2"> <h2 className="text-white text-base sm:text-lg md:text-lg font-semibold leading-tight text-center"> {t("Organization_Chart")} </h2> </div>
              {orgMembers?.length > 0 && (
                <section className="bg-[#f4f4f4] py-10">
                  <div className="flex flex-col items-center space-y-12">
                    {/* Chief Executive */}
                    {(() => {
                      const chief = orgMembers[0];
                      const imgUrl = chief.photo ? `${orgBaseUrl}/${chief.photo}` : null;
                      return (
                        <PersonCard
                          key={chief.id}
                          image={imgUrl}
                          title={locale === "ar" ? chief.designation_ar : chief.designation_en}
                          hoverTitle={locale === "ar" ? chief.title_ar : chief.title_en}
                        />
                      );
                    })()}

                    {/* Directors — 3 per row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 justify-items-center max-w-[85rem]">
                      {orgMembers.slice(1).map((member) => {
                        const imgUrl = member.photo ? `${orgBaseUrl}/${member.photo}` : null;
                        return (
                          <PersonCard
                            key={member.id}
                            image={imgUrl}
                            title={locale === "ar" ? member.designation_ar : member.designation_en}
                            hoverTitle={locale === "ar" ? member.title_ar : member.title_en}
                          />
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}

              {/* === ACHIEVEMENTS === */}
              {achievements?.length > 0 && (
                <>
                  <div className="bg-[#00a895] flex items-center justify-center mt-6 py-1 md:py-2">
                    <h2 className="text-white text-base sm:text-lg md:text-lg font-semibold leading-tight text-center">
                      {t("Achievements")}
                    </h2>
                  </div>

                  <div className="w-full mt-4 sm:mt-6 md:mt-8 lg:mt-10 px-2 sm:px-0">
                    <AwardsCarousel achievements={achievements} baseUrl={achBaseUrl} />
                  </div>
                </>
              )}
            </section>

          </div>
        </div>
      </section>
    </>
  );
};

export async function getServerSideProps({ locale }) {
  const hierarchyData = await getHierarchyPage();
  console.log("hierarchyData:", hierarchyData);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      hierarchyData,
      achievements: hierarchyData?.achievements || [],
      achBaseUrl: hierarchyData?.baseUrls?.achievements || "",
      orgMembers: hierarchyData?.orgMembers || [],
      orgBaseUrl: hierarchyData?.baseUrls?.org || "",
    },
  };
}

export default Hierarchy;

