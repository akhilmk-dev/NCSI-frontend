import React, { useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const NewsCard = ({ title, date, description, image, link }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      {/* === White Floating Title Box (Clickable) === */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-white rounded-md shadow-[0_3px_12px_rgba(0,0,0,0.08)] px-6 py-4 flex items-center gap-3 cursor-pointer select-none transition-all duration-300 hover:shadow-lg"
      >
        {/* Circular Arrow */}
        <div
          className={`flex items-center justify-center h-8 w-8 rounded-full border border-gray-300 transition-transform duration-300 ${
            isOpen ? "rotate-90" : "rotate-0"
          }`}
        >
          <ChevronRight className="text-[#f58220] w-5 h-5" />
        </div>

        <h2 className="text-[19px] md:text-[21px] font-semibold text-[#111] leading-snug">
          {title}
        </h2>
      </div>

      {/* === Gray Content Section (Expandable) === */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[1000px] mt-2" : "max-h-0 mt-0"
        }`}
      >
        <div className=" py-6 px-0 md:px-0 flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Image */}
          <div className="w-full md:w-[400px] lg:w-[440px] flex-shrink-0">
            <div className="relative w-full h-[260px] md:h-[280px]">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 560px"
              />
            </div>
          </div>

          {/* Text Block */}
          <div className="flex-1 flex flex-col justify-start">
            <p className="text-[#222] text-[16px] md:text-[17px] leading-relaxed mb-3">
              {description}
            </p>

            <div className="flex items-center justify-between text-[14px] md:text-[15px]">
              <span className="text-[#222]">{date}</span>
              <a
                href={link}
                className="text-[#f58220] hover:text-[#d87414] transition-colors"
              >
                Read More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
