"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { useRouter } from "next/router";

const AwardsCarousel = ({ achievements = [], baseUrl = "" }) => {
  const { locale } = useRouter();

  return (
    <div className="relative w-full bg-white py-1">
      {/* === Carousel === */}
      <Swiper
       key="awards-swiper"
        dir="rtl"
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        loop={true}
        autoplay={{
          delay: 1000,
          disableOnInteraction: false,
        }}
        className="w-[95%] md:w-[90%] mx-auto" 
        breakpoints={{
          320: { slidesPerView: 1.1, spaceBetween: 14 },   // phones
          480: { slidesPerView: 1.5, spaceBetween: 18 },   // small phones
          640: { slidesPerView: 2, spaceBetween: 20 },     // tablets
          768: { slidesPerView: 2.5, spaceBetween: 25 },   // mid tablets
          1024: { slidesPerView: 3, spaceBetween: 35 },    // laptop
          1280: { slidesPerView: 4, spaceBetween: 50 },    // desktop
        }}
      >
        {achievements.length > 0 ? (
          achievements.map((award, index) => (
            <SwiperSlide key={index}>
              <div className="group relative w-full max-w-[230px] sm:max-w-[230px] md:max-w-[230px] h-[300px] sm:h-[320px] overflow-hidden cursor-pointer shadow-md bg-white mx-auto">
                {/* === Default Layer === */}
                <div className="absolute inset-0 z-10 flex flex-col">
                  {/* Title */}
<div className="flex items-center justify-center bg-[#6d6e71] px-4 py-4 min-h-[140px] sm:min-h-[150px]">
  <p
    className="text-white text-[14px] sm:text-[15px] md:text-[16px] leading-snug break-words max-w-[90%] mx-auto"
    style={{
      textAlign: locale === "ar" ? "justify" : "center",
      textJustify: "inter-word",
      wordSpacing: "normal",
      letterSpacing: "normal",
      hyphens: "auto",
      wordBreak: "break-word",
    }}
  >
    {locale === "ar" ? award.title_ar : award.title_en}
  </p>
</div>


                  {/* Image */}
                  <div className="flex items-center justify-center bg-[#666666] flex-1">
                    <Image
                      src={`${baseUrl}/${award.ach_image}`}
                      alt={award.title_en || "Achievement"}
                      width={300}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                {/* === Hover Overlay === */}
                <div className="absolute inset-0 z-30 hidden group-hover:flex items-center bg-[#f58220] px-4 py-5 text-center transition-all duration-300">
                  <div
                    className="overflow-y-auto max-h-[280px] pr-2 text-[14px] sm:text-[15px] leading-relaxed text-white w-full"
                    style={{
                      textAlign:"justify",
                      textJustify:"inter-word",
                       hyphens: "auto",
                      wordBreak: "break-word",
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    <div
                      className="[&_*]:text-white [&_*]:!text-white"
                      dangerouslySetInnerHTML={{
                        __html:
                          locale === "ar"
                            ? award.content_ar
                            : award.content_en,
                      }}
                    />
                  </div>
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                </div>

                <div className="absolute inset-0 z-0 bg-white" />
              </div>
            </SwiperSlide>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            No achievements found
          </p>
        )}
      </Swiper>

      {/* === Navigation Buttons === */}
      <div className="swiper-button-prev !bg-[#00a895] !text-white !rounded-full !w-8 !h-8 md:!w-9 md:!h-9 !flex !items-center !justify-center 
        hover:!bg-[#008c7a] transition-all duration-300 absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-10 shadow-md border border-white/30 after:!text-[12px] md:after:!text-[14px] after:!font-bold"></div>

      <div className="swiper-button-next !bg-[#00a895] !text-white !rounded-full !w-8 !h-8 md:!w-9 md:!h-9 !flex !items-center !justify-center 
        hover:!bg-[#008c7a] transition-all duration-300 absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-10 shadow-md border border-white/30 after:!text-[12px] md:after:!text-[14px] after:!font-bold"></div>
    </div>
  );
};

export default AwardsCarousel;
