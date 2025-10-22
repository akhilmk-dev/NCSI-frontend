import React from "react";
import Image from "next/image";

const PersonCard = ({ image, title, hoverTitle }) => {
  return (
    <div className="relative group w-[240px] md:w-[260px] h-[350px] overflow-hidden">
      {/* Image */}
      <Image
        src={image}
        alt={title}
        width={280}
        height={350}
        className="w-full h-auto object-cover block"
      />

      {/* Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-[90px] bg-[#6d6e71] text-white text-center py-3 font-semibold text-[15px]  group-hover:bg-[#133c8b]">
        <span className="block group-hover:hidden">{title}</span>
        <span className="hidden group-hover:block">{hoverTitle}</span>
      </div>
    </div>
  );
};

export default PersonCard;
