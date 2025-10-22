import React, { useState, useEffect } from "react";

const HoverCard = ({ title, color, description, linkText = "", fullText = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
        {/* Default Title */}
        {!isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-[#00a895] font-bold text-[25px] uppercase leading-snug px-4">
              {title}
            </h3>
          </div>
        )}

        {/* Hover Content */}
        {isHovered && (
          <div className="absolute inset-0 flex flex-col items-start justify-center text-center px-6">
            <p className="text-[15px] md:text-[16px] leading-relaxed mb-2 text-white">
              {description}
            </p>

            {linkText && (
              <button
                onClick={() => setShowModal(true)}
                className="text-[#133c8b] font-medium hover:underline"
              >
                {linkText}
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
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-red-600 hover:text-red-800 text-xl font-bold leading-none"
              >
                ×
              </button>

              <h2 className="text-[#555] text-2xl font-semibold mb-4 pb-2 border-b border-gray-200 uppercase text-center">
                {title}
              </h2>

              <p className="text-[#555] text-[16px] leading-relaxed text-justify whitespace-pre-line">
                {fullText || description}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HoverCard;
