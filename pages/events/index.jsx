import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getEvents } from "@/services/eventService"; 
import { formatDate } from "@/utils/formatDate";
import Head from "next/head";
const PAGE_SIZE = 3;

const Events = ({ initialEvents }) => {
  const router = useRouter();
  const isRTL = router.locale === "ar";
  const { t } = useTranslation("common");

  const [events, setEvents] = useState(initialEvents);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialEvents.length === PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const nextPage = currentPage + 1;
    const newEvents = await getEvents(nextPage, PAGE_SIZE);
    if (newEvents.length < PAGE_SIZE) {
      setHasMore(false);
    }
    setEvents((prev) => [...prev, ...newEvents]);
    setCurrentPage(nextPage);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Home - NCSI PORTAL</title>
        <meta id="ctl00_ctl00_SEO_description" name="description" content={t('meta_des_publications')}></meta>
        <meta id="ctl00_ctl00_SEO_keyWords" name="keywords" content="NCSI,NCSI Oman,Oman Statistics,Oman Indicators الإحصاء , المركز الوطنى للإحصاء والمعلومات , عمان, مؤشرات,Heba Elaraby,Adel Elaraby ,Omar Yusuf,Mahmoud AbdelSabour,Mahmoud Roushdy,Amr Eladly,Eachawy,Maab Ashraf,Yasmeen AbdelSattar,National,Centre,for,Statistics,and,Information,-,"></meta>
      </Head>
      <section className="events-section">
        <div className="_breadcrumb">
          <p className="_breadcrumb-header">{t("events")}</p>
        </div>

        <div className="row home-body">
          <div className="col-md-12">
            <div className="events-accordion">
              {events?.map((event, index) => (
                <div className="row calendar-row col-lg-12" style={{cursor:"pointer"}} onClick={()=> router.push(`/event-details/${event?.id}`)} key={index}>
                  <div className="col-lg-2 col-md-3 _date-sec">
                    <h1 className="_date">
                      {new Date(event.from_date)
                        .getDate()
                        .toString()
                        .padStart(2, "0")}
                    </h1>
                    <h5 className="_month-year">
                      {(() => {
                        const date = new Date(event.from_date);
                        const month = date
                          .toLocaleString(router.locale, { month: "short" })
                          .toUpperCase();
                        const year = date.getFullYear();
                        return `${year} ${month}`;
                      })()}
                    </h5>
                  </div>
                  <div className="col-lg-10 col-md-9 _calendar-desc-main-sec">
                    <div className="_calendar-desc-sub-sec">
                      <ul className="_title-ul">
                        <li>
                          <h4 className="_title">
                            {isRTL ? event.title_ar : event.title_en}
                          </h4>
                        </li>
                        {event.pdf_url && (
                        <li>
                          <a
                            href={event.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <img
                              src="/assets/images/calendar-icons/download-icon.png"
                              alt="Download Icon"
                            />
                          </a>
                        </li>
                        )}
                      </ul>
                      <p className="_sub-text">
                        {isRTL
                          ? event.short_description_ar
                          : event.short_description_en}
                      </p>
<ul className="_events-ul">
  {/* Always show From / To Dates */}
  <li className="_time-date">
    <span>
      {isRTL ? (
        <>
          من تاريخ: {formatDate(event.from_date, "ar-EG")} إلى تاريخ:{" "}
          {formatDate(event.to_date, "ar-EG")}
        </>
      ) : (
        <>
          From Date: {formatDate(event.from_date)} To Date:{" "}
          {formatDate(event.to_date)}
        </>
      )}
    </span>
  </li>

  {/* Speaker — only if exists */}
  {((isRTL && event.event_speaker_ar) ||
    (!isRTL && event.event_speaker_en)) && (
    <li className="_speaker">
      <span>
        {t("event_speaker")} :{" "}
        {isRTL ? event.event_speaker_ar : event.event_speaker_en}
      </span>
    </li>
  )}

  {/* Location — only if exists */}
  {((isRTL && event.location_ar) || (!isRTL && event.location_en)) && (
    <li className="_location">
      <span>
        {t("event_location")} :{" "}
        {isRTL ? event.location_ar : event.location_en}
      </span>
    </li>
  )}

  {/* Event Type — only if exists */}
  {((isRTL && event.event_type_ar) ||
    (!isRTL && event.event_type_en)) && (
    <li className="_avatar">
      <span>
        {t("event_type")} :{" "}
        {isRTL ? event.event_type_ar : event.event_type_en}
      </span>
    </li>
  )}
</ul>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex">
                <button
                  id="loadMore"
                  onClick={loadMore}
                  disabled={loading}
                  style={{ marginTop: 20 }}
                >
                  {loading ? t("loading") : t("More")}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export async function getServerSideProps({ locale }) {
  const initialEvents = await getEvents(1, PAGE_SIZE);
  return {
    props: {
      initialEvents,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Events;
