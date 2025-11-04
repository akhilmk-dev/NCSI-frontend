import React, { useState, useEffect } from "react";
import Image from "next/image";

const HoverCard = ({ title, color = "#FF851B", description = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLongText, setIsLongText] = useState(false);

  // Detect if description is long
  useEffect(() => {
    if (description && description.length > 120) {
      setIsLongText(true);
    } else {
      setIsLongText(false);
    }
  }, [description]);

  // Handle scroll blocking for modal
  useEffect(() => {
    if (showModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [showModal]);

  return (
    <>
      {/* === Hover Card === */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative h-[125px] flex items-center justify-center text-center cursor-pointer overflow-hidden"
        style={{
          backgroundColor: isHovered ? color : "#d6d6d6",
        }}
      >
        {/* Title (default view) */}
        {!isHovered && (
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <h3 className="text-[#00a895] font-bold text-[24px] uppercase leading-snug text-center">
              {title}
            </h3>
          </div>
        )}

        {/* Hover Content */}
        {isHovered && (
          <div className="absolute inset-0 flex flex-col justify-center text-left px-6">
            <p className="text-[15px] md:text-[16px] leading-relaxed mb-2 text-white line-clamp-3">
              {description}
            </p>

            {isLongText && (
              <button
                onClick={() => setShowModal(true)}
                className="text-[#133c8b] font-medium hover:underline self-start"
              >
                Show More
              </button>
            )}
          </div>
        )}
      </div>

      {/* === Modal === */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40"></div>
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10">
            <div className="relative bg-white rounded-md shadow-lg max-w-lg w-[90%] mx-auto p-8">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute -top-5 -right-5 md:-top-6 md:-right-6 z-50"
                aria-label="Close"
              >
                <div className="relative w-8 h-8 md:w-8 md:h-8">
                  <Image
                    src="/assets/images/icons/close_icon.png"
                    alt="close"
                    fill
                    className="object-contain"
                    sizes="40px"
                  />
                </div>
              </button>

              {/* Modal Title */}
              <h2 className="text-[#555] text-2xl font-semibold mb-4 pb-2 border-b border-gray-200 uppercase text-center">
                {title}
              </h2>

              {/* Full Text */}
              <p className="text-[#555] text-[16px] leading-relaxed text-justify whitespace-pre-line">
                {description}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};  

export default HoverCard;
