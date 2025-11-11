import { useState, useEffect, useRef } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Head from "next/head";

import ClassificationList from "@/components/publications/ClassificationList";
import PublicationCard from "@/components/publications/PublicationCard";
import MostViewedSlider from "@/components/publications/MostViewedSlider";

import { getClassifications } from "@/services/classificationServices";
import { getPublications, getMostViewed } from "@/services/publicationService";
import { getBrowserSessionId } from "@/lib/sessionId";

const Publications = ({
  classifications,
  initialPublications,
  initialPage,
  itemsPerPage,
  mostViewed,
}) => {
  console.log(initialPublications,'-----------mostViewed')
  const hasMounted = useRef(false);
    const { t } = useTranslation("common");
  const router = useRouter();
  const isRTL = router.locale === "ar";

  const [publicationList, setPublicationList] = useState(
    initialPublications?.publications || []
  );
  const [totalCount, setTotalCount] = useState(initialPublications?.total || 0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [searchString, setSearchString] = useState("");
  // const [classificationId, setClassificationId] = useState("");
  const { classification: classificationQuery } = router.query;
  const [classificationId, setClassificationId] = useState(classificationQuery || '');
  const [type, setType] = useState("");
  const [sortOrder, setSortOrder] = useState({
    field: "created_at",
    direction: "desc",
  });

  const [sessionId, setSessionId] = useState(null);

  const debounceTimer = useRef(null);

  useEffect(() => {
    const id = getBrowserSessionId();
    setSessionId(id);
  }, []);

  const page = parseInt(router?.query?.page ?? initialPage, 10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const payload = {
          currentpage: page,
          pagesize: itemsPerPage,
          searchstring: searchString, // keep current search
          sortorder: sortOrder,
          is_frontend:true,
          filter: {
            type,
            classification_id: classificationId,
            status:1
          },
        };

        const res = await getPublications(payload);

        setPublicationList(res?.publications || []);
        setTotalCount(res?.total || 0);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching publications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    router.query.page,
    itemsPerPage,
    classificationId,
    type,
    sortOrder, // Removed `searchString`
  ]);

  // ✅ Debounced search effect
useEffect(() => {
  // clear any existing timer
  if (debounceTimer.current) clearTimeout(debounceTimer.current);

  // when search box is empty → reset to default list
  if (searchString.trim() === "") {
    const fetchDefault = async () => {
      setLoading(true);
      try {
        const payload = {
          currentpage: 1,
          pagesize: itemsPerPage,
          searchstring: "",
          sortorder: sortOrder,
          is_frontend: true,
          filter: {
            type,
            classification_id: classificationId,
            status: 1,
          },
        };
        const res = await getPublications(payload);
        setPublicationList(res?.publications || []);
        setTotalCount(res?.total || 0);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching default publications:", err);
      } finally {
        setLoading(false);
      }
    };
    debounceTimer.current = setTimeout(fetchDefault, 300);
    return;
  }

  // debounce search (500ms delay)
  debounceTimer.current = setTimeout(() => {
    handleSearch();
  }, 500);

  // cleanup old timer
  return () => clearTimeout(debounceTimer.current);
}, [searchString]);


  const handleSearch = async () => {
  // Optional: reset URL to ?page=1 to be accurate
  if (router.query.page !== '1') {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page: 1 },
      },
      undefined,
      { shallow: true }
    );
  }
  setCurrentPage(1);
  setLoading(true);
  try {
    const payload = {
      currentpage: 1,
      pagesize: itemsPerPage,
      searchstring: searchString,
      sortorder: sortOrder,
      is_frontend:true,
      filter: {
        type,
        classification_id: classificationId,
        status:1
      },
    };
     
    const res = await getPublications(payload);

    setPublicationList(res?.publications || []);
    setTotalCount(res?.total || 0);
  } catch (error) {
    console.error("Search error:", error);
  } finally {
    setLoading(false);
  }
};

  const handlePageChange = (page) => {
    if (page === currentPage) return;
    // setLoading(true);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page },
      },
      undefined,
      { shallow: true }
    ); // shallow prevents full page reload
  };

  // const handleClassificationSelect = (id) => {
  //   setClassificationId(id); // Update the filter state
  //   router.push(
  //     {
  //       pathname: router.pathname,
  //       query: { ...router.query, page: 1 }, // Reset to page 1 when filter changes
  //     },
  //     undefined,
  //     { shallow: true }
  //   );
  // };


  const handleClassificationSelect = (id) => {
    setClassificationId(id); // Update local state

    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page: 1, // Reset to first page
          classification: id || undefined, 
        },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    const classificationFromUrl = router.query.classification || '';
    setClassificationId(classificationFromUrl);
  }, [router.query.classification]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <>
    <Head>
      <title>Home - NCSI PORTAL</title>
      <meta id="ctl00_ctl00_SEO_description" name="description" content={t('meta_des_publications')}></meta>
      <meta id="ctl00_ctl00_SEO_keyWords" name="keywords" content="NCSI,NCSI Oman,Oman Statistics,Oman Indicators الإحصاء , المركز الوطنى للإحصاء والمعلومات , عمان, مؤشرات,Heba Elaraby,Adel Elaraby ,Omar Yusuf,Mahmoud AbdelSabour,Mahmoud Roushdy,Amr Eladly,Eachawy,Maab Ashraf,Yasmeen AbdelSattar,National,Centre,for,Statistics,and,Information,-,"></meta>
    </Head>
    <section className="contact-section">
      <div className="_breadcrumb">
        <p className="_breadcrumb-header">{t("publications")}</p>
      </div>

      <div className="row publication-body">
        <div className="col-lg-3" style={{ marginTop: "13px" }}>
          <ClassificationList
            classifications={classifications.classifications || []}
            isRTL={isRTL}
            onSelect={handleClassificationSelect}
            selectedId={classificationId}
          />
        </div>

        <div className="col-lg-6 d-flex flex-column">
          <div
            id="cardContainer"
            className="card-container row flex-grow-1"
            style={{ minHeight: "200px", position: "relative" }}
          >
            {loading ? (
              <div
                id="loading"
                className="flex justify-center items-center bg-[#f1 f2f3]"
              >
                <img
                  className="loading_img"
                  src="/assets/images/loader.gif"
                  alt="Loading..."
                  style={{
                    width: "100px",
                  }}
                />
                
              </div>
            ) : publicationList.length === 0 ? (
              <div
                className="no-data-message d-flex justify-content-center align-items-center w-100"
                style={{ minHeight: "200px" }}
              >
                <p className="text-[15px]">{t("No Data Found")}</p>
              </div>
            ) : (
              publicationList?.map((pub) => (
               
                <PublicationCard
                  sessionId={sessionId}
                  avg_rating={pub.avg_rating}
                  key={pub.id}
                  id={pub.id}
                  title={isRTL ? pub.title_ar : pub.title_en}
                  imageSrc={pub.cover_image_url}
                  pdfUrl={isRTL ? pub.pdf_file_url_ar : pub.pdf_file_url}
                />
              ))
            )}
          </div>
          <br />

          <div
            id="pagination"
            className="pagination mt-auto d-flex justify-content-center flex-wrap"
          >
            {/* First Page - only show if not on page 1 */}
            {currentPage > 1 && (
              <button
                className="page-button"
                onClick={() => handlePageChange(1)}
              >
                <i
                  className="fas fa-step-backward"
                  style={{ color: "white" }}
                ></i>
              </button>
            )}

            {/* Previous - only show if not on page 1 */}
            {currentPage > 1 && (
              <button
                className="page-button"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <i className="fas fa-caret-left" style={{ color: "white" }}></i>
              </button>
            )}

            {/* Pages: currentPage - 1, currentPage, currentPage + 1 */}
            {currentPage > 2 && (
              <button
                className="page-button"
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
            )}

            {currentPage > 3 && <span className="page-ellipsis">...</span>}

            {currentPage > 1 && (
              <button
                className="page-button"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                {currentPage - 1}
              </button>
            )}

            <button className="page-button active">{currentPage}</button>

            {currentPage < totalPages && (
              <button
                className="page-button"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                {currentPage + 1}
              </button>
            )}

            {currentPage < totalPages - 2 && (
              <span className="page-ellipsis">...</span>
            )}

            {currentPage < totalPages - 1 && (
              <button
                className="page-button"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            )}

            {/* Next */}
            {currentPage < totalPages && (
              <button
                className="page-button"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <i
                  className="fas fa-caret-right"
                  style={{ color: "white" }}
                ></i>
              </button>
            )}

            {/* Last Page */}
            {currentPage < totalPages && (
              <button
                className="page-button"
                onClick={() => handlePageChange(totalPages)}
              >
                <i
                  className="fas fa-step-forward"
                  style={{ color: "white" }}
                ></i>
              </button>
            )}
          </div>

          <div
            className="publications-main-section"
            style={{ display: "none" }}
          ></div>
        </div>

        <div className="col-lg-3">
          <div className="row sidebarSlider">
            <div className="col-lg-12" style={{ width: "250px"}}>
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
              <MostViewedSlider mostViewed={mostViewed} />
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

// pages/publications/index.js or [locale]/publications.js

export async function getServerSideProps({ locale, query }) {
  const itemsPerPage = 6;
  const currentPage = parseInt(query.page || "1", 10);

  try {
    const [classifications, publications, mostViewed] = await Promise.all([
      getClassifications(),
      getPublications({ currentpage: currentPage, pagesize: itemsPerPage ,is_frontend:true}),
      getMostViewed(),
    ]);
    // console.log(currentPage, "current page----🟢");

    return {
      props: {
        initialPublications: publications,
        classifications,
        initialPage: currentPage,
        itemsPerPage,
        mostViewed,
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  } catch (error) {
    console.error("SSR error:", error);
    return {
      props: {
        initialPublications: { publications: [], total: 0 },
        classifications: [],
        initialPage: 1,
        itemsPerPage,
        mostViewed: [],
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  }
}

export default Publications;
