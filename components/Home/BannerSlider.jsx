import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import $ from "jquery";
import { useRouter } from "next/router";

export default function Carousel({ sliderData }) {
  const { locale } = useRouter();
  const isRTL = locale === "ar";
  const { t } = useTranslation("common");
  const logoSrc = locale === 'ar'
  ? '/assets/images/xtwitter.png'
  : '/assets/images/xtwitter.png';
  function shareNCSI(index) {
    setSelectedSlideIndex(index);
    setShowModal(true);
  }

  const baseUrl = sliderData.baseUrl;

  const [showModal, setShowModal] = useState(false);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(null);

  const selectedImagePath = selectedSlideIndex !== null
    ? isRTL
      ? sliderData.items[selectedSlideIndex]?.slider_image_ar
      : sliderData.items[selectedSlideIndex]?.slider_image
    : "";

  const selectedImageUrl = `${baseUrl}/${selectedImagePath}`;
  const encodedImageUrl = encodeURIComponent(selectedImageUrl);

  //     useEffect(() => {
  //     // Import the plugin script after jQuery is available
  //     import('../../public/assets/bootstrapcarouselswipe/bootstrap-carousel-swipe.js').then(() => {
  //       $('.carousel').carousel();
  //     });
  //   }, []);
  return (
    <>
      <style jsx>{`
        .carousel-control {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
        }
      `}</style>
      <section
        className="carousel slide cid-ruuXFG6DcH container-slide"
        data-interval="false"
        id="slider1-9"
      >
        <div className="full-screen">
          <div
            className="mbr-slider slide carousel"
            data-pause="true"
            data-keyboard="false"
            data-ride="carousel"
            data-interval="6000"
          >
            <ol className="carousel-indicators">
              {sliderData.items?.map((_, idx) => (
                <li
                  key={idx}
                  data-app-prevent-settings=""
                  data-target="#slider1-9"
                  className={idx === 0 ? "active" : ""}
                  data-slide-to={idx}
                ></li>
              ))}
            </ol>

            <div className="carousel-inner" role="listbox">
              {sliderData.items?.map((item, idx) => {
                const imageUrl = isRTL
                  ? `${baseUrl}/${item.slider_image_ar}`
                  : `${baseUrl}/${item.slider_image}`;
                return (
                  <div
                    key={item.id}
                    className={`carousel-item slider-fullscreen-image ${idx === 0 ? "active" : ""
                      }`}
                  >
                    <div className="container container-slide">
                      <div className="image_wrapper">
                        <img src={imageUrl} alt={item.alt_text} />
                        <div
                          className="carousel-share customeIconHome-share color-white"
                          id={idx === 0 ? "socialShare" : undefined}
                          onClick={() => shareNCSI(idx)}
                        ></div>
                        <div className="carousel-caption justify-content-center">
                          <div className="col-10 align-center"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <a
              data-app-prevent-settings=""
              className="carousel-control carousel-control-prev wow fadeInLeft "
              data-wow-delay="0.2s"
              data-wow-duration="0.5s"
              role="button"
              data-slide="prev"
              href="#slider1-9"
            >
              <span
                aria-hidden="true"
                className="customeIconHome-arrow-cheveron-left mbr-iconfont slider-arrow-left color-theme"
              ></span>
              <span className="sr-only">Previous</span>
            </a>

            <a
              data-app-prevent-settings=""
              className="carousel-control carousel-control-next slider-prev-icon wow fadeInLeft"
              data-wow-delay="0.4s"
              data-wow-duration="0.5s"
              role="button"
              data-slide="next"
              href="#slider1-9"
            >
              <span
                aria-hidden="true"
                className="customeIconHome-arow-cheveron-right mbr-iconfont color-theme slider-arrow-right"
              ></span>
              <span className="sr-only">Next</span>
            </a>
          </div>
        </div>
      </section>

      {/* {showModal && (
        <div
          className="share-modal-backdrop"
          onClick={() => setShowModal(false)}
        >
          <div
            className="share-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="share-close-button"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h4>Share Slide {selectedSlideIndex + 1}</h4>
            <p>This is where social share options will go.</p>
          </div>
        </div>
      )} */}

      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          id="shareModal"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 100,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-dialog"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content share-modal Mobileapp_popup">
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={() => setShowModal(false)}
                style={{ top: '-12px', right: '-12px' }}
              >
                <span aria-hidden="true">×</span>
                <span className="sr-only">Close</span>
              </button>

              <div
                className="text-center text-bold text-16 text-[#6d6e71]"
                style={{ padding: "10px 5px" }}
                id="shareSocialHead"
              >
                {t("share_to_social_media")}
              </div>

              <div id="shareImage" className="text-center">
                <img
                  src={`${baseUrl}/${isRTL
                      ? sliderData.items[selectedSlideIndex]?.slider_image_ar
                      : sliderData.items[selectedSlideIndex]?.slider_image
                    }`}
                  alt="Slide preview"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>

              <div id="shareButtons" className="jssocials text-center">
                <div className="jssocials-shares d-flex justify-content-center">


                  <div className="jssocials-share jssocials-share-email">
                    <a
                      href={`mailto:?subject=Slide Share&body=${encodedImageUrl}`}
                      target="_self"
                      className="jssocials-share-link"
                    >
                      <i className="fa fa-at jssocials-share-logo"></i>
                    </a>
                  </div>

                  <div className=" jssocials-share-twitter" style={{width:"42px",height:"41px",marginTop:"5px",padding:"5px", paddingRight:"9px"}}>
                    <a
                      href={`https://twitter.com/share?url=${encodedImageUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="jssocials-share-link"
                     
                    >
                      <span className="" >
                        <img
                          src={logoSrc}
                         
                        />
                      </span>
                    </a>
                  </div>

                  <div className="jssocials-share jssocials-share-facebook">
                    <a
                      href={`https://facebook.com/sharer/sharer.php?u=${encodedImageUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="jssocials-share-link"
                    >
                      <i className="fab fa-facebook-f jssocials-share-logo"></i>
                    </a>
                  </div>

                  <div className="jssocials-share jssocials-share-linkedin">
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedImageUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="jssocials-share-link"
                    >
                      <i className="fab fa-linkedin-in jssocials-share-logo"></i>
                    </a>
                  </div>

                  <div className="jssocials-share jssocials-share-whatsapp">
                    <a
                      href={`https://wa.me/?text=${encodedImageUrl}`}
                      target="_blank"
                      className="jssocials-share-link"
                    >
                      <i className="fab fa-whatsapp jssocials-share-logo"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
