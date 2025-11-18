import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import { useTranslation } from "next-i18next";
import { getLicences } from "@/services/licenseService";

const SearchResult = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { locale } = router;
  const isRTL = locale === "ar";

  const [licences, setLicences] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(total / itemsPerPage);

  const [sortOrder, setSortOrder] = useState({
    field: "created_at",
    direction: "asc",
  });

  const debounceTimer = useRef(null);

  //  Debounced search handler
  useEffect(() => {
    if (!searchString.trim()) {
      // clear results if empty search
      setLicences([]);
      setTotal(0);
      setHasSearched(false);
      return;
    }

    // debounce search
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchLicences(1, searchString, sortOrder);
    }, 500); 

    return () => clearTimeout(debounceTimer.current);
  }, [searchString, sortOrder]);

  //  Fetch data from backend
  const fetchLicences = async (
    page = 1,
    search = searchString,
    sort = sortOrder
  ) => {
    setLoading(true);
    try {
      const { licences, total } = await getLicences(page, itemsPerPage, search, sort);
      setLicences(licences);
      setTotal(total);
      setCurrentPage(page);
      setHasSearched(true);
    } catch (error) {
      console.error("Error fetching licences:", error);
    }
    setLoading(false);
  };

  //  Manual pagination click
  useEffect(() => {
    if (hasSearched && searchString.trim()) {
      fetchLicences(currentPage, searchString, sortOrder);
    }
  }, [currentPage]);

  const handleSort = (field) => {
    if (field === "survey_status") return;
    setSortOrder((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const columns = [
    { key: "id", label: t("No") },
    { key: "licensenumber", label: t("licence_number") },
    { key: "title", label: t("survey/study_title") },
    { key: "agency", label: t("implementing_entity") },
    { key: "implementation_period_from", label: t("Licence_Period_From") },
    { key: "implementation_period_to", label: t("Licence_Period_To") },
    { key: "survey_status", label: t("Licence_Status") },
  ];

  return (
    <>
      <Head>
        <title>{t("verify_licence")}</title>
      </Head>

      <section
        className={`min-h-screen flex flex-col items-center py-4 px-4 ${
          isRTL ? "direction-rtl" : ""
        }`}
      >
        <div className="w-full max-w-6xl">
          {/* === Search Bar === */}
          <div className="flex mb-6  justify-center md:justify-start">
            <div className="flex items-center gap-2 w-full">
              <div className="h-9 md:h-10 
     w-full 
     max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl 
     bg-white border-2 border-[#0056A3] rounded-lg shadow-sm 
     px-4 flex items-center">
                <input
                  type="text"
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                  placeholder={`${t("licence_number")} / ${t(
                    "survey/study_title"
                  )} / ${t("implementing_entity")}`}
                  className="w-full h-full bg-transparent outline-none text-[14px] text-gray-700 placeholder:text-gray-500 text-start"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (searchString.trim()) {
                    fetchLicences(1, searchString, sortOrder);
                  }
                }}
                className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-[#009C8C] hover:bg-[#007a6f] grid place-items-center shadow-md transition"
              >
                <Search size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* === Results Section (show only after search) === */}
          {hasSearched && (
            <>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center items-center py-12 text-gray-500">
                    {t("Loading...")}
                  </div>
                ) : licences.length === 0 ? (
                  <div className="flex justify-center items-center py-12 text-gray-500">
                    {t("No Data Found")}
                  </div>
                ) : (
                  <table className="min-w-full text-sm text-gray-700 border-collapse">
                    <thead>
                      <tr className="bg-[#e5e5e5] text-gray-800 font-semibold border-b border-gray-200">
                        {columns.map(({ key, label }) => (
                          <th
                            key={key}
                            onClick={() => handleSort(key)}
                            className="px-4 py-3 text-left cursor-pointer select-none whitespace-nowrap"
                          >
                            <div className="flex items-center gap-1">
                              {label}
                              {sortOrder.field === key ? (
                                sortOrder.direction === "asc" ? (
                                  <ChevronUp size={14} />
                                ) : (
                                  <ChevronDown size={14} />
                                )
                              ) : null}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {licences.map((row, index) => (
                        <tr
                          key={row.id}
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-[#f4f4f4]"
                          } hover:bg-gray-200 transition`}
                        >
                          <td className="px-4 py-3">
                            {(currentPage - 1) * itemsPerPage + (index + 1)}
                          </td>
                          <td className="px-4 py-3">{row.licensenumber}</td>
                          <td className="px-4 py-3">{row.title}</td>
                          <td className="px-4 py-3">{row.agency}</td>
                          <td className="px-4 py-3">
                            {row.implementation_period_from
                              ? new Date(row.implementation_period_from).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="px-4 py-3">
                            {row.implementation_period_to
                              ? new Date(row.implementation_period_to).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="px-4 py-3">{row.survey_status || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* === Pagination === */}
{totalPages > 1 && licences.length > 0 && (
  <div
    id="pagination"
    className="pagination d-flex justify-content-center flex-wrap mt-6 gap-2"
  >
    {/* Previous Button */}
    {currentPage > 1 && (
      <button
        className="page-button"
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        <i className="fas fa-caret-left text-white"></i>
      </button>
    )}

    {/* Page Numbers (Compact Display) */}
    {(() => {
      const visiblePages = [];
      const maxVisible = 5; // how many pages to show around current page

      if (totalPages <= maxVisible) {
        // show all pages if small number
        for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
      } else {
        // show a few pages around current
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, currentPage + 2);

        if (start > 2) visiblePages.push(1, "...");
        for (let i = start; i <= end; i++) visiblePages.push(i);
        if (end < totalPages - 1) visiblePages.push("...", totalPages);
      }

      return visiblePages.map((page, index) =>
        page === "..." ? (
          <span key={`dots-${index}`} className="page-dots text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`page-button ${page === currentPage ? "active" : ""}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        )
      );
    })()}

    {/* Next Button */}
    {currentPage < totalPages && (
      <button
        className="page-button"
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        <i className="fas fa-caret-right text-white"></i>
      </button>
    )}
  </div>
)}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default SearchResult;
