// components/awards/AwardsCarousel.jsx
"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";

const awards = [
  {
    title: "the Excellence Award in Usages of GIS in the MENA Region 22/04/2015",
    img: "/assets/images/gallery/award-1.jpg",
  },
  {
    title: "the Arab Government Excellence Award, in its third session(28/11/2024)",
    img: "/assets/images/gallery/award-2.jpg",
  },
  {
    title: "The  Achievement Award of the Spatial Applications Techniques 24/07/2015",
    img: "/assets/images/gallery/award-3.jpg",
  },
    {
    title: "The  Achievement Award of the Spatial Applications Techniques 24/07/2015",
    img: "/assets/images/gallery/award-3.jpg",
  },
      {
    title: "The  Achievement Award of the Spatial Applications Techniques 24/07/2015",
    img: "/assets/images/gallery/award-3.jpg",
  },
        {
    title: "The  Achievement Award of the Spatial Applications Techniques 24/07/2015",
    img: "/assets/images/gallery/award-3.jpg",
  },
        {
    title: "The  Achievement Award of the Spatial Applications Techniques 24/07/2015",
    img: "/assets/images/gallery/award-3.jpg",
  },

];

const AwardsCarousel = () => {
  return (
    <div className="relative w-full bg-white py-10">
      {/* === Carousel === */}
      <Swiper
      dir="rtl"
        modules={[Navigation,Autoplay]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        slidesPerView={4}
        spaceBetween={50}
        loop={true}
        autoplay={{
    delay: 2500, // auto-slide every 2.5 seconds
    disableOnInteraction: false, 
    reverseDirection:false,
  }}
        className="w-[90%] mx-auto"
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {awards.map((award, index) => (
<SwiperSlide key={index}>
  <div className="group relative w-[230px] h-[320px] overflow-hidden cursor-pointer shadow-md ">
    {/* Layer 1: Default card (title + image) */}
    <div className="absolute inset-0 z-10 flex flex-col">
      {/* Title area */}
      <div className="flex items-center justify-center text-center bg-[#6d6e71] px-6 py-5 h-[160px]">
        <p className="text-white text-[16px] font-normal leading-[1.4] tracking-wide text-center break-words max-w-[85%] mx-auto">
          {award.title}
        </p>
      </div>
      {/* Image area */}
      <div className="flex items-center justify-center bg-[#666666] h-[160px]">
        <Image
          src={award.img}
          alt={award.title}
          width={260}
          height={160}
          className="object-cover w-full h-full"
        />
      </div>
    </div>

    {/* Layer 2: Hover overlay (orange) — same as your working HoverTextCard logic */}
    <div className="absolute inset-0 z-30 hidden group-hover:flex items-center justify-center bg-[#f58220] px-6 py-5 text-center transition-opacity duration-300">
      <p className="text-white text-[15px] font-normal leading-[1.6] tracking-wide text-center break-words max-w-[90%] mx-auto">
        The National Centre for Statistics and Information (NCSI) won the Achievement Award
        of the Spatial Applications Techniques during the World Conference for Users of
        Geographic Information Systems held at San Diego City, USA, during 20–24/07/2015.
      </p>
    </div>

    {/* Optional: a base background to avoid any flicker */}
    <div className="absolute inset-0 z-0 bg-white" />
  </div>
</SwiperSlide>








        ))}
      </Swiper>

      {/* Navigation buttons */}
<div className="swiper-button-prev !bg-[#00a895] !text-white !rounded-full !w-9 !h-9 !flex !items-center !justify-center 
                hover:!bg-[#008c7a] transition-all duration-300 absolute left-3 top-1/2 -translate-y-1/2 z-10 
                shadow-md border border-white/30 after:!text-[14px] after:!font-bold"></div>

<div className="swiper-button-next !bg-[#00a895] !text-white !rounded-full !w-9 !h-9 !flex !items-center !justify-center 
                hover:!bg-[#008c7a] transition-all duration-300 absolute right-3 top-1/2 -translate-y-1/2 z-10 
                shadow-md border border-white/30 after:!text-[14px] after:!font-bold"></div>
    </div>
  );
};

export default AwardsCarousel;  
