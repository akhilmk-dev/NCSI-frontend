import React from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const GuidesAndClassificationTable = ({ data = [], currentPage = 1, itemsPerPage = 10 }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const isRTL = router.locale === "ar";

  return (
    <div className="overflow-x-auto md:py-6">
      <table className="min-w-full border border-gray-200 text-[11.5px] text-gray-800 table-fixed">
        <thead>
          <tr className="bg-[#00a895] text-white">
              {isRTL ? (
                 <>
            <th className="py-3 px-3 font-semibold w-[30px]">م</th>
             <th className="py-2 px-3 font-semibold w-[180px]">{t("المؤشر")}</th>
             <th className="py-2 px-3 font-semibold w-[180px]">{t("Indicator")}</th>
           <th className="py-2 px-3 font-semibold w-[250px]">{t("التوصيف")}</th>
            <th className="py-2 px-3 font-semibold w-[250px]">{t("Description")}</th>
            
            </>
              ):(
                <>
                 <th className="py-2 px-3 font-semibold w-[40px]">{t("No")}</th>
                <th className="py-2 px-3 font-semibold w-[180px]">{t("Indicator")}</th>
                <th className="py-2 px-3 font-semibold w-[180px]">{t("المؤشر")}</th>
                <th className="py-2 px-3 font-semibold w-[250px]">{t("Description")}</th>
                <th className="py-2 px-3 font-semibold w-[250px]">{t("التوصيف")}</th>
              </>
              )}
           
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-300 text-start bg-white">
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>

                {isRTL ? (
                  <>
                  <td className="py-2 px-3 font-semibold border-b text-center">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                    <td className="py-2 px-3 border-b whitespace-normal break-words">
                      {item.indicator_ar}
                    </td>
                    <td className="py-2 px-3 border-b whitespace-normal break-words">
                      {item.indicator_en}
                    </td>
                    <td className="py-2 px-3 border-b whitespace-normal break-words w-[250px]">
                      {item.description_ar}
                    </td>
                    <td className="py-2 px-3 border-b whitespace-normal break-words w-[250px]">
                      {item.description_en}
                    </td>
                  </>
                      ) : (
                    <>
                   <td className="py-2 px-3 font-semibold border-b text-center w-[50px]">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                    <td className="py-2 px-3 border-b whitespace-normal break-words">
                      {item.indicator_en}
                    </td>
                    <td className="py-2 px-3 border-b whitespace-normal break-words ">
                      {item.indicator_ar}
                    </td>
                    <td className="py-2 px-3 border-b whitespace-normal break-words w-[250px]">
                      {item.description_en}
                    </td>
                    <td className="py-2 px-3 border-b whitespace-normal break-words w-[250px]">
                      {item.description_ar}
                    </td>
                  </>
                    )}

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500 align-middle">
                {t("No Data Found")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GuidesAndClassificationTable;
