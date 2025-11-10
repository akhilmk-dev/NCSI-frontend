import React from "react";
import Image from "next/image";

const PersonCard = ({ image, title, hoverTitle }) => {
  const hasImage = Boolean(image);

  return (
    <div
      className={`relative group w-[240px] md:w-[260px] overflow-hidden ${
        hasImage ? "h-[350px]" : "h-[90px]"
      }`}
    >
      {/* === Image Section (only if image exists) === */}
      {hasImage && (
        <div className="w-full h-full">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 260px"
            className="object-cover object-top"
          />
        </div>
      )}

      {/* === Overlay Section (always visible) === */}
      <div className="absolute bottom-0 left-0 w-full h-[90px] bg-[#6d6e71] text-white text-center py-3 font-semibold text-[15px] group-hover:bg-[#133c8b] transition-all duration-300 flex items-center justify-center">
        {hasImage ? (
          <>
           <span className="block group-hover:hidden break-words leading-normal text-center px-2">
  {title}
</span>

           <span className="hidden group-hover:block break-words leading-normal text-center px-2">
  {hoverTitle}
</span>

          </>
        ) : (
          <>
           <span className="block group-hover:hidden break-words leading-normal text-center px-2">
  {title}
</span>

<span className="hidden group-hover:block break-words leading-normal text-center px-2">
  {hoverTitle}
</span>
</>

        )}
      </div>
    </div>
  );
};

export default PersonCard;
