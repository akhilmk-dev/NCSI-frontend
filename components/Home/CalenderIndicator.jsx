import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const CalendarIndicator = ({
  highlightDate,
  indicatorData,
  indicatorTitle,
  nextReleaseDate,
  nextReleaseDateList = [],
  setClickedReleaseDate,
  setNextReleaseDate,
}) => {
  const router = useRouter();
  const calendarContainerRef = useRef(null);
  const calendarRef = useRef(null);
  const { t } = useTranslation("common");
  // Local state for main date, default to today
  const [mainDate, setMainDate] = useState(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  });
  // Track if user has clicked a date
  const [isDateClicked, setIsDateClicked] = useState(false);
  // Track if an indicator is being hovered
  const [isIndicatorHovered, setIsIndicatorHovered] = useState(false);
  // Track if we're in initial state (no indicator hovered, no user click)
  const [isInitialState, setIsInitialState] = useState(true);
  // Track if the clicked date is a highlighted date
  const [isClickedHighlightedDate, setIsClickedHighlightedDate] = useState(false);
  // Track which indicator the clicked date corresponds to
  const [clickedIndicatorTitle, setClickedIndicatorTitle] = useState(null);
  // Track user's last clicked date to prevent override
  const [userClickedDate, setUserClickedDate] = useState(null);
  
  // Use ref to track if change is from user click (prevents useEffect override)
  const isFromUserClickRef = useRef(false);
  const lastNextReleaseDateRef = useRef(nextReleaseDate);
  
  // Sync local mainDate with nextReleaseDate from parent
  useEffect(() => {
    // If the change is from user click, don't override
    if (isFromUserClickRef.current) {
      // console.log('Preventing override due to user click');
      return;
    }
    
    // Only update if nextReleaseDate actually changed (not from internal state)
    if (nextReleaseDate !== lastNextReleaseDateRef.current) {
      lastNextReleaseDateRef.current = nextReleaseDate;
      
      if (nextReleaseDate && typeof nextReleaseDate === 'string' && nextReleaseDate.length > 0) {
        // console.log('Updating from indicator hover');
        setMainDate(nextReleaseDate);
        // If nextReleaseDate comes from parent (indicator hover), show indicator title and next release
        setIsIndicatorHovered(true);
        setIsDateClicked(true);
        setIsInitialState(false);
        setIsClickedHighlightedDate(false);
        setClickedIndicatorTitle(null);
        setUserClickedDate(null); // Clear user clicked date to allow hover logic
      } else {
        // If no nextReleaseDate, we're back to initial state
        setIsIndicatorHovered(false);
        setIsDateClicked(false);
        setIsInitialState(true);
        setIsClickedHighlightedDate(false);
        setClickedIndicatorTitle(null);
        setUserClickedDate(null); // Clear user clicked date
      }
    }
  }, [nextReleaseDate]);
  
  // Reset the user click flag after a delay
  useEffect(() => {
    if (isFromUserClickRef.current) {
      const timer = setTimeout(() => {
        // console.log('Resetting user click flag');
        isFromUserClickRef.current = false;
      }, 300); // Increased timeout to avoid race conditions
      return () => clearTimeout(timer);
    }
  }, [isFromUserClickRef.current]);
  
  // Additional effect to reset flag when nextReleaseDate changes (for hover)
  useEffect(() => {
    if (nextReleaseDate && nextReleaseDate !== lastNextReleaseDateRef.current) {
      // If nextReleaseDate changes and it's not from user click, reset the flag
      if (!isFromUserClickRef.current) {
        console.log('Resetting flag due to external nextReleaseDate change');
        isFromUserClickRef.current = false;
      }
    }
  }, [nextReleaseDate]);
  const parseDateDMY = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return new Date();
  
    const [day, month, year] = dateStr.split("/").map(Number);
  
    // Check for invalid date components
    if (isNaN(day) || isNaN(month) || isNaN(year)) return new Date();
  
    return new Date(year, month - 1, day);
  };

  function getNextReleaseDate(indicatorDateStr, nextReleaseDay, releaseType, monthOfQuarter) {
    if (releaseType === "Monthly") {
      const indicatorDate = new Date(indicatorDateStr);
      if (isNaN(indicatorDate)) return null;
  
      // Add 1 month
      let year = indicatorDate.getFullYear();
      let month = indicatorDate.getMonth() + 1; 
  
      if (month > 11) {
        month = 0;
        year += 1;
      }
  
      // Construct and return the new date
      const nextReleaseDate = new Date(year, month, nextReleaseDay);
      return nextReleaseDate.toLocaleDateString("en-GB"); // dd/mm/yyyy
    } else if (releaseType === "Quarterly") {
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
  
    return null; // Fallback
  }
  
  // Use mainDate for display
  const dateObj = mainDate ? parseDateDMY(mainDate) : new Date();
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const monthIndex = dateObj.getMonth();
  const monthName = dateObj.toLocaleString(router?.locale || "en", {
    month: "long",
  });

  // Helper to normalize any date (string or Date object) to yyyy-mm-dd (0-padded)
  const normalizeDate = (date) => {
    if (!date) return '';
    let d;
    if (typeof date === 'string' && date.includes('/')) {
      d = parseDateDMY(date);
    } else {
      d = new Date(date);
    }
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0'); // +1 because getMonth() is 0-based
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // const nextRelease = nextReleaseDate
  //   ? new Date(nextReleaseDate).toLocaleDateString(router.locale, {
  //       day: '2-digit',
  //       month: 'long',
  //       year: 'numeric',
  //     })
  //   : '';

  const monthNamesAr = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const title =
    router.locale === "ar" ? indicatorTitle?.ar : indicatorTitle?.en;
  // Compute all next release dates for indicators
  const allNextReleaseDates = Array.isArray(indicatorData?.items)
  ? indicatorData.items.flatMap(item => {
      if (item.release_type === "Monthly") {
        const indicatorDate = new Date(item.indicator_date);
        if (isNaN(indicatorDate)) return [];

        // Get the day number safely
        let day;
        if (item.indicator_next_release_date) {
          if (typeof item.indicator_next_release_date === "number") {
            day = item.indicator_next_release_date;
          } else if (typeof item.indicator_next_release_date === "string") {
            const asNumber = Number(item.indicator_next_release_date);
            if (!isNaN(asNumber)) {
              day = asNumber;
            } else {
              const parsedDate = new Date(item.indicator_next_release_date);
              day = isNaN(parsedDate) ? indicatorDate.getDate() : parsedDate.getDate();
            }
          } else {
            day = indicatorDate.getDate();
          }
        } else {
          day = indicatorDate.getDate();
        }

        const dates = [];
        for (let i = 0; i < 12; i++) {
          let year = indicatorDate.getFullYear();
          let month = indicatorDate.getMonth() + i;

          year += Math.floor(month / 12);
          month = month % 12;

          const nextDate = new Date(year, month, day);

          // Only future dates (including today)
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          if (nextDate >= now) {
            dates.push(nextDate.toLocaleDateString("en-GB"));
          }
        }
        return dates;
      } else {
        // Quarterly or others: single date as before
        const nextDate = getNextReleaseDate(
          item.indicator_date,
          item?.indicator_next_release_date,
          item?.release_type,
          item?.month_of_quarter
        );
        return nextDate ? [nextDate] : [];
      }
    })
  : [];


  useEffect(() => {
    const loadScript = (src) =>
      new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        document.head.appendChild(script);
    });

    const loadJQueryUI = async () => {
      if (!window.jQuery) {
        await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
      }

      if (!window.$.datepicker) {
        await loadScript("https://code.jquery.com/ui/1.13.2/jquery-ui.min.js");

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
          "https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css";
        document.head.appendChild(link);
      }

      const highlightedDates = allNextReleaseDates.map((d) => normalizeDate(d));
      const mainDateNorm = normalizeDate(mainDate);

      // Destroy and reinitialize the datepicker
      window.$(calendarRef.current).datepicker("destroy");

      // Always use parseDateDMY for defaultDate
      const dateObj = parseDateDMY(mainDate);

      window.$(calendarRef.current).datepicker({
        inline: true,
        firstDay: 0,
        showOtherMonths: true,
        dayNamesMin:
          router.locale === "ar"
            ? ["ح", "ن", "ث", "ر", "خ", "ج", "س"] // Arabic: Sunday to Saturday
            : ["S", "M", "T", "W", "T", "F", "S"], // English

        monthNames: router.locale === "ar" ? monthNamesAr : undefined,
        defaultDate: dateObj, // force calendar to jump to the highlight date's month
        beforeShowDay: (date) => {
          const normalized = normalizeDate(date);

          const isMainDate = normalized === mainDateNorm;
          const isHighlighted = highlightedDates.includes(normalized);

          if (isMainDate) {
            return [true, "highlighted-date"];
          } else if (isHighlighted) {
            return [true, "highlighted-text-date"];
          } else {
            return [true, ""];
          }
        },

        onSelect: function (dateText, inst) {
          // console.log('Date clicked:', dateText);
          
          // dateText is in mm/dd/yy format, convert to dd/mm/yyyy
          const [month, day, year] = dateText.split('/');
          const fullYear = year.length === 2 ? '20' + year : year;
          const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${fullYear}`;
          
          // console.log('Formatted date:', formattedDate);
          
          // Check if clicked date matches any indicator's next release date
          const clickedDateNormalized = normalizeDate(formattedDate);
          // console.log('Clicked date normalized:', clickedDateNormalized);
          // console.log('All next release dates:', allNextReleaseDates);
          // console.log('All next release dates normalized:', allNextReleaseDates.map(d => normalizeDate(d)));
          
          // Find matching indicator by comparing normalized dates
          let matchingIndicator = null;
          for (let i = 0; i < indicatorData?.items?.length; i++) {
            const item = indicatorData.items[i];
            const indicatorNextRelease = allNextReleaseDates[i];
            const indicatorNextReleaseNormalized = normalizeDate(indicatorNextRelease);
            // console.log(`Comparing: ${clickedDateNormalized} with ${indicatorNextReleaseNormalized}`);
            if (indicatorNextRelease && indicatorNextReleaseNormalized === clickedDateNormalized) {
              matchingIndicator = item;
              break;
            }
          }
          
          // console.log('Matching indicator:', matchingIndicator);
          // console.log('Setting isFromUserClickRef.current to true');
          
          // Set flag first to prevent useEffect from running
          isFromUserClickRef.current = true;
          
          setMainDate(formattedDate);
          setUserClickedDate(formattedDate); // Set user clicked date to prevent override
          setIsDateClicked(true);
          setIsIndicatorHovered(false); // User clicked, not hovering
          setIsInitialState(false);
          setIsClickedHighlightedDate(!!matchingIndicator);
          setClickedIndicatorTitle(matchingIndicator ? {
            en: matchingIndicator.indicator_title_en,
            ar: matchingIndicator.indicator_title_ar
          } : null);
          
          setClickedReleaseDate && setClickedReleaseDate(formattedDate);
          // Don't call setNextReleaseDate here to avoid overriding state
        },
        onChangeMonthYear: function(year, month, inst) {
          setTimeout(() => {
            window.$(calendarRef.current).datepicker('refresh');
          }, 0);
        },
      });
      // Add mouseleave handler to reset user click flag
      window.$(calendarRef.current).off('mouseleave').on('mouseleave', () => {
        isFromUserClickRef.current = false;
      });
    };

    loadJQueryUI();
  }, [mainDate, router.locale, JSON.stringify(allNextReleaseDates)]);

  // Title logic: show "date" initially, indicator title after user clicks or hovers indicator
  const displayTitle = (isIndicatorHovered || isClickedHighlightedDate)
    ? (router.locale === "ar" 
        ? (clickedIndicatorTitle?.ar || indicatorTitle?.ar) 
        : (clickedIndicatorTitle?.en || indicatorTitle?.en))
    : router.locale == "ar" ? "تاريخ":"date";

  return (
    <>
      <style>{`
        .ui-datepicker-header {
          background-color: #2196f3;
          color: white;
          text-align: center;
          padding: 10px;
          height: 40px;
          border-radius: 8px 8px 0px 0px;
          height: 100%;
        }
        .ui-datepicker-prev span,
        .ui-datepicker-next span {
          display: none;
        }
        .ui-datepicker-prev:after {
          font-family: "Font Awesome 5 Free";
          font-weight: 900;
          content: "\\f0d9";
          font-size: 20px;
          float: left;
          margin-left: 10px;
          cursor: pointer;
          color: #a1a1a1;
          margin-top: 6px;
        }
        .ui-datepicker-next:after {
          font-family: "Font Awesome 5 Free";
          font-weight: 900;
          content: "\\f0da";
          float: right;
          font-size: 20px;
          margin-right: 10px;
          cursor: pointer;
          color: #a1a1a1;
          margin-top: 6px;
        }
        .ui-datepicker-calendar th {
          padding: 10px;
          color: #000000;
        }
        .ui-datepicker-calendar {
          text-align: center;
          margin: 0 auto;
          padding: 8px;
        }
        .ui-datepicker-title {
          padding: 10px;
        }
        .ui-datepicker-calendar td {
          padding: 4px 2px !important;
        }
        .ui-datepicker-calendar .ui-state-default {
          text-decoration: none;
          color: black;
        }
        .ui-datepicker-calendar .ui-state-active {
          color: #ff8f2e;
        }
        .cust-cal-top {
          background-color: #00ab9b;
          color: white;
          padding: 10px 15px;
          font-size: 20px;
        }
        .cust-cal-top span {
          font-size: 22px;
          font-weight: 600;
        }
        .cust-cal-bottom {
          display: flex;
        }
        .cust-cal-orange {
          background-color: #ff8f2e;
          /* padding:10px; */
        }
        .ui-datepicker-calendar .ui-state-default {
          border: none !important;
        }
        .ui-datepicker .ui-widget-header {
          border: none !important;
          border-bottom: 1px solid #b9b9b9 !important;
        }
        .ui-datepicker {
          border: none !important;
          margin-top: 0px !important;
        }
        .ui-datepicker,
        .ui-datepicker .ui-widget-content,
        .ui-datepicker .ui-widget-header,
        .ui-datepicker .ui-state-default,
        .ui-datepicker .ui-state-hover {
          background: #f2f2f2 url(images/ui-bg_flat_75_ffffff_40x100.png) 50% 50%
            repeat-x !important;
        }
        .cust-cal-orange h3 {
          color: white;
          font-size: 70px;
          margin: 0px;
          text-align: center;
          line-height: 1.1;
          font-weight: 600;
          margin-top: 10px;
        }
        .cust-cal-orange span {
          color: white;
          text-align: center;
          display: block;
          font-weight: 600;
          line-height: 12px;
          margin-bottom: 12px;
          font-size: 20px;
        }
        .cust-cal-orange h4 {
          color: white;
          text-align: center;
          font-size: 34px;
          margin: 0px;
          line-height: 1;
          margin-bottom: 4px;
        }
        .cust-cal-orange .chl-div {
          display: block;
          margin: 0px auto;
          border: none;
          padding: 6px 2px;
          background-color: white;
          width: 90px;
          font-size: 14px;
          text-align: center;
        }
        .bk-wyt-arw {
          background-color: white;
          margin: 10px;
          text-align: center;
          line-height: 1.3;
          padding: 6px;
          font-size: 14px;
          margin-bottom: 0px;
          position: relative;
          width: 98px !important;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bk-wyt-arw::after {
          content: "";
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid white;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
        }
        .cust-cal-wrap {
          background-color: white;
          /* width: 360px; */
        }
        .ui-datepicker .ui-datepicker-title {
          font-size: 14px !important;
          line-height: 1em;
          text-align: center;
          color: black;
          font-weight: bold;
        }
        span.ui-datepicker-month {
          text-transform: uppercase;
          color: gray;
        }
        span.ui-datepicker-year {
          color: gray;
        }
        .hasDatepicker {
          width: 100%;
        }
        .ui-datepicker {
          width: auto !important;
          padding: 0px !important;
        }
        .ui-datepicker td span,
        .ui-datepicker td a {
          text-align: center;
        }
        .ui-widget-header .ui-icon {
          display: none !important;
        }
        .ui-datepicker .ui-datepicker-prev,
        .ui-datepicker .ui-datepicker-next {
          outline: none !important;
          border: none !important;
        }
        .ui-datepicker table {
          margin: 0 0 0.8em;
        }
        .highlighted-date .ui-state-default {
          background-color: #ff8f2e !important;
          color: white !important;
          font-weight: bold !important;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          text-align: center !important;
          margin: 0px auto;
          line-height: 27px;
        }
        .highlighted-text-date .ui-state-default {
          color: #ff8f2e !important;
          font-weight: bold !important;
        }

      `}</style>

      {/* <a href="#" className="hover-link">Hover to show calendar</a> */}

      <div className="custom-calendar-wrapper" ref={calendarContainerRef}>
        <div className="cust-cal-wrap">
          <div className="cust-cal-top">
            <i className="fas fa-calendar-alt"></i>{" "}
            <span className="calander-text">{t("calander_of_the_key")}</span>
          </div>
          <div className="cust-cal-bottom">
            <div id="calendar" className="" ref={calendarRef}></div>
            <div className="cust-cal-orange">
              <div className="bk-wyt-arw">{displayTitle}</div>
              <h3>{t(`${day}`)}</h3>
              <span>{t(monthName)}</span>
              <h4>{year}</h4>
              {(isIndicatorHovered || isClickedHighlightedDate) && (
                <div className="chl-div">{t("next_release")}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarIndicator;
