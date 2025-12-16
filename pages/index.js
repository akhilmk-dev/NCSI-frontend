import Head from "next/head";
import { useEffect, useState } from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
// import { Geist, Geist_Mono } from "next/font/google";

import Carousel from "@/components/Home/BannerSlider";
import MenuList from "@/components/Home/MenuList";
import PublicationSlider from "@/components/Home/PublicationSlider";
import CalendarIndicator from "@/components/Home/CalenderIndicator";
import IndicatorSlider from "@/components/Home/IndicatorSlider ";
import EventAccordion from "@/components/Home/EventAccordion";
import PopulationClock from "@/components/Home/PopulationClock";
  import { getEventList, getPopulationList, getSliderList, getIndicatorList, getPublicationList } from "@/services/indexServices";
import { getHomePageData, rgetHomePageData } from "@/services/indexServices";
export default function Home({ populationData, sliderData, eventData, indicatorData, publicationData }) {

  const [highlightDate, setHighlightDate] = useState("");
  const [indicatorTitle, setIndicatorTitle] = useState({ en: '', ar: '' });
  const [nextReleaseDate, setNextReleaseDate] = useState("");
  const [nextReleaseDateList, setNextReleaseDateList] = useState([]);
  const [clickedReleaseDate, setClickedReleaseDate] = useState("");
  const { t } = useTranslation("common");
  //  console.log("indicatordataaa:",indicatorData)
   console.log("publicationData:",publicationData)
   
  return (
    <>
      <Head>
        <title>Home - NCSI PORTAL</title>
        <meta id="ctl00_ctl00_SEO_description" name="description" content={t('meta_des_publications')}></meta>
        <meta id="ctl00_ctl00_SEO_keyWords" name="keywords" content="NCSI,NCSI Oman,Oman Statistics,Oman Indicators الإحصاء , المركز الوطنى للإحصاء والمعلومات , عمان, مؤشرات,Heba Elaraby,Adel Elaraby ,Omar Yusuf,Mahmoud AbdelSabour,Mahmoud Roushdy,Amr Eladly,Eachawy,Maab Ashraf,Yasmeen AbdelSattar,National,Centre,for,Statistics,and,Information,-,"></meta>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "NCSI",
                "alternateName": "NCSI",
                "url": "http://13.233.166.184:3002/",
                "logo": "http://13.233.166.184:3002/_next/image?url=%2Fassets%2Fimages%2Flogo.png&w=640&q=75",
                "sameAs": [
                  "https://www.facebook.com/OmanNCSI?ref=hl",
                  "https://www.instagram.com/NCSIOman/",
                  "https://twitter.com/NCSIOman"
                ]
              })
            }}
          />
      </Head>
      <div className="banner-row-main">
        <div className="row banner-row">
          <div className="col-sm-12 col-sm-12 col-md-12 col-lg-4 population-clock">
            <PopulationClock populationData={populationData} />
          </div>
          <div className="col-sm-12 col-sm-12 col-md-12 col-lg-8 home-banner-slider-col">
            <Carousel sliderData={sliderData} />
            <IndicatorSlider
              indicatorData={indicatorData}
              onIndicatorHover={(date, title_en, title_ar, nextReleaseDate) => {
                setHighlightDate(date);
                setIndicatorTitle({ en: title_en, ar: title_ar });
                setNextReleaseDate(nextReleaseDate);

              }}
              onNextReleaseDatesReady={(dates) => {
                setNextReleaseDateList(dates);
              }}
              clickedReleaseDate={clickedReleaseDate}
            />

          </div>
        </div>

      </div>
      <div class="row home-body" style={{ paddingTop: '0px' }}>
        <div class="col-sm-12 col-md-6 col-lg-4 home-body-col wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="0.5s">
          <MenuList />
        </div>
        <div class="col-sm-12 col-md-6 col-lg-4 publisher-slide text-center wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="0.5s">
          <PublicationSlider publicationData={publicationData} />
        </div>
        <div class="col-sm-12 col-md-12 col-lg-4 home-event-calendar home-body-col wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="0.5s">
          <div className="row py-24 py-md-0">
            <div className="col-md-12">
              <CalendarIndicator
                indicatorData = {indicatorData}
                highlightDate={highlightDate}
                indicatorTitle={indicatorTitle}
                nextReleaseDate={nextReleaseDate}
                nextReleaseDateList={nextReleaseDateList}
                onDateClick={(date) => setClickedReleaseDate(date)}
                setClickedReleaseDate={setClickedReleaseDate}
                setNextReleaseDate={setNextReleaseDate}

              // nextReleaseDateList={[
              //   "2025-06-12",
              //   "2025-06-14",
              //   "2025-06-18",
              //   "2025-07-01"
              // ]}
              />
            </div>
            <div className="col-md-12">
              <EventAccordion eventData={eventData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ locale }) {
  try {
    const homeData = await getHomePageData();
    // console.log("homedataaaa:",homeData)

    const sortedSliders = [...homeData.sliders.items].sort((a, b) => {
  const dateA = a.created_at ? new Date(a.created_at) : 0;
  const dateB = b.created_at ? new Date(b.created_at) : 0;

  return dateB - dateA; // latest first
  });

  const sortedPublications = [...homeData.publications.items].sort((a, b) => {
  const dateA = a.created_at ? new Date(a.created_at) : 0;
  const dateB = b.created_at ? new Date(b.created_at) : 0;
  return dateB - dateA; // latest first

});

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        populationData: homeData.population_clock || [],
        sliderData: {
          items: sortedSliders || [],
          baseUrl: homeData.sliders.base_url
        },
        eventData: {
          items: homeData.event.items || [],
          baseUrl: homeData.event.base_url
        },
        indicatorData: {
          items: homeData.key_indicators.items || [],
          baseUrl: homeData.key_indicators.base_url,
          baseUrlPub: homeData.key_indicators.base_url_pub,
        },
        publicationData: {
          items:sortedPublications || [],
          baseUrlCover: homeData.publications.base_url_cover_img,
          baseUrlPdf: homeData.publications.base_url_pdf
        }
      },
    };
  } catch (error) {
    console.error('Failed to fetch home page data:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        populationData: [],
        sliderData: { items: [], baseUrl: "" },
        eventData: { items: [], baseUrl: "" },
        indicatorData: { items: [], baseUrl: "" },
        publicationData: { items: [], baseUrlCover: "", baseUrlPdf: "" }
      },
    };
  }
}