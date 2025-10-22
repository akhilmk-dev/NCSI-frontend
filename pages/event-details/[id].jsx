import { Rating } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { getEventDetails } from "@/services/eventService";
import { useRouter } from "next/router";

const CustomRating = styled(Rating)({
  "& .MuiSvgIcon-root": {
    fontSize: "16px",
    height: 26,
    cursor: "pointer",
    verticalAlign: "middle", // Fix vertical alignmen            // Tighten line height
    position: "relative", // Prevent overflow
  },
  "& .MuiRating-iconFilled": {
    color: "#0072c6", // e.g. pink/red (change to your preferred color)
  },
  "& .MuiRating-iconEmpty": {
    color: "#0072c6", // e.g. light gray
  },
  "& .MuiRating-icon": {
    padding: 0,
    margin: "0",
    overflow: "hidden", // Hide any overflow outside star container
  },
});

// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   return date
//     .toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     })
//     .replace(/ /, " ")
//     .replace(",", " ,");
// };

const formatDate = (dateString, t) => {
  const date = new Date(dateString);
  if (isNaN(date)) return ""; // handle invalid dates

  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString("en", { month: "short" }); // 'Jun'

  return `${day} ${t(month)} , ${year}`;
};

const EventDetails = ({ event }) => {
  if (!event) return <p>Event not found</p>;
  const eventItem = event.event;
  const router = useRouter();
  const isRTL = router.locale === "ar";
  // console.log(eventItem, "-------events");
  const { t } = useTranslation("common");

  const liveUrl = process.env.NEXT_PUBLIC_LIVE_URL

   const { locale } = useRouter();

    const homeUrl = locale === 'ar' ? '/ar/' : '/';
    const eventsUrl = locale === 'ar' ? '/ar/events' : '/events';

  const bannerImage = isRTL
    ? "/assets/images/Indicators_List_bg_ar.jpg"
    : "/assets/images/populationBanner";

  const eventTitle = isRTL ? eventItem?.title_ar : eventItem?.title_en;
  const eventDescription = isRTL
    ? `المركز الوطني للإحصاء و المعلومات - ${eventItem?.short_description_ar || ''}`
    : `National Centre for Statistics and Information - ${eventItem?.short_description_en || ''}`;


  // Split and clean the title into keyword-friendly words
  const dynamicKeywords = eventTitle?.split(' ').join(',') || '';

  const staticKeywords =
    "NCSI,NCSI Oman,Oman Statistics,Oman Indicators الإحصاء , المركز الوطنى للإحصاء والمعلومات , عمان, مؤشرات,Heba Elaraby,Adel Elaraby ,Omar Yusuf,Mahmoud AbdelSabour,Mahmoud Roushdy,Amr Eladly,Eachawy,Maab Ashraf,Yasmeen AbdelSattar";

  const allKeywords = `${staticKeywords},${dynamicKeywords}`;

  // function convertToEmbedUrl(googleMapsUrl) {

  //   const match = googleMapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  //   if (!match) return null;
  
  //   const lat = match[1];
  //   const lng = match[2];
  
  //   return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  // }
  

  return (
    <>
     <Head>
        <title>{t("event_details")}</title>
        <meta id="ctl00_SEO_keyWords" name="keywords" content={allKeywords}></meta>
        <meta id="ctl00_SEO_description" name="description" content={eventDescription}></meta>
    </Head>
    <div style={{ backgroundColor: "#f0f0f0" }}>
     <div className="_breadcrumb">
          <p className="_breadcrumb-header">{t("event_details")}</p>
        </div>
      <div className="container-event-details">
        {/* <div
          style={{ paddingTop: "8px !important" }}
          id="ctl00_g_b915632e_61c3_4200_8685_4dee870ed921"
          __markuptype="vsattributemarkup"
          __webpartid="{B915632E-61C3-4200-8685-4DEE870ED921}"
          webpart="true"
          partorder="2"
        >
          <div class="breadcrumb" style={{  }}>
            <span>
              <span>
                <a href={homeUrl}>{t("home")}</a>
              </span>
              <span> &gt; </span>
              <span>
                <a href={eventsUrl}>{t("events_and_occassion")}</a>
              </span>
              <span> &gt; </span>
              <span>{t("event_details")}</span>
            </span>
          </div>
        </div> */}
        <div data-name="ContentPlaceHolderMain">
          {/* <div
            className={`row TITPage Header_2 ${isRTL ? "bg-ar" : "bg-en"}`}
            style={{
              backgroundSize: "cover",
            }}
          >
            <p class="divEnglishContnet gill-font p-0" style={{}}>
              <span>{t("event_details")}</span>
            </p>
          </div> */}

          <div id="contentViewList">
            <div className="row">
              <div className="col-md-8 col-xs-12 col-sm-12 mt-2 left_side">
                <div className="event_details">
                  <img
                    className=" bg-white"
                    src={eventItem?.img_url || '/assets/images/dummy-image.jpg'}
                    alt="Event Image"
                    width={600}
                    height={400}
                  />
                  <div className="event_desc">
                    <div className="event_metadata">
                      <h1>{isRTL ? eventItem.title_ar : eventItem.title_en}</h1>
                      <hr style={{ borderTop: "1px solid #c6c6c6" }} />
                      <div className="row">
                        <div className="col-md-6" style={{ display: "none" }}>
                          <div className="col-md-5 col-sm-6 col-xs-6 event_lbl">
                            Event Code
                          </div>
                          <div className="col-md-7 col-sm-6 col-xs-6 event_text"></div>
                        </div>

                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-md-5 col-sm-6 col-xs-6 event_lbl">
                              {t("from_date")}
                            </div>
                            <div className="col-md-7 col-sm-6 col-xs-6 event_text">
                              {formatDate(eventItem.from_date, t)}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-md-5 col-sm-6 col-xs-6 event_lbl">
                              {t("to_date")}
                            </div>
                            <div className="col-md-7 col-sm-6 col-xs-6 event_text">
                              {formatDate(eventItem.to_date, t)}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-md-5 col-sm-6 col-xs-6 event_lbl">
                              {t("event_speaker")}
                            </div>
                            <div className="col-md-7 col-sm-6 col-xs-6 event_text">
                              {isRTL
                                ? eventItem.event_speaker_ar
                                : eventItem.event_speaker_en}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-md-5 col-sm-6 col-xs-6 event_lbl">
                              {t("event_location")}
                            </div>
                            <div className="col-md-7 col-sm-6 col-xs-6 event_text">
                              {isRTL
                                ? eventItem.location_ar
                                : eventItem.location_en}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-md-5 col-sm-6 col-xs-6 event_lbl">
                              {t("event_type")}
                            </div>
                            <div className="col-md-7 col-sm-6 col-xs-6 event_text">
                              {isRTL
                                ? eventItem.event_type_ar
                                : eventItem.event_type_en}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-md-5 col-sm-6 col-xs-6 event_lbl">
                              {t("status")}
                            </div>
                            <div className="col-md-7 col-sm-6 col-xs-6 event_text">
                               {eventItem.event_status ? t(eventItem.event_status) : "-"}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="row">
                            <div className="col-md-3 col-sm-6 col-xs-6 event_lbl">
                              {t("attachment")}
                            </div>
                            <div className="col-md-9 col-sm-6 col-xs-6 event_text">
                              <a
                                className="more"
                                href={
                                  isRTL
                                    ? eventItem.pdf_url_ar
                                    : eventItem.pdf_url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src="/assets/images/pdf.png"
                                  alt="PDF"
                                  style={{ width: "20px", height: "24px" }}
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h1 className="event_lbl_dec" style={{ marginTop: "20px" }}>
                      <span>{t("description")}</span>
                    </h1>
                    <p
                      className="gill-font events_details_des_sub"
                      style={{ marginBottom: "0px", paddingBottom: "10px" }}
                    >
                      {isRTL
                        ? eventItem.short_description_ar
                        : eventItem.short_description_en}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="col-md-4 col-sm-12 col-xs-12 mt-2 event-details-map"
                style={{ padding: "" }}
              >
                <button className=" btn-default events-sub-btn Must_Login">
                  {t('subscription')}
                </button>

                <div className="location">
                  <p
                    style={{
                      fontSize: "14px",
                      marginBottom: "0px",
                      fontFamily: isRTL ? "GE_SS_Medium, Arial" : "Gill Sans MT, Arial",
                      color: "#333333",
                    }}
                  >
                   {t('event_location')}
                  </p>
                  <div className="map">
                    
                    <iframe
                      src={eventItem.location_map}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <div className="soicalmediacontent">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${liveUrl}/event-details/${eventItem.id}`}
                    target="_blank"
                    className="facebook_icon"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    href={`https://x.com/intent/post?url=${liveUrl}/event-details/${eventItem.id}`}
                    target="_blank"
                    className="Twitter_icon"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    href="http://plus.google.com/share?"
                    target="_blank"
                    className="gplus_icon"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-google-plus"></i>
                  </a>
                </div>

                {/* <div className="row event-details-rating">
                  <CustomRating
                    style={{ height: "26px" }}
                    name="custom-rating"
                    defaultValue={3}
                    precision={0.5}
                    readOnly
                  />
                </div> */}

                <div
                  className="video row"
                  id="divVideoRow"
                  style={{ display: "none" }}
                >
                  <i className="fa fa-play-circle-o"></i>
                  <div className="mediaplayer">
                    <iframe src=""></iframe>
                  </div>
                </div>

                <button
                  className="btn-default back_btn"
                  // onClick={() => window.history.back()}
                  onClick={() => router.push(eventsUrl)}
                >
                 {t('back_to_event_list')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default EventDetails;

export async function getServerSideProps({ params, locale }) {
  try {
    const { id } = params;
    const event = await getEventDetails(id);

    return {
      props: {
        event,
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  } catch (error) {
    console.error("Error fetching event:", error.message);
    return {
      notFound: true,
    };
  }
}
