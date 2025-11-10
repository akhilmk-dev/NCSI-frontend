import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const NewsCard = ({ id, title, date, description, image }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  return (
    <div className="w-full">
      {/* === White Floating Title Box (Clickable) === */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-white shadow-[0_3px_12px_rgba(0,0,0,0.08)] px-6 py-4 flex items-center gap-3 cursor-pointer select-none transition-all duration-300 hover:shadow-lg"
      >
        {/* Circular Arrow */}
        <div
          className={`flex items-center justify-center h-8 w-8 rounded-full bg-[#E9EAEB] transition-transform duration-300 ${
            isOpen ? "rotate-90" : "rotate-0"
          }`}
        >
          <ChevronRight className="text-[#f58220] w-5 h-5" />
        </div>

        <h2
          className={`font-semibold text-[#111] leading-snug ${
            locale === "ar"
              ? "text-[28px] md:text-[28px]" // Arabic
              : "text-[19px] md:text-[21px]" // English
          }`}
        >
          {title}
        </h2>
      </div>

      {/* === Gray Content Section (Expandable) === */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[1000px] mt-2" : "max-h-0 mt-0"
        }`}
      >
        <div className="py-2 flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Image */}
          {image ? (
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
          ) : null}

          {/* Text Block */}
          <div
            className={`flex-1 flex flex-col justify-start py-2 ${
              locale === "ar" ? "min-h-[260px] md:min-h-[280px]" : ""
            }`}
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            <p
              className={`text-[#3A372A] font-semibold mb-3 ${
                locale === "ar"
                  ? "text-[1.5rem] leading-[1.75]"
                  : "text-[16px] leading-snug"
              }`}
            >
              {description}
            </p>

            {/* Footer — only Arabic: pinned to bottom, and swapped order */}
<div
  className={`flex items-center justify-between text-[14px] md:text-[15px] ${
    locale === "ar" ? "mt-auto flex-row-reverse" : ""
  }`}
>
  {locale === "ar" ? (
    <>
      {/* 🔁 Arabic — swapped order */}
      <Link href={`/newsPage/newsDetail?id=${id}`} className="read-more">
        {t("Read_more")}
      </Link>
      <span className="text-[#3A372A] font-bold">{date}</span>
    </>
  ) : (
    <>
      {/* 🇬🇧 English — default order */}
      <span className="text-[#3A372A] font-bold">{date}</span>
      <Link href={`/newsPage/newsDetail?id=${id}`} className="read-more">
        {t("Read_more")}
      </Link>
    </>
  )}
</div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
