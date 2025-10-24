import { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Head from "next/head";

import GuidesAndClassificationList from "./GuidesAndClassificationList";
import GuidesAndClassificationCard from "./GuidesAndClassificationCard";
import GuidesAndClassificationTable from "./GuidesAndClassificationTable"; // ✅ import the new component

const GuidesAndClassifications = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const isRTL = router.locale === "ar";

  const [selectedSection, setSelectedSection] = useState("methodologies");

  // Dummy card data for Methodologies / Classifications
  const dummyCards = [
    { title: "Statistical Methodology Overview", imageSrc: "/assets/images/1.jpg", link: "#" },
    { title: "Survey Design Guide", imageSrc: "/assets/images/1.jpg", link: "#" },
    { title: "Sampling Methods", imageSrc: "/assets/images/1.jpg", link: "#" },
    { title: "Data Validation Process", imageSrc: "/assets/images/1.jpg", link: "#" },
    { title: "Data Validation Process", imageSrc: "/assets/images/1.jpg", link: "#" },
    { title: "Data Validation Process", imageSrc: "/assets/images/1.jpg", link: "#" },
    { title: "Data Validation Process", imageSrc: "/assets/images/1.jpg", link: "#" },
    { title: "Data Validation Process", imageSrc: "/assets/images/1.jpg", link: "#" },
  ];

  // Dummy table data for Glossary
  const glossaryData = [
    {
      id: 2234456,
      indicator_en: "Quantity of Propylene Produced",
      indicator_ar: "الكمية المنتجة من البروبيلين",
      description_en: "Quantity produced from propylene, which is a compound",
      description_ar: "الكمية المنتجة من البروبيلين والذي هو عبارة عن مركب يحمل",
    },
    {
      id: 2234456,
      indicator_en: "Quantity of Propylene Produced",
      indicator_ar: "الكمية المنتجة من البروبيلين",
      description_en: "Quantity produced from propylene, which is a compound",
      description_ar: "الكمية المنتجة من البروبيلين والذي هو عبارة عن مركب يحمل",
    },
    {
      id: 2234456,
      indicator_en: "Quantity of Propylene Produced",
      indicator_ar: "الكمية المنتجة من البروبيلين",
      description_en: "Quantity produced from propylene, which is a compound",
      description_ar: "الكمية المنتجة من البروبيلين والذي هو عبارة عن مركب يحمل",
    },
        {
      id: 2234456,
      indicator_en: "Quantity of Propylene Produced",
      indicator_ar: "الكمية المنتجة من البروبيلين",
      description_en: "Quantity produced from propylene, which is a compound",
      description_ar: "الكمية المنتجة من البروبيلين والذي هو عبارة عن مركب يحمل",
    },
        {
      id: 2234456,
      indicator_en: "Quantity of Propylene Produced",
      indicator_ar: "الكمية المنتجة من البروبيلين",
      description_en: "Quantity produced from propylene, which is a compound",
      description_ar: "الكمية المنتجة من البروبيلين والذي هو عبارة عن مركب يحمل",
    },
        {
      id: 2234456,
      indicator_en: "Quantity of Propylene Produced",
      indicator_ar: "الكمية المنتجة من البروبيلين",
      description_en: "Quantity produced from propylene, which is a compound",
      description_ar: "الكمية المنتجة من البروبيلين والذي هو عبارة عن مركب يحمل",
    },
        {
      id: 2234456,
      indicator_en: "Quantity of Propylene Produced",
      indicator_ar: "الكمية المنتجة من البروبيلين",
      description_en: "Quantity produced from propylene, which is a compound",
      description_ar: "الكمية المنتجة من البروبيلين والذي هو عبارة عن مركب يحمل",
    },
        {
      id: 2234456,
      indicator_en: "Quantity of Propylene Produced",
      indicator_ar: "الكمية المنتجة من البروبيلين",
      description_en: "Quantity produced from propylene, which is a compound",
      description_ar: "الكمية المنتجة من البروبيلين والذي هو عبارة عن مركب يحمل",
    },
        {
      id: 2234456,
      indicator_en: "Quantity of Propylene Produced",
      indicator_ar: "الكمية المنتجة من البروبيلين",
      description_en: "Quantity produced from propylene, which is a compound",
      description_ar: "الكمية المنتجة من البروبيلين والذي هو عبارة عن مركب يحمل",
    },
        {
      id: 2234456,
      indicator_en: "Quantity of Propylene Produced",
      indicator_ar: "الكمية المنتجة من البروبيلين",
      description_en: "Quantity produced from propylene, which is a compound",
      description_ar: "الكمية المنتجة من البروبيلين والذي هو عبارة عن مركب يحمل",
    },
  ];

  return (
    <>
      <Head>
        <title>Guides & Classifications - NCSI Portal</title>
      </Head>

      <section className="contact-section">
        <div className="_breadcrumb">
          <p className="_breadcrumb-header">{t("Guides And Classifications")}</p>
        </div>

        <div className="row publication-body">
          {/* Sidebar List */}
          <div className="col-lg-3" style={{ marginTop: "13px" }}>
            <GuidesAndClassificationList
              selectedId={selectedSection}
              onSelect={(id) => setSelectedSection(id)}
            />
          </div>

          {/* Dynamic Main Content */}
          <div className="col-lg-9 d-flex flex-column">
            {selectedSection === "glossary" ? (
              // ✅ Now using the reusable table component
              <GuidesAndClassificationTable data={glossaryData} />
            ) : (
              <>
                {/* Default Card Layout */}
                <div className="row g-4">
                  {dummyCards.map((card, index) => (
                    <div key={index} className="col-12 col-sm-6 col-lg-3 d-flex">
                      <GuidesAndClassificationCard {...card} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
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

export default GuidesAndClassifications;
