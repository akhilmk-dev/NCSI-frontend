import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
const MostViewedSlider = ({ mostViewed }) => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const cover_base_url = process.env.NEXT_PUBLIC_PUBLICATION_BASE_URL;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!mounted || !i18n.isInitialized) return null;

  return (
    <div className="bsdetailsWrap" >
      <div className="bsslidewrap">
        <div
          id="carouselExampleIndicators"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>

          <div className="carousel-inner" style={{minHeight:"512px"}}>
            {mostViewed.top_publications?.map((item, index) => (
              <div
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                key={index}
              >
                <div className="slideContent">
                  {/* <img src="https://www.ncsi.gov.om/Elibrary/Lists/LibraryContent/Attachments/2562/cdar_Cover 202.png" className="d-block w-100" alt="..." /> */}
                  <img
                    src={`${cover_base_url}${item.cover_image}`}
                    className="d-block w-100"
                    alt="..."
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
                          <span>{item.views}</span>
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
                      {/* <div className="prgressbsWrapInner">
                        <div className="d-flex custdflexx">
                          <span>{t("downloaded")}</span>
                          <span>{item.views}</span>
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
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

      {/* Static Button - Outside of Slider */}
      <div className="forbbtn">
        <a href="#">{t("most_viewed")}</a>
      </div>
    </div>
  );
};

export default MostViewedSlider;
