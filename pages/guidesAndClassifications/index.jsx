import { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Head from "next/head";

import GuidesAndClassificationList from "./GuidesAndClassificationList";
import GuidesAndClassificationCard from "./GuidesAndClassificationCard";
import GuidesAndClassificationTable from "./GuidesAndClassificationTable";

import { getGlossary } from "../../services/glossaryService";
import { getMethodologies } from "../../services/methodologyService";
import { getGuidesClassifications } from "@/services/guideclassificationsService";

const GuidesAndClassifications = ({
  glossaryDataSSR = [],
  totalGlossarySSR = 0,
  methodologyDataSSR = [],
  totalMethodologiesSSR = 0,
  guidesClassificationDataSSR = [],
  totalGuidesClassificationsSSR = 0,
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

  const itemsPerPage = 8;

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

  return (
    <>
      <Head>
        <title>Guides & Classifications - NCSI Portal</title>
      </Head>

      <section className="contact-section">
        <div className="_breadcrumb">
          <p className="_breadcrumb-header">{t("Guides And Classifications")}</p>
        </div>

        <div className="row publication-body">
          {/* Sidebar */}
          <div className="col-lg-2" style={{ marginTop: "40px" }}>
            <GuidesAndClassificationList
              selectedId={selectedSection}
              onSelect={(id) => {
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

          {/* Main Content */}
          <div className="col-lg-10 d-flex flex-column">
            {/* Search Bar */}
            <div
              className="d-flex justify-content-end mb-0 d-none d-sm-flex"
              style={{ marginTop: "0px", marginRight: "10px" }}
            >
              <div className="top-search-box" style={{ width: "240px" }}>
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
            </div>

            {/* Content Section */}
            {loading ? (
              <div className="flex justify-center items-center bg-[#f1f2f3]" style={{ minHeight: "200px" }}>
                <img className="loading_img" src="/assets/images/loader.gif" alt="Loading..." style={{ width: "100px" }} />
              </div>
            ) : selectedSection === "glossary" ? (
              glossaryData.length === 0 ? (
                <div className="no-data-message d-flex justify-content-center align-items-center w-100" style={{ minHeight: "200px" }}>
                  <p className="text-[15px]">{t("No Data Found")}</p>
                </div>
              ) : (
                <GuidesAndClassificationTable data={glossaryData} />
              )
            ) : selectedSection === "methodologies" ? (
              methodologyData.length === 0 ? (
                <div className="no-data-message d-flex justify-content-center align-items-center w-100" style={{ minHeight: "200px" }}>
                  <p className="text-[15px]">{t("No Data Found")}</p>
                </div>
              ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 justify-content-start" style={{ minHeight: "340px" }}>
                  {methodologyData.map((m, index) => (
                    <div key={index} className="col d-flex justify-content-center">
                      <GuidesAndClassificationCard
                        id={m.id}
                        title={router.locale === "ar" ? m.title_ar : m.title_en}
                        imageSrc={m.cover_image_url}
                        link={router.locale === "ar" ? m.pdf_file_url_ar : m.pdf_file_url}
                      />
                    </div>
                  ))}
                </div>
              )
            ) : selectedSection === "classifications" ? (
              guidesClassificationData.length === 0 ? (
                <div className="no-data-message d-flex justify-content-center align-items-center w-100" style={{ minHeight: "200px" }}>
                  <p className="text-[15px]">{t("No Data Found")}</p>
                </div>
              ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 justify-content-start" style={{ minHeight: "340px" }}>
                  {guidesClassificationData.map((g, index) => (
                    <div key={index} className="col d-flex justify-content-center">
                      <GuidesAndClassificationCard
                        id={g.id}
                        title={router.locale === "ar" ? g.title_ar : g.title_en}
                        imageSrc={g.cover_image_url}
                        link={router.locale === "ar" ? g.pdf_file_url_ar : g.pdf_file_url}
                      />
                    </div>
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`page-button ${page === currentPage ? "active" : ""}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              {currentPage < totalPages && (
                <button className="page-button" onClick={() => handlePageChange(currentPage + 1)}>
                  <i className="fas fa-caret-right text-white"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export async function getServerSideProps({ locale, query }) {
  const section = query.section || "methodologies";

  try {
    const [glossaryResponse, methodologyResponse, classificationsResponse] = await Promise.all([
      getGlossary(1, 8, ""),
      getMethodologies(1, 8, ""),
      getGuidesClassifications(1, 8, ""),
    ]);

    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
        glossaryDataSSR: glossaryResponse.statistics || [],
        totalGlossarySSR: glossaryResponse.total || 0,
        methodologyDataSSR: methodologyResponse.methodologies || [],
        totalMethodologiesSSR: methodologyResponse.total || 0,
        guidesClassificationDataSSR: classificationsResponse.classifications || [],
        totalGuidesClassificationsSSR: classificationsResponse.total || 0,
        initialSection: section,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
        glossaryDataSSR: [],
        totalGlossarySSR: 0,
        methodologyDataSSR: [],
        totalMethodologiesSSR: 0,
        guidesClassificationDataSSR: [],
        totalGuidesClassificationsSSR: 0,
        initialSection: section,
      },
    };
  }
}

export default GuidesAndClassifications;
