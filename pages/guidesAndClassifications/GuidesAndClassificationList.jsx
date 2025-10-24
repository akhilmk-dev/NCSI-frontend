import React from "react";
import { useTranslation } from "next-i18next";

const GuidesAndClassificationList = ({ onSelect, selectedId }) => {
  const { t } = useTranslation("common");

  const dummyData = [
    { id: "methodologies", name: "Methodologies", name_ar: "المنهجيات" },
    { id: "classifications", name: "Classifications", name_ar: "التصانيف" },
    { id: "glossary", name: "Glossary of Statistics", name_ar: "قاموس الإحصاءات" },
  ];

  const isRTL = typeof window !== "undefined" && document?.dir === "rtl";

  return (
    <div className="col-lg-12 p-0">
      <div className="rounded-box">
        <h6 id="Classification">{t("Guides_and_Classifications")}</h6>
      </div>

      <div className="ClassificationScroll">
        <ul id="NCSITheme" className="list-group">
          {dummyData.map(({ id, name, name_ar }) => (
            <li
              key={id}
              data-key={id}
              className={`publ-group-item indicators-desc ${selectedId === id ? "selected" : ""}`}
              style={{ paddingTop: "14px", cursor: "pointer" }}
              onClick={() => onSelect(id)}
            >
              {isRTL ? name_ar : name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GuidesAndClassificationList;
