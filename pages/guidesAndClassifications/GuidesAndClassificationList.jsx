import React from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const GuidesAndClassificationList = ({ onSelect, selectedId }) => {
  const { t } = useTranslation("common");

  const dummyData = [
    { id: "methodologies", name: "Methodologies", name_ar: "المنهجيات" },
    { id: "classifications", name: "Classifications", name_ar: "التصانيف" },
    { id: "glossary", name: "Glossary of Statistics", name_ar: "قاموس الإحصاءات" },
  ];

 const router = useRouter();
const isRTL = router.locale === "ar";

  return (
    <div className="col-lg-12 p-0">
      <div className="rounded-box">
        <h6 className="text-sm"  id="Classification">{t("Guides_and_Classifications")}</h6>
      </div>

      {/*  Compact list container */}
      <div
        className="ClassificationScroll"
        style={{
          maxHeight: "20vh", 
          overflowY: "visible",
          paddingBottom: "0.5rem",
        }}
      >
        <ul id="NCSITheme" className="list-group">
          {dummyData.map(({ id, name, name_ar }) => (
            <li
              key={id}
              data-key={id}
              className={`publ-group-item indicators-desc ${
                selectedId === id ? "selected" : ""
              }`}
              style={{
                paddingTop: "10px",
                paddingBottom: "10px",
                cursor: "pointer",
                fontSize: "14px",
              }}
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
