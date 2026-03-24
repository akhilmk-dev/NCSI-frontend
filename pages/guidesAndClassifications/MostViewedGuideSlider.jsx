import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const MostViewedGuideSlider = ({ mostViewed }) => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Ensure Bootstrap JS is available for the carousel
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!mounted || !i18n.isInitialized) return null;

  // Adapt to the data structure. Assuming top_guides or similar. 
  // Adapt to the data structure. Handle array directly or nested object.
  const items = Array.isArray(mostViewed) 
    ? mostViewed 
    : (mostViewed?.top_guideclassifications || mostViewed?.top_guides || mostViewed?.top_publications || []);

  return (
    <div className="bsdetailsWrap">
      <div className="bsslidewrap">
        <div
          id="carouselExampleIndicators"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            {items.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : "false"}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>

          <div className="carousel-inner" style={{ minHeight: "512px" }}>
            {items.map((item, index) => (
              <div
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                key={index}
              >
                <div className="slideContent">
                  <img
                    src={item.cover_image_url || item.cover_image}
                    className="d-block w-100"
                    alt={item.title_en || "Guide"}
                  />
                  <div className="c-content-wrap">
                    <div className="bsdetailsContent">
                      <h6>
                        {router.locale === "ar" ? item.title_ar : item.title_en}
                      </h6>
                    </div>
                    <div className="prgressbsWrap">
                      <div className="prgressbsWrapInner">
                        <div className="d-flex custdflexx">
                          <span>{t("most_viewed")}</span>
                          <span>{item.views || 0}</span>
                        </div>
                        <div className="progress">
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "25%" }}
                            aria-valuenow="25"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="carousel-item active">
                <div className="slideContent d-flex align-items-center justify-content-center" style={{ height: "400px", background: "#f8f9fa" }}>
                  <p>{t("No Data Found")}</p>
                </div>
              </div>
            )}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <div className="forbbtn">
        <a href="#">{t("most_viewed")}</a>
      </div>
    </div>
  );
};

export default MostViewedGuideSlider;
