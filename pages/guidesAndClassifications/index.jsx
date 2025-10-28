import { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Head from "next/head";

import GuidesAndClassificationList from "./GuidesAndClassificationList";
import GuidesAndClassificationCard from "./GuidesAndClassificationCard";
import GuidesAndClassificationTable from "./GuidesAndClassificationTable";

const GuidesAndClassifications = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [selectedSection, setSelectedSection] = useState("methodologies");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchString, setSearchString] = useState("");
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;

  // Dummy data
  const dummyCards = Array(16)
    .fill({
      title: "Statistical Methodology Overview",
      imageSrc: "/assets/images/1.jpg",
      link: "#",
    })
    .map((card, i) => ({ ...card, title: `${card.title} ${i + 1}` }));

  const glossaryData = Array(25)
    .fill({
      id: 2234456,
      indicator_en: "Quantity of Propylene Produced",
      indicator_ar: "الكمية المنتجة من البروبيلين",
      description_en: "Quantity produced from propylene, which is a compound",
      description_ar: "الكمية المنتجة من البروبيلين والذي هو عبارة عن مركب يحمل",
    })
    .map((item, i) => ({ ...item, id: item.id + i }));

  // Pagination logic
  const totalData =
    selectedSection === "glossary" ? glossaryData : dummyCards;
  const totalPages = Math.ceil(totalData.length / itemsPerPage);
  const paginatedData = totalData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearch = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentPage(1);
    }, 500);
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
          {/* Sidebar List */}
          <div className="col-lg-3" style={{ marginTop: "13px" }}>
            <GuidesAndClassificationList
              selectedId={selectedSection}
              onSelect={(id) => {
                setSelectedSection(id);
                setCurrentPage(1); // reset page on section change
              }}
            />
          </div>

          {/* Dynamic Main Content */}
          <div className="col-lg-9 d-flex flex-column">
            {/* 🔍 Search Bar */}
            <div
              className="d-flex justify-content-end mb-3"
              style={{ marginTop: "10px", marginRight: "10px" }}
            >
              <div className="top-search-box" style={{ width: "250px" }}>
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
              <GuidesAndClassificationTable data={paginatedData} />
            ) : (
              <div className="row g-4">
                {paginatedData.map((card, index) => (
                  <div key={index} className="col-12 col-sm-6 col-lg-3 d-flex">
                    <GuidesAndClassificationCard {...card} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Section */}
            <div
              id="pagination"
              className="pagination d-flex justify-content-center flex-wrap mt-4"
            >
              {currentPage > 1 && (
                <button
                  className="page-button"
                  onClick={() => handlePageChange(1)}
                >
                  <i className="fas fa-step-backward text-white"></i>
                </button>
              )}

              {currentPage > 1 && (
                <button
                  className="page-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <i className="fas fa-caret-left text-white"></i>
                </button>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(0, currentPage - 2),
                  Math.min(totalPages, currentPage + 1)
                )
                .map((page) => (
                  <button
                    key={page}
                    className={`page-button ${
                      page === currentPage ? "active" : ""
                    }`}
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

              {currentPage < totalPages && (
                <button
                  className="page-button"
                  onClick={() => handlePageChange(totalPages)}
                >
                  <i className="fas fa-step-forward text-white"></i>
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
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default GuidesAndClassifications;
