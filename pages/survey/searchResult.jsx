import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Search } from "lucide-react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getLicences } from "@/services/licenseService";

const SearchResult = ({ licencesSSR = [], totalSSR = 0, initialPage = 1 }) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [licences, setLicences] = useState(licencesSSR);
  const [total, setTotal] = useState(totalSSR);
  const [searchString, setSearchString] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(total / itemsPerPage);

  // ✅ Handle page change (client-side)
  const handlePageChange = async (page) => {
    if (page < 1 || page > totalPages) return;
    setLoading(true);
    setCurrentPage(page);

    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page, search: searchString || undefined },
      },
      undefined,
      { shallow: true }
    );

    const { licences, total } = await getLicences(page, itemsPerPage, searchString);
    setLicences(licences);
    setTotal(total);
    setLoading(false);
  };

  // ✅ Handle search manually
  const handleSearch = async () => {
    setLoading(true);
    const { licences, total } = await getLicences(1, itemsPerPage, searchString);
    setLicences(licences);
    setTotal(total);
    setCurrentPage(1);

    router.push(
      {
        pathname: router.pathname,
        query: { search: searchString || undefined, page: 1 },
      },
      undefined,
      { shallow: true }
    );

    setLoading(false);
  };

  // ✅ Automatically refetch when searchString is cleared
  useEffect(() => {
    const reloadDefaultData = async () => {
      if (searchString.trim() === "") {
        setLoading(true);
        const { licences, total } = await getLicences(1, itemsPerPage, "");
        setLicences(licences);
        setTotal(total);
        setCurrentPage(1);
        setLoading(false);
      }
    };
    reloadDefaultData();
  }, [searchString]); // Runs when user clears search box

  // ✅ Sync query params on refresh
  useEffect(() => {
    const pageFromUrl = parseInt(router.query.page) || 1;
    setCurrentPage(pageFromUrl);
  }, [router.query.page]);

  return (
    <>
      <Head>
        <title>{t("Search Result")}</title>
      </Head>

      {/* === Breadcrumb === */}
      <section className="events-section px-0 md:px-12 lg:px-20 bg-[#f4f4f4]">
        <div className="_breadcrumb">
          <p className="_breadcrumb-header text-[22px] font-semibold text-[#222]">
            {t("Search Result")}
          </p>
        </div>
      </section>

      {/* === Main Section === */}
      <section className="min-h-screen flex flex-col items-center justify-start bg-[#f4f4f4] py-16 px-4">
        {/* === Search Bar === */}
        <div className="w-full flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="h-9 md:h-10 w-[360px] max-w-[90vw] bg-white border-2 border-[#0056A3] rounded-lg shadow-sm px-4 flex items-center">
              <input
                type="text"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                placeholder="License number / survey address / implementing agency"
                className="w-full h-full bg-transparent outline-none text-[14px] md:text-[15px] text-gray-700 placeholder:text-gray-500 text-center"
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
<div className="w-full max-w-6xl bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
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
          <th className="px-4 py-3 text-left whitespace-nowrap">ID</th>
          <th className="px-4 py-3 text-left whitespace-nowrap">License Number</th>
          <th className="px-4 py-3 text-left whitespace-nowrap">Title</th>
          <th className="px-4 py-3 text-left whitespace-nowrap">Agency</th>
          <th className="px-4 py-3 text-left whitespace-nowrap">Sponsor</th>
          <th className="px-4 py-3 text-left whitespace-nowrap">Agency Representative</th>
          <th className="px-4 py-3 text-left whitespace-nowrap">License Type</th>
          <th className="px-4 py-3 text-left whitespace-nowrap">Approval Date</th>
          <th className="px-4 py-3 text-left whitespace-nowrap">Implementation From</th>
          <th className="px-4 py-3 text-left whitespace-nowrap">Implementation To</th>
          <th className="px-4 py-3 text-left whitespace-nowrap">Objective</th>
          <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
          <th className="px-4 py-3 text-left whitespace-nowrap">Created At</th>
          <th className="px-4 py-3 text-left whitespace-nowrap">Updated At</th>
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
            <td className="px-4 py-3">{row.agency_rep}</td>
            <td className="px-4 py-3">{row.licencetype}</td>
            <td className="px-4 py-3">{row.approval_date}</td>
            <td className="px-4 py-3">{row.implementation_period_from}</td>
            <td className="px-4 py-3">{row.implementation_period_to}</td>
            <td className="px-4 py-3">{row.objective}</td>
            <td className="px-4 py-3">
              {row.status === 1 ? "Active" : "Inactive"}
            </td>
            <td className="px-4 py-3">
              {new Date(row.created_at).toLocaleString()}
            </td>
            <td className="px-4 py-3">
              {new Date(row.updated_at).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>


        {/* === Pagination === */}
        {totalPages > 1 && (
          <div id="pagination" className="pagination d-flex justify-content-center flex-wrap mt-6 gap-2">
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
        )}
      </section>
    </>
  );
};

// ✅ Server-side render (initial load)
export async function getServerSideProps({ locale, query }) {
  const page = parseInt(query.page) || 1;
  const search = query.search || "";

  try {
    const { licences, total } = await getLicences(page, 10, search);

    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
        licencesSSR: licences,
        totalSSR: total,
        initialPage: page,
      },
    };
  } catch (error) {
    console.error("Error fetching licences:", error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
        licencesSSR: [],
        totalSSR: 0,
        initialPage: 1,
      },
    };
  }
}

export default SearchResult;
