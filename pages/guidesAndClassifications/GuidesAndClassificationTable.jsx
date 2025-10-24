import React from "react";
import { useTranslation } from "next-i18next";

const GuidesAndClassificationTable = ({ data = [] }) => {
  const { t } = useTranslation("common");

  return (
    <div className="overflow-x-auto py-5">
      <table className="min-w-full border-t border-b border-gray-200 divide-y divide-gray-200 text-[10.50px] text-gray-800">
        <thead>
          <tr className="bg-[#00a895] text-white text-center">
            <th className="py-3 px-3 font-semibold whitespace-nowrap">
              ID
            </th>
            <th className="py-2 px-3 font-semibold whitespace-nowrap">
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

        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={index}
                className={`text-center ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition-colors`}
              >
                <td className="py-2 px-3 font-medium whitespace-nowrap">
                  {item.id}
                </td>
                <td className="py-2 px-3 whitespace-nowrap">
                  {item.indicator_ar}
                </td>
                <td className="py-2 px-3 whitespace-nowrap">
                  {item.indicator_en}
                </td>
                <td className="py-2 px-3 whitespace-nowrap">
                  {item.description_ar}
                </td>
                <td className="py-2 px-3 whitespace-nowrap">
                  {item.description_en}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="text-center py-4 text-gray-500"
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
