import { useState } from "react";
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
}) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [selectedSection, setSelectedSection] = useState("methodologies");
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

  //  Pagination logic
  const totalPages =
    selectedSection === "glossary"
      ? Math.ceil(totalGlossary / itemsPerPage)
      : selectedSection === "methodologies"
      ? Math.ceil(totalMethodologies / itemsPerPage)
      : Math.ceil(totalGuidesClassifications / itemsPerPage);

  // 🔁 Handle page change
  const handlePageChange = async (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setLoading(true);

      if (selectedSection === "glossary") {
        const { statistics, total } = await getGlossary(page, itemsPerPage, searchString);
        setGlossaryData(statistics);
        setTotalGlossary(total);
      } else if (selectedSection === "methodologies") {
        const { methodologies, total } = await getMethodologies(page, itemsPerPage, searchString);
        setMethodologyData(methodologies);
        setTotalMethodologies(total);
      } else if (selectedSection === "classifications") {
        const { classifications, total } = await getGuidesClassifications(page, itemsPerPage, searchString);
        setGuidesClassificationData(classifications);
        setTotalGuidesClassifications(total);
      }

      setLoading(false);
    }
  };

  // 🔍 Handle search
  const handleSearch = async () => {
    setLoading(true);
    if (selectedSection === "glossary") {
      const { statistics, total } = await getGlossary(1, itemsPerPage, searchString);
      setGlossaryData(statistics);
      setTotalGlossary(total);
    } else if (selectedSection === "methodologies") {
      const { methodologies, total } = await getMethodologies(1, itemsPerPage, searchString);
      setMethodologyData(methodologies);
      setTotalMethodologies(total);
    } else if (selectedSection === "classifications") {
      const { classifications, total } = await getGuidesClassifications(1, itemsPerPage, searchString);
      setGuidesClassificationData(classifications);
      setTotalGuidesClassifications(total);
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
          <div className="col-lg-2" style={{ marginTop: "13px" }}>
            <GuidesAndClassificationList
              selectedId={selectedSection}
              onSelect={(id) => {
                setSelectedSection(id);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Main Content */}
          <div className="col-lg-10 d-flex flex-column">
            {/* Search Bar */}
            <div
              className="d-flex justify-content-end mb-0 d-none d-sm-flex"
              style={{ marginTop: "10px", marginRight: "10px" }}
            >
              <div className="top-search-box" style={{ width: "240px" }}>
                <input
                  type="text"
                  id="searchBox"
                  value={searchString}
                  onChange={async (e) => {
                    const value = e.target.value;
                    setSearchString(value);

                    if (value.trim() === "") {
                      setLoading(true);
                      if (selectedSection === "glossary") {
                        const { statistics, total } = await getGlossary(1, itemsPerPage, "");
                        setGlossaryData(statistics);
                        setTotalGlossary(total);
                      } else if (selectedSection === "methodologies") {
                        const { methodologies, total } = await getMethodologies(1, itemsPerPage, "");
                        setMethodologyData(methodologies);
                        setTotalMethodologies(total);
                      } else if (selectedSection === "classifications") {
                        const { classifications, total } = await getGuidesClassifications(1, itemsPerPage, "");
                        setGuidesClassificationData(classifications);
                        setTotalGuidesClassifications(total);
                      }
                      setCurrentPage(1);
                      setLoading(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder={t("search")}
                  className="topSearchInput"
                />
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div
                id="loading"
                className="flex justify-center items-center bg-[#f1f2f3]"
                style={{ minHeight: "200px" }}
              >
                <img
                  className="loading_img"
                  src="/assets/images/loader.gif"
                  alt="Loading..."
                  style={{ width: "100px" }}
                />
              </div>
            ) : selectedSection === "glossary" ? (
              <GuidesAndClassificationTable data={glossaryData} />
            ) : selectedSection === "methodologies" ? (
              <div
                className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 justify-content-center"
                style={{ minHeight: "340px" }}
              >
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
            ) : selectedSection === "classifications" ? (
              <div
                className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 justify-content-center"
                style={{ minHeight: "340px" }}
              >
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
            ) : null}

            {/* Pagination */}
            <div
              id="pagination"
              className="pagination d-flex justify-content-center flex-wrap mt-4"
            >
              {currentPage > 1 && (
                <button
                  className="page-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
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
                <button
                  className="page-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
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

export async function getServerSideProps({ locale }) {
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
      },
    };
  }
}

export default GuidesAndClassifications;
