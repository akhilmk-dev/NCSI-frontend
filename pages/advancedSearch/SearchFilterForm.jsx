import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { useTranslation } from "next-i18next";
import { getNcsiSearchResults } from "@/services/searchService";
import Image from "next/image";




const SearchFilterForm = ({ initialResults = [], initialQuery = "" }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { q } = router;
  const locale = router.locale;


  const sectionLabelMap = {
  methodologies: t("Guides_and_Classifications"),
  classifications: t("Guides_and_Classifications"),
  achievements: t("About_Us"),
  events: t("events"),
  publications: t("publications"),
  news: t("news")
};


  // ---------------- STATE ----------------
  const [formData, setFormData] = useState({
    search: initialQuery || "",
    modules: [],
  });

  const [results, setResults] = useState(initialResults);
  const [baseUrls, setBaseUrls] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedItems, setExpandedItems] = useState({});

  const debounceTimer = useRef(null);

  // ---------------- HANDLE QUERY FROM HEADER ----------------
  useEffect(() => {
    if (q) {
      setFormData((prev) => ({ ...prev, search: q }));
      setCurrentPage(1);
    }
  }, [q]);

  // ---------------- CORE FETCH FUNCTION ----------------
  const fetchResults = async ({ currentpage = 1, overrideModules = null } = {}) => {
    const searchTerm = formData.search.trim();

    if (searchTerm.length < 3) {
      setErrorMsg(t("Minimum_3_letters_required"));
      setResults([]);
      setTotalPages(1);
      setCurrentPage(1);
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      let modulesToUse;

      if (overrideModules !== null) {
        modulesToUse = overrideModules;
      } else if (formData.modules.includes("All") || formData.modules.length === 0) {
        modulesToUse = [];
      } else {
        modulesToUse = formData.modules.flatMap((m) =>
          m === "GuidesClassifications"
            ? ["methodologies", "classifications"]
            : [m.toLowerCase()]
        );
      }

      const sortParam = "date";

      const res = await getNcsiSearchResults({
        q: searchTerm,
        modules: modulesToUse,
        sort: sortParam,
        dir: sortDir,
        currentpage,
      });

      setResults(res.items || []);
      setBaseUrls(res.baseUrls || {});
      setCurrentPage(res.pagination.currentPage || currentpage);
      setTotalPages(res.pagination.totalPages || 1);
    } catch (err) {
      console.error("Search error:", err);
      setErrorMsg("Failed to fetch results");
      setResults([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DEBOUNCED SEARCH ----------------
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    const searchTerm = formData.search.trim();

    if (!searchTerm) {
      setResults([]);
      setErrorMsg("");
      setTotalPages(1);
      setCurrentPage(1);
      return;
    }

    if (formData.modules.length > 0) return;

    debounceTimer.current = setTimeout(() => {
      if (searchTerm.length >= 3) {
        fetchResults({ currentpage: 1, overrideModules: [] });
      } else {
        setErrorMsg(t("Minimum_3_letters_required"));
      }
    }, 600);

    return () => clearTimeout(debounceTimer.current);
  }, [formData.search]);

  // ---------------- SORTING EFFECT ----------------
  useEffect(() => {
    const searchTerm = formData.search.trim();
    if (searchTerm.length < 3) return;

    if (formData.modules.length === 0) {
      fetchResults({ currentpage: 1, overrideModules: [] });
    } else {
      fetchResults({ currentpage: 1 });
    }
  }, [sortDir]);

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchResults({ currentpage: 1 });
  };

  // ---------------- HANDLE PAGE CHANGE ----------------
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchResults({ currentpage: page });
  };

  // ---------------- INPUT CHANGE ----------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------- CLEAR SECTION FILTER ----------------
  const handleClearSelection = () => {
    setFormData((prev) => ({ ...prev, modules: [] }));
    const searchTerm = formData.search.trim();
    if (searchTerm.length >= 3) {
      setCurrentPage(1);
      fetchResults({ currentpage: 1, overrideModules: [] });
    }
  };

  // ---------------- DROPDOWN OPTIONS ----------------
  const sectionOptions = [
    "All",
    "Events",
    "Achievements",
    "GuidesClassifications",
    "Publications",
    "News",
  ];

  // ---------------- HELPER: BUILD PDF URL ----------------
  const buildPdfUrl = (module, rawFile) => {
    if (!rawFile) return null;

    if (/^https?:\/\//i.test(rawFile)) return rawFile;

    const key = module?.toLowerCase();
    const moduleBaseUrl = baseUrls?.[key];

    if (moduleBaseUrl) {
      return `${moduleBaseUrl}/${rawFile}`;
    }

    return rawFile;
  };

  // ---------------- RENDER ----------------
  return (
    <div className="bg-white w-full rounded-md p-6 sm:p-8 md:p-10">
      {/* ========== SEARCH FORM ========== */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#f9f9f9] rounded-md py-8 px-6 flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
          {/* Search Input */}
          <div className="grid grid-cols-12">
             <span className={`h-10 w-[3px] bg-[#e7d4bd] col-span-1 ${locale =="ar"?"col-span-1 md:col-span-3":"col-span-1"}`}></span>
            <label
              className={` h-10 flex items-center whitespace-nowrap ${locale === "ar" ? "col-span-3 md:col-span-1 pl-3" : "col-span-3 pl-2"
                }`}
              style={{
                color: "#000000",
                fontSize: "14px",
                // borderLeft: locale === "ar" ? "none" : "3px solid #e7d4bd",
                // borderRight: locale === "ar" ? "3px solid #e7d4bd" : "none",
                fontFamily: '"Gill Sans MT", Arial, sans-serif',
              }}
            >

              {t("search")}
            </label>

            <input
              type="text"
              name="search"
              value={formData.search}
              onChange={handleChange}
              placeholder={t("keyword_search")}
              style={{ borderBottom: "2px solid #97a4a7 !important" }}
              className={`border border-gray-700 ${locale === "ar" ? 'col-span-8 max-w-[280px] ' : 'col-span-8'}  rounded-sm px-3 text-[14px]  h-[40px] text-[#000] font-[500] focus:outline-none focus:ring-1 focus:ring-[#00A99D]`}
            />
           
          </div>

          {/* Sections Dropdown */}
          <div className="grid grid-cols-12">
           <span className={`h-10 w-[3px] bg-[#e7d4bd] ${locale =="ar"?"col-span-1 md:col-span-3":"col-span-1"}`}></span>
            <label
              className={` h-10 flex items-center whitespace-nowrap ${locale === "ar" ? "col-span-3 md:col-span-1 " : "col-span-3 pl-2"
                }`}
              style={{
                color: "#000000",
                fontSize: "14px",
                // borderLeft: locale === "ar" ? "none" : "3px solid #e7d4bd",
                // borderRight: locale === "ar" ? "3px solid #e7d4bd" : "none",
                fontFamily: '"Gill Sans MT", Arial, sans-serif',
              }}
            >

              {t("Sections")}
            </label>


            <MultiSelectDropdown
              options={sectionOptions}
              selected={formData.modules}
              locale={locale}
              onChange={(selected) => {
                let finalSelected = [...selected];

                // If All is selected → keep only All
                if (selected.includes("All")) {
                  finalSelected = ["All"];
                } else {
                  // Remove All when selecting anything else
                  finalSelected = finalSelected.filter((v) => v !== "All");
                }

                // FIX — no restriction: allow GuidesClassifications + any other items

                setFormData((prev) => ({
                  ...prev,
                  modules: finalSelected,
                }));
              }}
              showCaret
            />
          </div>
        </div>

        {errorMsg && <span className="text-red-500 text-sm px-3">{errorMsg}</span>}

        <div className="flex justify-end">
          <button type="submit" className="submitBtn">
            {t("search")}
          </button>
        </div>
      </form>

      {/* ========== SORTING SECTION ========== */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm  py-2">
        <button
          type="button"
          onClick={() => {
            setSortBy("date");
            setSortDir("desc");
          }}
          style={{ fontFamily: '"Gill Sans MT", Arial, sans-serif' }}
          className={`rounded-[4px] px-3 sm:px-4 py-1.5 shadow-sm text-[13px] flex items-center gap-1 ${sortBy === "date" && sortDir === "desc"
            ? "bg-[#009e99] text-white"
            : "text-[#f58220] hover:underline"
            }`}
        >
          {t("latest")} {sortBy === "date" && sortDir === "desc" && <span></span>}
        </button>

        <button
          type="button"
          onClick={() => {
            setSortBy("date");
            setSortDir("asc");
          }}
          style={{ fontFamily: '"Gill Sans MT", Arial, sans-serif' }}
          className={`rounded-[4px] px-3 sm:px-4 py-1.5 shadow-sm text-[13px] flex items-center gap-1 ${sortBy === "date" && sortDir === "asc"
            ? "bg-[#009e99] text-white"
            : "text-[#f58220] hover:underline"
            }`}
        >
          {t("oldest")} {sortBy === "date" && sortDir === "asc" && <span></span>}
        </button>
      </div>

      {/* ========== RESULTS SECTION ========== */}
      <div className="mt-6 min-h-[450px] md:min-h-[500px]">
        {loading && <p className="text-gray-600 text-sm px-3">{t("Loading")}...</p>}

        {!loading && results.length > 0 && (
          <>
            <div className="space-y-4">
              {results.map((item, index) => {
                const title =
                  locale === "ar"
                    ? item.title_ar || item.title_en
                    : item.title_en || item.title_ar;

                const body =
                  locale === "ar"
                    ? item.body_ar || item.body_en
                    : item.body_en || item.body_ar;

                const rawPdf =
                  locale === "ar"
                    ? item.pdf_ar || item.pdf
                    : item.pdf || item.pdf_ar;

                const pdfUrl = buildPdfUrl(item.module, rawPdf);

                const isExpanded = expandedItems[item.ref_id];

                return (
                  <div
                    key={`${item.module}-${item.ref_id}-${index}`}
                    className="result-card w-full  px-4 sm:px-6 py-0 mb-4 ListPage"
                    dir={locale === "ar" ? "rtl" : "ltr"}
                  >
                    <h5
                      onClick={() => {
                        if (pdfUrl && item.module !== "events") return;

                        let url = "";

                        if (item.module === "news") {
                          url = `/newsPage/newsDetail?id=${item.ref_id}`;
                        } else if (item.module === "events") {
                          url = `/event-details/${item.ref_id}`;
                        } else if (item.module === "achievements") {
                          return;
                        } else if (!pdfUrl) {
                          router.push(`/${item.module}/${item.ref_id}`);
                        }

                        if (url) window.open(url, "_blank");
                      }}
                      className={`text-[#009e99] text-[13px] sm:text-[13px] font-bold uppercase pl-0 leading-snug ${pdfUrl && item.module !== "events"
                        ? "cursor-default"
                        : "cursor-pointer hover:underline"
                        }`}
                      style={{
                        fontFamily: '"Gill Sans MT", Arial, sans-serif'
                      }}>
                      {title}
                    </h5>

                    <p
                      className={`text-gray-600 text-[12px] sm:text-[13px] mt-1 leading-snug text-justify ${isExpanded ? "" : "line-clamp-3"
                        } cursor-pointer`}
                      onClick={() =>
                        setExpandedItems((prev) => ({
                          ...prev,
                          [item.ref_id]: !prev[item.ref_id],
                        }))
                      }
                      dangerouslySetInnerHTML={{ __html: body || "" }}
                    />

                    {/* <div className="mt-2">
                      {pdfUrl && (
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center hover:text-[#b30000]"
                        >
                          <AiFillFilePdf size={22} color="#d32f2f" />
                        </a>
                      )}
                    </div> */}

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-3 text-[13px] sm:text-[14px]">

                      <div className="mt-2">
                        {pdfUrl && (
                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center hover:text-[#b30000]"
                          >
                            <Image
                              src="/assets/images/file-iconn.png"
                              alt="PDF Icon"
                              width={20}
                              height={24}
                              className="object-contain"
                            />
                          </a>
                        )}
                      </div>
                      {item.created_date && (
                        <div>
                          <span className="font-semibold text-[#ff9900] mr-1"
                            style={{
                              color: "#ff9900",
                              fontSize: "14px",
                              fontFamily: '"Gill Sans MT", Arial, sans-serif',
                            }}

                          >
                            {t("Date")}:
                          </span>
                          <span className="text-gray-700"
                            style={{
                              color: "#6D6E71",
                              fontSize: "14px",
                              fontFamily: '"Gill Sans MT", Arial, sans-serif',
                            }}>
                            {item.created_date?.split(" ")[0]}
                          </span>
                        </div>
                      )}

                      <div>
                        <span className="font-semibold text-[#f58220] mr-1"
                          style={{
                            color: "#ff9900",
                            fontSize: "14px",
                            fontFamily: '"Gill Sans MT", Arial, sans-serif',
                          }}>
                          {t("Sections")}:
                        </span>
                        <span className="text-gray-700 capitalize
                        "          style={{
                            color: "#6D6E71",
                            fontSize: "14px",
                            fontFamily: '"Gill Sans MT", Arial, sans-serif',
                          }}>
                          {sectionLabelMap[item.module?.toLowerCase()] || t(item.module)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center flex-wrap gap-1 mt-4">
              <button
                className={`pagination-btn-first px-2 py-2 text-[10px] rounded-sm ${currentPage === 1
                  ? "bg-[#b4e1f4] !text-white"
                  : "bg-[#0099cc] text-white hover:opacity-90"
                  }`}
                onClick={() => currentPage !== 1 && handlePageChange(1)}
                disabled={currentPage === 1}
              >
                {t("FIRST")}
              </button>

              <button
                className={`pagination-btn-first px-2 py-2 text-[10px] rounded-sm ${currentPage === 1
                  ? "bg-[#b4e1f4]  !text-white"
                  : "bg-[#0099cc] text-white hover:opacity-90"
                  }`}
                onClick={() => currentPage !== 1 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                {t("PREVIOUS")}
              </button>

              {(() => {
                const pages = [];
                let start = Math.max(1, currentPage - 1);
                let end = Math.min(totalPages, currentPage + 1);

                if (currentPage === 1) end = Math.min(3, totalPages);
                if (currentPage === totalPages) start = Math.max(1, totalPages - 2);

                for (let p = start; p <= end; p++) pages.push(p);

                return pages.map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-2 text-[10px]  rounded-sm ${currentPage === page
                      ? "bg-[#4d4d4d] text-white"
                      : "bg-[#0090d4] text-white hover:bg-[#b8e5ff]"
                      }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ));
              })()}

              <button
                className={`pagination-btn-first px-2 py-2 text-[10px] rounded-sm ${currentPage === totalPages
                  ? "bg-[#b4e1f4] text-white"
                  : "bg-[#0090d4] text-white hover:opacity-90"
                  }`}
                onClick={() => currentPage !== totalPages && handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                {t("NEXT")}
              </button>

              <button
                className={`pagination-btn-first px-3 py-2 text-[10px] rounded-sm ${currentPage === totalPages
                  ? "bg-[#b4e1f4] text-white"
                  : "bg-[#0090d4] text-white hover:opacity-90"
                  }`}
                onClick={() => currentPage !== totalPages && handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                {t("LAST")}
              </button>
            </div>
          </>
        )}

        {!loading && !results.length && !errorMsg && (
          <p className="text-[red] text-sm px-3 mt-2">{t("No_data_found")}</p>
        )}
      </div>
    </div>
  );
};

export default SearchFilterForm;
