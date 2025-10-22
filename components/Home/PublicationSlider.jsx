import React, { useEffect } from "react";
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

  return (
    <div className="publisher-slide-main" >
     
      <div
        className="text-bold text-25 wow fadeInLeft  "
        data-wow-delay="0.4s"
        style={{display:'flex',justifyContent:'center',alignItems:'top'}}
      >
         <a href={publicationUrl} className=" pt-3 pb-5" style={{color:"#6d6c71"}}>{t("publications")}</a> 
      </div>
      <div className="swiper-two-wrapper pt-3">
        <Swiper
        key={isRTL}
          dir={isRTL ? 'rtl':'ltr'}
          modules={[Navigation]}
          navigation={{
            nextEl: isRTL ? ".pub-btn-next" : ".pub-btn-prev",
            prevEl: isRTL ? ".pub-btn-prev" : ".pub-btn-next",
          }}
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
          <div
            className="pub-btn-prev customeIconHome-arrow-circle wow fadeInLeft"
            data-wow-delay="0.5s"
            data-wow-duration="0.5s"
          ></div>
          <div
            className="pub-btn-next customeIconHome-arrow-left wow fadeInLeft"
            data-wow-delay="0.5s"
            data-wow-duration="0.5s"
          ></div>
        </Swiper>
      </div>
    </div>
  );
};

export default PublicationSlider;
