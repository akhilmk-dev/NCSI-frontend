import { useState, useEffect } from "react";
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

  const itemsPerPage = 3;
  const totalPages = Math.ceil(total / itemsPerPage);

  // ✅ Default sort: Created At (ascending)
  const [sortOrder, setSortOrder] = useState({
    field: "created_at",
    direction: "asc",
  });

  // ✅ Fetch data from backend
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
    } catch (error) {
      console.error("Error fetching licences:", error);
    }
    setLoading(false);
  };

  // ✅ Load data initially and whenever sort or page changes
  useEffect(() => {
    fetchLicences(currentPage, searchString, sortOrder);
  }, [currentPage, sortOrder]);

  // ✅ Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchLicences(1, searchString, sortOrder);
  };

  // ✅ Handle sorting (toggle asc/desc)
  const handleSort = (field) => {
    setSortOrder((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // 🧭 Table columns
  const columns = [
    { key: "id", label: "ID" },
    { key: "licensenumber", label: "License Number" },
    { key: "title", label: "Title" },
    { key: "agency", label: "Agency" },
    { key: "sponsor", label: "Sponsor" },
    { key: "created_at", label: "Created At" },
  ];

  return (
    <>
      <Head>
        <title>{t("Search Result")}</title>
      </Head>

      <section
        className={`min-h-screen flex flex-col items-center py-4 px-4 ${
          isRTL ? "direction-rtl" : ""
        }`}
      >
        <div className="w-full max-w-6xl">
          {/* === Search Bar === */}
          <div className={`flex mb-6 ${isRTL ? "justify-end" : "justify-start"}`}>
            <div className="flex items-center gap-2">
              <div className="h-9 md:h-10 w-[350px] max-w-[90vw] bg-white border-2 border-[#0056A3] rounded-lg shadow-sm px-4 flex items-center">
                <input
                  type="text"
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                  placeholder={t("License number / survey address / implementing agency")}
                  className="w-full h-full bg-transparent outline-none text-[14px] text-gray-700 placeholder:text-gray-500 text-center"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-[#009C8C] hover:bg-[#007a6f] grid place-items-center shadow-md transition"
              >
                <Search size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* === Table === */}
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
                          ) : key === "created_at" ? (
                            <ChevronUp size={14} className="opacity-40" />
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
                      <td className="px-4 py-3">{row.id}</td>
                      <td className="px-4 py-3">{row.licensenumber}</td>
                      <td className="px-4 py-3">{row.title}</td>
                      <td className="px-4 py-3">{row.agency}</td>
                      <td className="px-4 py-3">{row.sponsor}</td>
                      <td className="px-4 py-3">
                        {new Date(row.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* === Pagination (Same as Guides & Classifications) === */}
          {totalPages > 1 && (
            <div
              id="pagination"
              className="pagination d-flex justify-content-center flex-wrap mt-6 gap-2"
            >
              {currentPage > 1 && (
                <button
                  className="page-button"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <i className="fas fa-caret-left text-white"></i>
                </button>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`page-button ${page === currentPage ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

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
        </div>
      </section>
    </>
  );
};

export default SearchResult;
