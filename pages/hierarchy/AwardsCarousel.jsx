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
  <div className=" w-[230px] overflow-hidden shadow-md flex flex-col bg-[#666666] hover:shadow-lg transition-none">

    {/* Text box */}
    <div className="flex items-center justify-center text-center bg-[#6d6e71] px-6 py-5 h-[160px]">
      <p className="text-white text-[17px] font-normal leading-relaxed tracking-wide">
        {award.title}
      </p>
    </div>

    {/* Image box — smaller height, consistent width */}
    <div className="flex items-center justify-center bg-[#666666]  h-[160px]">
      <Image
        src={award.img}
        alt="Award"
        width={260}
        height={160}
        className="object-cover w-full h-full"
      />
    </div>

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
