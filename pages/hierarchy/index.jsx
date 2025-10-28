import Head from "next/head";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styles from "./hierarchy.module.css";
import Image from "next/image";
import HoverCard from "@/components/cards/hoverCard";
import PersonCard from "./PersonCard";
import HoverTextCard from "./hoverTextCard";
import AwardsCarousel from "./AwardsCarousel";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getHierarchyPage } from "@/services/hierarchyService";

const Hierarchy = ({ hierarchyData,achievements, achBaseUrl, orgMembers, orgBaseUrl }) => {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  return (
    <>
      <Head>
        <title>{t("Hierarchy")}</title>
      </Head>

      <section className="events-section px-0 md:px-12 lg:px-20">
        <div className="_breadcrumb">
          <p className="_breadcrumb-header">{t("Who_are_we")}</p>
        </div>

        <div className={`${styles["home-body-hierarchy"]}`}>
          <div className="max-w-[85rem] mx-auto bg-white shadow-md leading-relaxed py-9 px-3 md:px-16 content-width">

            {/* === CEO MESSAGE === */}

<section className="text-[#333]">
  <h2 className="text-[16px] font-semibold text-[#003366] mb-2">
    CEO Message
  </h2>

  <p className="text-justify text-[14px] text-[#3a372a] text-sm/7">
    {locale === "ar"
      ? (hierarchyData?.content?.items?.data?.ceo_message_ar?.trim() || 
         "Based on the highly appreciated instructions of His Majesty, Sultan of the Country, may Allah protect him, directed to all governmental institutions to make haste in boosting their performance & facilitating their services by using digital technology in the course of elevating and promoting the Sultanate up to the modern, renewed horizons of knowledge.")
      : (hierarchyData?.content?.items?.data?.ceo_message_en?.trim() ||
         "Based on the highly appreciated instructions of His Majesty, Sultan of the Country, may Allah protect him, directed to all governmental institutions to make haste in boosting their performance & facilitating their services by using digital technology in the course of elevating and promoting the Sultanate up to the modern, renewed horizons of knowledge.")}
  </p>

  <div className="text-right mt-4">
    <a
      href="#"
      className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
    >
      Read more...
    </a>
  </div>

<div className="bg-[#00a895] flex items-center justify-center mt-6 py-2 md:py-3">
  <h2 className="text-white text-base sm:text-lg md:text-xl font-semibold leading-tight text-center">
    Decrees, Laws and Decisions
  </h2>
</div>

</section>


            {/* === DECREES SECTION === */}
            <section className="bg-white py-10 md:py-6">
<div className="w-full flex flex-col gap-8">
  {hierarchyData?.content?.items?.data?.decrees_laws_decisions &&
  hierarchyData.content.items.data.decrees_laws_decisions.length > 0 &&
  hierarchyData.content.items.data.decrees_laws_decisions.some(
    (item) => item.title_en || item.title_ar
  ) ? (
    // ✅ Dynamic API Data (same look, clickable titles)
    hierarchyData.content.items.data.decrees_laws_decisions.map(
      (item, index) => {
        const isEven = index % 2 === 0;
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

        return (
          <div
            key={index}
            className={`flex flex-col ${
              isEven ? "md:items-start" : "md:items-end"
            }`}
          >
            <div
              className={`max-w-[700px] p-4 rounded-md shadow-sm bg-[#f8f8f8] border border-gray-200 ${
                isEven ? "text-left" : "text-right"
              }`}
            >
              {pdfUrl ? (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gray-800 mb-2 leading-relaxed hover:text-[#0073e6] transition-colors duration-200 block"
                >
                  {title}
                </a>
              ) : (
                <p className="font-semibold text-gray-800 mb-2 leading-relaxed">
                  {title}
                </p>
              )}
            </div>
          </div>
        );
      }
    )
  ) : (
    // 🧱 Static Dummy Data Fallback (same design)
    <div
      className={`${styles["decrees-container"]} grid grid-cols-1 md:grid-cols-2 gap-x-14`}
    >
      <div>
        <p className="font-semibold">
          Royal Decree 104/2020 Amending Some Provisions of the Royal Decrees
          Establishing the National Centre for Statistics and Information and
          Promulgating its System
        </p>
        <p className="font-semibold">
          Royal Decree Promulgating the Statistics and Information Law
        </p>
        <p className="font-semibold">
          Royal Decree on Conducting the Electronic Census 2020
        </p>
        <p className="font-semibold">
          Royal Decree Amending Some Provisions of Royal Decree Establishing the
          Centre
        </p>
        <p className="font-semibold">
          The executive regulation of the Statistics and Information Law.
        </p>
        <p className="font-semibold">
          Data quality assurance framework for the National Centre for
          Statistics and Information
        </p>
      </div>
      <div>
        <p className="font-semibold">
          Royal Decree Amending the Provisions of the Electronic Census
          Procedure
        </p>
        <p className="font-semibold">
          Administrative and financial system for the electronic census project
          2020
        </p>
        <p className="font-semibold">
          Royal Decree Promulgating the System of the Centre
        </p>
        <p className="font-semibold">ISSUING THE NATIONAL DATA STRATEGY</p>
        <p className="font-semibold">
          General framework for information availability
        </p>
        <p className="font-semibold">Royal Decree establishing NCSI</p>
      </div>
    </div>
  )}
</div>



              {/* === ROADMAP SECTION === */}
<div className="bg-[#00a895] flex items-center justify-center mt-6 py-2 md:py-3">
  <h2 className="text-white text-base sm:text-lg md:text-xl font-semibold leading-tight text-center">
    Roadmap
  </h2>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
                <HoverCard title="Our Vision" color="#FF851B" description="Enhancing Knowledge" />
                <HoverCard
                  title="Our Mission"
                  color="#FF851B"
                  description="To satisfy the government’s need for official statistics and reliable information..."
                  linkText="Show More"
                  fullText={`To satisfy the government's need of official statistics and reliable information...`}
                />
                <HoverCard
                  title="The Strategic Goals of NCSI"
                  color="#FF851B"
                  description="Partnership — The NCSI is committed to building strong partnerships..."
                  linkText="Show More"
                  fullText={`To satisfy the government's need of official statistics and reliable information...`}
                />
                <HoverCard
                  title="Our Values"
                  color="#FF851B"
                  description="Professionalism, Transparency, Knowledge Management..."
                  linkText="Show More"
                  fullText={`To satisfy the government's need of official statistics and reliable information...`}
                />
              </div>

              {/* === ORGANIZATION CHART === */}
<div className="bg-[#00a895] flex items-center justify-center mt-6 py-2 md:py-3">
  <h2 className="text-white text-base sm:text-lg md:text-xl font-semibold leading-tight text-center">
    Organization Chart
  </h2>
</div>

              <section className="bg-[#f4f4f4] py-10">
                {orgMembers && orgMembers.length > 0 && (
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
                )}
              </section>

              {/* === ACHIEVEMENTS === */}
<div className="bg-[#00a895] flex items-center justify-center mt-6 py-2 md:py-3">
  <h2 className="text-white text-base sm:text-lg md:text-xl font-semibold leading-tight text-center">
    Achievements
  </h2>
</div>

             <div className="w-full mt-4 sm:mt-6 md:mt-8 lg:mt-10 px-2 sm:px-0">
  <AwardsCarousel achievements={achievements} baseUrl={achBaseUrl} />
</div>

            </section>
          </div>
        </div>
      </section>
    </>
  );
};

export async function getServerSideProps({ locale }) {
  const hierarchyData = await getHierarchyPage();

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
