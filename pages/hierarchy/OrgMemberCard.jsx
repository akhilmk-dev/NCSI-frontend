import React from "react";
import Image from "next/image";

const OrgMemberCard = ({ image, title, hoverTitle }) => {
  const hasImage = Boolean(image);

  return (
    <div
      className={`relative group w-[240px] md:w-[260px] ${
        hasImage ? "h-[350px]" : "h-[110px]"
      } overflow-hidden shadow-md`}
    >
      {/* ✅ Image section (if available) */}
      {hasImage && (
        <Image
          src={image}
          alt={title}
          width={280}
          height={350}
          className="w-full h-auto object-cover block"
        />
      )}

      {/* ✅ Overlay / Text box */}
      <div
        className={`absolute left-0 bottom-0 w-full ${
          hasImage ? "h-[90px]" : "h-full"
        } bg-[#6d6e71] text-white text-center py-3 font-semibold text-[15px]
        group-hover:bg-[#133c8b] flex items-center justify-center px-3`}
      >
        <span className="block group-hover:hidden leading-snug">{title}</span>
        <span className="hidden group-hover:block leading-snug">
          {hoverTitle}
        </span>
      </div>
    </div>
  );
};

export default OrgMemberCard;
