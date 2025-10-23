import Head from "next/head";
import { Search } from "lucide-react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const SearchResult = () => {
  const { t } = useTranslation("common");

  const dummyData = [
    { id: 1, date: "Sep 14, 2024", agency: "Vodafone", title: "Vodafone Customer Event Survey", number: "2025/167", no: 1 },
    { id: 2, date: "Oct 15, 2024", agency: "Dr. Saeed Al-Ghailani", title: "Vodafone Customer Event Survey", number: "2025/200", no: 2 },
    { id: 3, date: "Nov 16, 2024", agency: "Dr. Saeed Al-Ghailani", title: "Vodafone Customer Event Survey", number: "2025/167", no: 3 },
    { id: 4, date: "Sep 14, 2024", agency: "Vodafone", title: "Vodafone Customer Event Survey", number: "2025/167", no: 4 },
    { id: 5, date: "Sep 14, 2024", agency: "Vodafone", title: "Vodafone Customer Event Survey", number: "2025/167", no: 5 },
    { id: 6, date: "Sep 14, 2024", agency: "Vodafone", title: "Vodafone Customer Event Survey", number: "2025/167", no: 6 },
    { id: 7, date: "Sep 14, 2024", agency: "Vodafone", title: "Vodafone Customer Event Survey", number: "2025/167", no: 7 },
  ];

  return (
    <>
      <Head>
        <title>{t("Search Result")}</title>
      </Head>

                  <section className="events-section px-0 md:px-12 lg:px-20 bg-[#f4f4f4]">
        <div className="_breadcrumb">
          <p className="_breadcrumb-header text-[22px] font-semibold text-[#222]">
            {t("Search Result")}
          </p>
        </div>
      </section>

      <section className="min-h-screen flex flex-col items-center justify-start bg-[#f4f4f4] py-16 px-4">
        {/* === Search Bar === */}
<div className="w-full flex justify-center mb-8">
  <div className="flex items-center gap-3">
    {/* Input bar */}
    <div className="h-9 md:h-10 w-[360px] max-w-[90vw] bg-white border-2 border-[#0056A3] rounded-lg shadow-sm px-4 flex items-center">
      <input
        type="text"
        placeholder="License number / survey address / implementing agency"
        className="w-full h-full bg-transparent outline-none text-[14px] md:text-[15px] text-gray-700 placeholder:text-gray-500 text-center"
      />
    </div>

    {/* Icon button (outside the bar) */}
    <button
      type="button"
      className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-[#009C8C] hover:bg-[#007a6f] grid place-items-center shadow-md transition"
    >
      <Search size={16} className="text-white" />
    </button>
  </div>
</div>

        {/* === Responsive Table === */}
        <div className="w-full max-w-5xl bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700 border-collapse">
            <thead>
              <tr className="bg-[#e5e5e5] text-gray-800 font-semibold border-b border-gray-200">
                <th className="px-4 py-3 text-left whitespace-nowrap">id</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Approval Status</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Implementing Agency</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Survey Title</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Approval Number</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">No.</th>
              </tr>
            </thead>
            <tbody>
              {dummyData.map((row, index) => (
                <tr
                  key={row.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-[#e5e5e5]"
                  } hover:bg-gray-300 transition`}
                >
                  <td className="px-4 py-3">{row.id}</td>
                  <td className="px-4 py-3">{row.date}</td>
                  <td className="px-4 py-3">{row.agency}</td>
                  <td className="px-4 py-3">{row.title}</td>
                  <td className="px-4 py-3">{row.number}</td>
                  <td className="px-4 py-3">{row.no}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default SearchResult;
