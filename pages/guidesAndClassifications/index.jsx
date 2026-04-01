import { useState, useEffect, useRef } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Head from "next/head";

import GuidesAndClassificationList from "./GuidesAndClassificationList";
import GuidesAndClassificationCard from "./GuidesAndClassificationCard";
import GuidesAndClassificationTable from "./GuidesAndClassificationTable";
import MostViewedGuideSlider from "./MostViewedGuideSlider";

import { getGlossary } from "../../services/glossaryService";
import { getMethodologies } from "../../services/methodologyService";
import { getGuidesClassifications, getMostViewedGuides } from "@/services/guideclassificationsService";

const GuidesAndClassifications = ({
  glossaryDataSSR = [],
  totalGlossarySSR = 0,
  methodologyDataSSR = [],
  totalMethodologiesSSR = 0,
  guidesClassificationDataSSR = [],
  totalGuidesClassificationsSSR = 0,
  mostViewed = [],
  initialSection = "methodologies",
}) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { section: sectionQuery } = router.query;

  const [selectedSection, setSelectedSection] = useState(sectionQuery || initialSection);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchString, setSearchString] = useState("");
  const [loading, setLoading] = useState(false);

  const [glossaryData, setGlossaryData] = useState(glossaryDataSSR);
  const [totalGlossary, setTotalGlossary] = useState(totalGlossarySSR);

  const [methodologyData, setMethodologyData] = useState(methodologyDataSSR);
  const [totalMethodologies, setTotalMethodologies] = useState(totalMethodologiesSSR);

  const [guidesClassificationData, setGuidesClassificationData] = useState(guidesClassificationDataSSR);
  const [totalGuidesClassifications, setTotalGuidesClassifications] = useState(totalGuidesClassificationsSSR);

  const itemsPerPage = 10;
  const debounceTimer = useRef(null);
  const isFirstRender = useRef(true);
  const isSectionChange = useRef(false);



  // Sync section when user refreshes
  useEffect(() => {
    const sectionFromUrl = router.query.section || "methodologies";
    setSelectedSection(sectionFromUrl);
  }, [router.query.section]);




  // Calculate total pages based on section
  const totalPages =
    selectedSection === "glossary"
      ? Math.ceil(totalGlossary / itemsPerPage)
      : selectedSection === "methodologies"
        ? Math.ceil(totalMethodologies / itemsPerPage)
        : Math.ceil(totalGuidesClassifications / itemsPerPage);

  // Page change handler
  const handlePageChange = async (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setLoading(true);

    let res;
    if (selectedSection === "glossary") {
      res = await getGlossary(page, itemsPerPage, searchString);
      setGlossaryData(res.statistics);
      setTotalGlossary(res.total);
    } else if (selectedSection === "methodologies") {
      res = await getMethodologies(page, itemsPerPage, searchString);
      setMethodologyData(res.methodologies);
      setTotalMethodologies(res.total);
    } else {
      res = await getGuidesClassifications(page, itemsPerPage, searchString);
      setGuidesClassificationData(res.classifications);
      setTotalGuidesClassifications(res.total);
    }

    setLoading(false);
  };

  // Search handler
  const handleSearch = async () => {
    setLoading(true);


    let res;
    if (selectedSection === "glossary") {
      res = await getGlossary(1, itemsPerPage, searchString);
      setGlossaryData(res.statistics);
      setTotalGlossary(res.total);
    } else if (selectedSection === "methodologies") {
      res = await getMethodologies(1, itemsPerPage, searchString);
      setMethodologyData(res.methodologies);
      setTotalMethodologies(res.total);
    } else {
      res = await getGuidesClassifications(1, itemsPerPage, searchString);
      setGuidesClassificationData(res.classifications);
      setTotalGuidesClassifications(res.total);
    }
    setCurrentPage(1);
    setLoading(false);
  };

  useEffect(() => {
    //  Do not override SSR data on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      if (!isSectionChange.current) {
        setLoading(true);
      }

      let res;

      if (selectedSection === "glossary") {
        res = await getGlossary(1, itemsPerPage, searchString);
        setGlossaryData(res.statistics);
        setTotalGlossary(res.total);
      } else if (selectedSection === "methodologies") {
        res = await getMethodologies(1, itemsPerPage, searchString);
        setMethodologyData(res.methodologies);
        setTotalMethodologies(res.total);
      } else {
        res = await getGuidesClassifications(1, itemsPerPage, searchString);
        setGuidesClassificationData(res.classifications);
        setTotalGuidesClassifications(res.total);
      }

      setCurrentPage(1);
      setLoading(false);
      isSectionChange.current = false;
    }, 500);

    return () => clearTimeout(debounceTimer.current);
  }, [searchString, selectedSection]);






  return (
    <>
      <Head>
        <title>Home - NCSI PORTAL</title>
        <meta id="ctl00_ctl00_SEO_description" name="description" content={t('meta_des_publications')}></meta>
        <meta id="ctl00_ctl00_SEO_keyWords" name="keywords" content="NCSI,NCSI Oman,Oman Statistics,Oman Indicators الإحصاء , المركز الوطنى للإحصاء والمعلومات , عمان, مؤشرات,Heba Elaraby,Adel Elaraby ,Omar Yusuf,Mahmoud AbdelSabour,Mahmoud Roushdy,Amr Eladly,Eachawy,Maab Ashraf,Yasmeen AbdelSattar,National,Centre,for,Statistics,and,Information,-,"></meta>
      </Head>

      <section className="contact-section">
        <div className="_breadcrumb">
          <p className="_breadcrumb-header">{t("Guides_and_Methodologies")}</p>
        </div>

        <div className="row publication-body">
          {/* Sidebar Left: Navigation List */}
          <div className="col-lg-3" style={{ marginTop: "40px" }}>
            <GuidesAndClassificationList
              selectedId={selectedSection}
              onSelect={(id) => {
                isSectionChange.current = true;
                setLoading(true);
                setSearchString("");
                setSelectedSection(id);
                setCurrentPage(1);

                router.push(
                  {
                    pathname: router.pathname,
                    query: { ...router.query, section: id || undefined, page: 1 },
                  },
                  undefined,
                  { shallow: true }
                );
              }}
            />
          </div>

          {/* Main Content: Display area */}
          <div className="col-lg-6 d-flex flex-column min-h-[400px]  lg:min-h-[100vh]" style={{ marginTop: "40px" }}>
            {/* Content Section */}
            {loading ? (
              <div className="flex justify-center items-center  bg-[#f1f2f3]" style={{ minHeight: "200px" }}>
                <img className="loading_img" src="/assets/images/loader.gif" alt="Loading..." style={{ width: "100px" }} />
              </div>
            ) : selectedSection === "glossary" ? (
              glossaryData.length === 0 ? (
                <div className="no-data-message d-flex justify-content-center align-items-center w-100" style={{ minHeight: "200px" }}>
                  <p className="text-[15px]">{t("No Data Found")}</p>
                </div>
              ) : (
                <GuidesAndClassificationTable
                  data={glossaryData}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                />
              )
            ) : selectedSection === "methodologies" ? (
              methodologyData.length === 0 ? (
                <div className="no-data-message d-flex justify-content-center align-items-center w-100" style={{ minHeight: "200px" }}>
                  <p className="text-[15px]">{t("No Data Found")}</p>
                </div>
              ) : (
                <div className="card-container row " style={{ minHeight: "200px", position: "relative" }}>
                  {methodologyData.map((m, index) => (
                    <GuidesAndClassificationCard
                      key={index}
                      id={m.id}
                      title={router.locale === "ar" ? m.title_ar : m.title_en}
                      imageSrc={m.cover_image_url}
                      link={router.locale === "ar" ? m.pdf_file_url_ar : m.pdf_file_url}
                    />
                  ))}
                </div>
              )
            ) : selectedSection === "classifications" ? (
              guidesClassificationData.length === 0 ? (
                <div className="no-data-message d-flex justify-content-center align-items-center w-100" style={{ minHeight: "340px" }}>
                  <p className="text-[15px]">{t("No Data Found")}</p>
                </div>
              ) : (
                <div className="card-container row " style={{ minHeight: "200px", position: "relative" }}>
                  {guidesClassificationData.map((g, index) => (
                    <GuidesAndClassificationCard
                      key={index}
                      id={g.id}
                      title={router.locale === "ar" ? g.title_ar : g.title_en}
                      imageSrc={g.cover_image_url}
                      link={router.locale === "ar" ? g.pdf_file_url_ar : g.pdf_file_url}
                    />
                  ))}
                </div>
              )
            ) : null}

            {/* Pagination */}
            <div id="pagination" className="pagination d-flex justify-content-center flex-wrap mt-4">
              {currentPage > 1 && (
                <button className="page-button" onClick={() => handlePageChange(currentPage - 1)}>
                  <i className="fas fa-caret-left text-white"></i>
                </button>
              )}
              {(() => {
                const pages = [];
                const maxVisible = 5; // how many to show around current page

                if (totalPages <= 10) {
                  // few pages → show all
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  // many pages → compact mode
                  const startPage = Math.max(1, currentPage - 2);
                  const endPage = Math.min(totalPages, currentPage + 2);

                  if (startPage > 2) pages.push(1, "...");
                  else for (let i = 1; i < startPage; i++) pages.push(i);

                  for (let i = startPage; i <= endPage; i++) pages.push(i);

                  if (endPage < totalPages - 1) pages.push("...", totalPages);
                  else for (let i = endPage + 1; i <= totalPages; i++) pages.push(i);
                }

                return pages.map((page, index) =>
                  page === "..." ? (
                    <span key={`dots-${index}`} className="page-dots">...</span>
                  ) : (
                    <button
                      key={page}
                      className={`page-button ${page === currentPage ? "active" : ""}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                );
              })()}

              {currentPage < totalPages && (
                <button className="page-button" onClick={() => handlePageChange(currentPage + 1)}>
                  <i className="fas fa-caret-right text-white"></i>
                </button>
              )}
            </div>
          </div>

          {/* Sidebar Right: Search and Most Viewed */}
          <div className="col-12 flex justify-center align-center col-lg-3" style={{ marginTop: "40px" }}>
            <div className="row sidebarSlider">
              <div className="col-lg-12" style={{ width: "250px" }}>
                <div className="top-search-box">
                  <input
                    type="text"
                    id="searchBox"
                    value={searchString}
                    onChange={(e) => setSearchString(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    placeholder={t("search")}
                    className="topSearchInput"
                  />
                </div>
                <MostViewedGuideSlider mostViewed={mostViewed} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export async function getServerSideProps({ locale, query }) {
  const section = query.section || "methodologies";

  let glossaryResponse = { statistics: [], total: 0 };
  let methodologyResponse = { methodologies: [], total: 0 };
  let classificationsResponse = { classifications: [], total: 0 };
  let mostViewedResponse = [];

  try {
    const promises = [];
    if (section === "glossary") {
      promises.push(getGlossary(1, 8, ""));
    } else if (section === "methodologies") {
      promises.push(getMethodologies(1, 8, ""));
    } else if (section === "classifications") {
      promises.push(getGuidesClassifications(1, 8, ""));
    }
    promises.push(getMostViewedGuides());

    const results = await Promise.all(promises);

    if (section === "glossary") glossaryResponse = results[0];
    else if (section === "methodologies") methodologyResponse = results[0];
    else if (section === "classifications") classificationsResponse = results[0];

    mostViewedResponse = results[results.length - 1];
  } catch (err) {
    console.error("SSR Error fetching guides data:", err);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      glossaryDataSSR: glossaryResponse.statistics,
      totalGlossarySSR: glossaryResponse.total,
      methodologyDataSSR: methodologyResponse.methodologies,
      totalMethodologiesSSR: methodologyResponse.total,
      guidesClassificationDataSSR: classificationsResponse.classifications,
      totalGuidesClassificationsSSR: classificationsResponse.total,
      mostViewed: mostViewedResponse,
      initialSection: section,
    },
  };
}


export default GuidesAndClassifications;
