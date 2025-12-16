import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useTranslation } from "next-i18next";

const PublicationSlider = ({ publicationData = [] }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { locale } = useRouter();
  const baseUrlCover = publicationData.baseUrlCover;
  const baseUrlPdf = publicationData.baseUrlPdf;
  const publicationUrl = locale === 'ar' ? '/ar/publications' : '/publications';
  const isRTL = locale === "ar";

  // State to hold the Swiper API instance
  const [swiperRef, setSwiperRef] = useState(null);
  
  // Revert to reliable Swiper boundary state booleans
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // --- Custom Navigation Logic with Click Guard ---

  // Function for the physical NEXT button
  const handleNextClick = () => {
    // LTR: Disabled at Beginning. RTL: Disabled at End.
    const isClickDisabled = !isRTL ? isBeginning : isEnd; 

    if (swiperRef && !isClickDisabled) {
      if (!isRTL) {
        // LTR: Next button slides content backward (slidePrev)
        swiperRef.slidePrev();
      } else {
        // RTL: Next button slides content forward (slideNext)
        swiperRef.slideNext();
      }
    }
  };

  // Function for the physical PREV button
  const handlePrevClick = () => {
    // LTR: Disabled at End. RTL: Disabled at Beginning.
    const isClickDisabled = !isRTL ? isEnd : isBeginning;

    if (swiperRef && !isClickDisabled) {
      if (!isRTL) {
        // LTR: Prev button slides content forward (slideNext)
        swiperRef.slideNext();
      } else {
        // RTL: Prev button slides content backward (slidePrev)
        swiperRef.slidePrev();
      }
    }
  };
  
  // Handler for Swiper events to update the boundary state
  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };
  
  // Custom helper function to generate the disabled class
  const getButtonClass = (isDisabled) => 
    isDisabled ? ' is-disabled' : '';

  // Logic to apply the visual class (based on the direction checks above)
  const getNextDisabled = !isRTL ? isBeginning : isEnd;
  const getPrevDisabled = !isRTL ? isEnd : isBeginning;


  return (
    <div className="publisher-slide-main" >
      
      <div
        className="text-bold text-25 wow fadeInLeft  "
        data-wow-delay="0.4s"
        style={{display:'flex',justifyContent:'center',alignItems:'top'}}
      >
        <a href={publicationUrl} className=" pt-3 pb-5" style={{color:"#6d6c71"}}>{t("publications")}</a> 
      </div>
      <div className="swiper-two-wrapper pt-3">
        <Swiper
          key={isRTL ? 'rtl':'ltr'}
          dir={isRTL ? 'rtl':'ltr'}
          modules={[Navigation]}
          
          // CAPTURE THE SWIPER INSTANCE AND SET INITIAL STATE
          onInit={(swiper) => {
            setSwiperRef(swiper);
            // Initialize the state based on the loaded slider
            setIsBeginning(swiper.isBeginning); 
            setIsEnd(swiper.isEnd);
          }}

          // Monitor slide changes to update boundary state
          onSlideChange={handleSlideChange}
          
          loop={false}
          direction="horizontal"
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 1 },
            1024: { slidesPerView: 1 },
          }}
          className="swiper-two"
        >
          {publicationData?.items?.map((item, index) => (
            <SwiperSlide key={index} style={{ padding:'10px'}}>
              {router.locale == "ar" ? (
                <a
                  href={`${baseUrlPdf}/${item.pdf_file_ar ? item.pdf_file_ar : item.pdf_file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%', 
                    width:"75%",
                    margin:"0 auto"
                  }}
                >
                  <img src={`${baseUrlCover}/${item.cover_image}`} alt="publication" />
                </a>
              ) : (
                <a
                  href={`${baseUrlPdf}/${item.pdf_file ? item.pdf_file : item.pdf_file_ar}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%', 
                    width:"75%",
                    margin:"0 auto",
                  }}
                >
                  <img src={`${baseUrlCover}/${item.cover_image}`} alt="publication" />
                </a>
              )}
              <div className="slider-caption mt-4">
                <span>
                  {router.locale === "ar" ? item.title_ar : item.title_en}
                </span>
                <br />
                <span>
                  {new Date(item.created_at).toLocaleDateString(router.locale, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            </SwiperSlide>
          ))}
          
          {/* Apply the disabled class and the onClick handlers */}
          <div
            className={`pub-btn-prev customeIconHome-arrow-circle wow fadeInLeft ${getButtonClass(getPrevDisabled)}`}
            onClick={handlePrevClick}
            data-wow-delay="0.5s"
            data-wow-duration="0.5s"
            aria-disabled={getPrevDisabled}
          ></div>
          <div
            className={`pub-btn-next customeIconHome-arrow-left wow fadeInLeft ${getButtonClass(getNextDisabled)}`}
            onClick={handleNextClick}
            data-wow-delay="0.5s"
            data-wow-duration="0.5s"
            aria-disabled={getNextDisabled}
          ></div>
        </Swiper>
      </div>
    </div>
  );
};

export default PublicationSlider;