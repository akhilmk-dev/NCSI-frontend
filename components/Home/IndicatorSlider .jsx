import React, { useEffect, useRef } from "react";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import { useRouter } from "next/router";

const IndicatorSlider = ({
  indicatorData,
  onIndicatorHover,
  onNextReleaseDatesReady,
  clickedReleaseDate,
}) => {
  const router = useRouter();
  const isRTL = router.locale === "ar";

  const formatDateToMonthYear = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(router.locale, {
      year: "numeric",
      month: "long",
    }).format(date);
  };

  const formatDateDDMMYYYY = (dateInput) => {
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // function getNextReleaseDate(indicatorDateStr, nextReleaseDay, releaseType, monthOfQuarter) {
  //   if (releaseType === "Monthly") {
  //     const indicatorDate = new Date(indicatorDateStr);
  //     if (isNaN(indicatorDate)) return null;
  
  //     // Add 1 month
  //     let year = indicatorDate.getFullYear();
  //     let month = indicatorDate.getMonth() + 1; // 0-based to 1-based
  
  //     if (month > 11) {
  //       month = 0;
  //       year += 1;
  //     }
  
  //     // Construct and return the new date
  //     const nextReleaseDate = new Date(year, month, nextReleaseDay);
  //     return nextReleaseDate.toLocaleDateString("en-GB"); // dd/mm/yyyy
  //   } else if (releaseType === "Quarterly") {
  //     const indicatorDate = new Date(indicatorDateStr);
  //     if (isNaN(indicatorDate)) return null;
  
  //     let indicatorYear = indicatorDate.getFullYear();
  //     let indicatorMonth = indicatorDate.getMonth(); // 0-based
  
  //     let releaseMonth = monthOfQuarter - 1; // convert to 0-based month
  
  //     // If indicator month is after or equal to the release month, use next year
  //     let releaseYear = indicatorMonth >= releaseMonth ? indicatorYear + 1 : indicatorYear;
  
  //     const nextReleaseDate = new Date(releaseYear, releaseMonth, nextReleaseDay);
  //     return nextReleaseDate.toLocaleDateString("en-GB"); // dd/mm/yyyy
  //   }
  
  //   return null; // Fallback
  // }
  
  // console.log(nextReleaseDate, "--indicatorData");
  
  function getNextReleaseDate(indicatorDateStr, nextReleaseDay, releaseType, monthOfQuarter) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time
  
    if (releaseType === "Monthly") {
      const indicatorDate = new Date(indicatorDateStr);
      if (isNaN(indicatorDate)) return null;
  
      let year = today.getFullYear();
      let month = today.getMonth();
  
      // Build release date for current month
      let tentativeDate = new Date(year, month, nextReleaseDay);
  
      // If today is after the tentative release date, move to next month
      if (today > tentativeDate) {
        month += 1;
        if (month > 11) {
          month = 0;
          year += 1;
        }
        tentativeDate = new Date(year, month, nextReleaseDay);
      }
  
      return tentativeDate.toLocaleDateString("en-GB"); // dd/mm/yyyy
    }
  
    // For Quarterly
    if (releaseType === "Quarterly") {
      const indicatorDate = new Date(indicatorDateStr);
      if (isNaN(indicatorDate)) return null;
  
      let indicatorYear = indicatorDate.getFullYear();
      let indicatorMonth = indicatorDate.getMonth(); // 0-based
  
      let releaseMonth = monthOfQuarter - 1; // convert to 0-based month
  
      // If indicator month is after or equal to the release month, use next year
      let releaseYear = indicatorMonth >= releaseMonth ? indicatorYear + 1 : indicatorYear;
  
      const nextReleaseDate = new Date(releaseYear, releaseMonth, nextReleaseDay);
      return nextReleaseDate.toLocaleDateString("en-GB"); // dd/mm/yyyy
    }
  
    return null;
  }
  
  const indicatorList = indicatorData.items;
  const baseUrl = indicatorData.baseUrl;
  const baseUrlPub = indicatorData.baseUrlPub;
  

  const indicators = indicatorList?.map((item) => ({
    value: item.indicator_value,
    percent: isRTL
      ? item.indicator_value_unit_ar
      : item.indicator_value_unit_en,
    description: isRTL ? item.indicator_title_ar : item.indicator_title_en,
    date: isRTL ? item?.indicator_sub_title_ar :item?.indicator_sub_title_en ,
    indicator_date: item.indicator_date,
    indicator_next_release_date: item.indicator_next_release_date,
    file: item.file,
    pub_file: item.pub_file, 
    
    release_type:item?.release_type,
    month_of_quarter:item?.month_of_quarter,
    bgClass: "bg-white", // optional - or from item.bg_class
  }));

  // console.log(indicators, "-----------indicators");

  useEffect(() => {
    if (indicatorList.length > 0) {
      const firstItem = indicatorList[0];
      onIndicatorHover?.(
        firstItem.indicator_date,
        firstItem.indicator_title_en,
        firstItem.indicator_title_ar,
        firstItem.indicator_next_release_date
      );
    }
    const allNextReleaseDates = indicatorList
      ?.map((item) => item.indicator_next_release_date)
      .filter((date) => date); // remove null/undefined
    onNextReleaseDatesReady?.(allNextReleaseDates);
  }, []);

  const swiperRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isRTL = router.locale === "ar";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";

    swiperRef.current = new Swiper(".indicator-swiper-container", {
      loop: false,
      direction: "horizontal",
      rtl: isRTL,
      slidesPerView: 3,
      spaceBetween: 16,
      navigation: {
        nextEl: isRTL ? ".indicator-button-prev" : ".indicator-button-next",
        prevEl: isRTL ? ".indicator-button-next" : ".indicator-button-prev",
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        600: { slidesPerView: 3 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 3 },
      },
    });

    return () => {
      swiperRef.current?.destroy?.(true, true);
    };
  }, [router.locale]);

  useEffect(() => {
    if (!swiperRef.current || !clickedReleaseDate) return;

    const targetIndex = indicators.findIndex(
      (item) =>
        formatDateDDMMYYYY(item.indicator_next_release_date) ===
        formatDateDDMMYYYY(clickedReleaseDate)
    );

    if (targetIndex !== -1) {
      swiperRef.current.slideTo(targetIndex);
      const targetItem = indicatorList[targetIndex];
      onIndicatorHover?.(
        targetItem.indicator_date,
        targetItem.indicator_title_en,
        targetItem.indicator_title_ar,
        targetItem.indicator_next_release_date
      );
    } else {
      // Explicitly scroll to first or disable scroll
      swiperRef.current.slideTo(0);

      // Trigger empty indicator hover data (to update title/UI)
      onIndicatorHover?.("", "", "", clickedReleaseDate);
    }
  }, [clickedReleaseDate, indicatorList]);


  return (
    <center className="indicator-container">
      <div
        className="slider-indicator-col text-center relative"
        style={{ padding: "0px 0px" }}
      >
        <div
          className="swiper indicator-swiper-container"
          style={{ marginTop: "0px", marginBottom: "0px" }}
        >
          <div className="swiper-wrapper">
            {indicators?.map((item, index) => (
              <div
                className="swiper-slide"
                key={index}
                
              >
{item.file || item.pub_file ? (
  <a
    href={
      item.file
        ? `${baseUrl}/${item.file}`           // normal indicator file
        : `${baseUrlPub}/${item.pub_file}` // publication file
    }target="_blank" onMouseEnter={() =>{
                    onIndicatorHover(
                      item.indicator_date,
                      indicatorList[index]?.indicator_title_en, // pass both titles
                      indicatorList[index]?.indicator_title_ar,
                      getNextReleaseDate( item.indicator_date,item?.indicator_next_release_date,item?.release_type,item?.month_of_quarter)
                    )
                  }
                  }>
                    <div
                      className={`indicator-sub ${
                        formatDateDDMMYYYY(item.indicator_next_release_date) ===
                        formatDateDDMMYYYY(clickedReleaseDate)
                          ? "ind-highlight-text"
                          : ""
                      }`}
                      style={{
                        paddingBottom: "13px",
                        backgroundColor:
                          formatDateDDMMYYYY(
                            item.indicator_next_release_date
                          ) === formatDateDDMMYYYY(clickedReleaseDate)
                            ? "#fd7e1d"
                            : "white",
                      }}
                    >
                      <img src="assets/images/download-icon_.png" alt="" />
                      <span className="text-bold font-Janna-LTBold indicator-value">
                        {item.value}
                      </span>
                      <div
                        className="indicators-desc"
                        style={{ height: "80px", fontSize: "15px" }}
                      >
                        <span className="text-bold SubTitleIndi">
                          {item.percent}
                        </span>
                        <span>{item.description}</span>
                        <br />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </a>
                ) : (
                  <div
                    className={`indicator-sub ${
                      formatDateDDMMYYYY(item.indicator_next_release_date) ===
                      formatDateDDMMYYYY(clickedReleaseDate)
                        ? "ind-highlight-text"
                        : ""
                    }`}
                    style={{
                      paddingBottom: "13px",
                      backgroundColor:
                        formatDateDDMMYYYY(item.indicator_next_release_date) ===
                        formatDateDDMMYYYY(clickedReleaseDate)
                          ? "#fd7e1d"
                          : "white",
                    }}
                    onMouseEnter={() => {
                      onIndicatorHover(
                        item.indicator_date,
                        indicatorList[index]?.indicator_title_en,
                        indicatorList[index]?.indicator_title_ar,
                        getNextReleaseDate( item.indicator_date,item?.indicator_next_release_date,item?.release_type,item?.month_of_quarter)
                      );
                    }}
                  >
                    <img src="assets/images/download-icon_.png" alt="" />
                    <span className="text-bold font-Janna-LTBold indicator-value">
                      {item.value}
                    </span>
                    <div
                      className="indicators-desc"

                      style={{ height: "80px", fontSize: "15px" }}
                    >
                      <span className="text-bold SubTitleIndi">
                        {item.percent}
                      </span>
                      <span>{item.description}</span>
                      <br />
                      <span>{item?.date}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation buttons (must be outside swiper-wrapper) */}
          {/* <div className="indicator-button-next customeIconHome-arrow-circle wow fadeInLeft" data-wow-delay="0.5s" data-wow-duration="0.5s"></div>
        <div className="indicator-button-prev customeIconHome-arrow-left wow fadeInLeft" data-wow-delay="0.5s" data-wow-duration="0.5s"></div> */}
        </div>
        <button
          className="indicator-button-next wow fadeInLeft"
          type="button"
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
            width="40"
            height="40"
          >
            <path d="M15.5 0.932L11.2 5.312 25.7 19.912 11.2 34.412 15.5 38.812 30.1 24.212 34.5 19.912 30.1 15.512 15.5 0.932Z" />
          </svg>
        </button>

        <button
          className="indicator-button-prev  wow fadeInLeft"
          type="button"
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
            width="40"
            height="40"
            style={{ transform: "rotate(180deg)" }} // rotate for left arrow
          >
            <path d="M15.5 0.932L11.2 5.312 25.7 19.912 11.2 34.412 15.5 38.812 30.1 24.212 34.5 19.912 30.1 15.512 15.5 0.932Z" />
          </svg>
        </button>
      </div>
    </center>
  );
};

export default IndicatorSlider;
