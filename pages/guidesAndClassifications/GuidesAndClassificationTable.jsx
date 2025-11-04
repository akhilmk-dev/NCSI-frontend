import React from "react";
import { useTranslation } from "next-i18next";

const GuidesAndClassificationTable = ({ data = [] }) => {
  const { t } = useTranslation("common");

  return (
    <div className="overflow-x-auto md:py-6">
      <table className="min-w-full border border-gray-200 text-[11.5px] text-gray-800">
        <thead>
          <tr className="bg-[#00a895] text-white ">
            <th className="py-3 px-3 font-semibold whitespace-nowrap">
              ID
            </th>
            <th className="py-2 px-3 font-semibold whitespace-nowrap ">
              {t("المؤشر")}
            </th>
            <th className="py-2 px-3 font-semibold whitespace-nowrap">
              {t("Indicator")}
            </th>
            <th className="py-2 px-3 font-semibold whitespace-nowrap">
              {t("التوصيف")}
            </th>
            <th className="py-2 px-3 font-semibold whitespace-nowrap">
              {t("Description")}
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-300 text-start bg-[white]">
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={index}
                className=""
              >
                <td className="py-2 px-3  max-w-[180px] font-semibold border-b ">
                  {item.id}
                </td>
                <td
                  className="py-2 px-3 max-w-[180px] truncate  border-b"
                  title={item.indicator_ar}
                >
                  {item.indicator_ar}
                </td>
                <td
                  className="py-2 px-3 max-w-[180px] truncate border-b"
                  title={item.indicator_en}
                >
                  {item.indicator_en}
                </td>
                <td
                  className="py-2 px-3 max-w-[200px] truncate border-b"
                  title={item.description_ar}
                >
                  {item.description_ar}
                </td>
                <td
                  className="py-2 px-3 max-w-[200px] truncate border-b"
                  title={item.description_en}
                >
                  {item.description_en}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="text-center py-4 text-gray-500 align-middle"
              >
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
