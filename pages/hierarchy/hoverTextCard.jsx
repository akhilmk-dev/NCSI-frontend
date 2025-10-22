import React from "react";

const HoverTextCard = ({ title, hoverTitle }) => {
  return (
    <div
      className="relative group w-[240px] md:w-[260px] h-[110px]
                 flex items-center justify-center text-center
                 overflow-hidden  cursor-pointer"
    >
      {/* Default (white) background */}
      <div className="absolute inset-0 bg-white z-0"></div>

      {/* Hover (blue) background — appears above default */}
      <div className="absolute inset-0 bg-[#133c8b] hidden group-hover:block z-10"></div>

      {/* Default Text (visible before hover) */}
      <span
        className="absolute inset-0 z-20 flex items-center justify-center
                   text-[#133c8b] font-semibold text-[14px] px-3 leading-snug
                   group-hover:hidden"
      >
        {title}
      </span>

      {/* Hover Text (visible on hover) */}
      <span
        className="absolute inset-0 hidden group-hover:flex z-20
                   items-center justify-center text-white font-semibold
                   text-[16px] px-3 leading-snug"
      >
        {hoverTitle}
      </span>
    </div>
  );
};

export default HoverTextCard;
