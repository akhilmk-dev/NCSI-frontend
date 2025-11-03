import React from "react";
import { useRouter } from "next/router";

import { X, Search, ClipboardList } from "lucide-react";

const SurveyModal = ({ isOpen, onClose }) => {
    const router = useRouter();

  if (!isOpen) return null;

    const handleSearchClick = () => {
    onClose(); 
    router.push("/survey/searchResult"); 
  };

  const handleSurveyCLick =()=>{
    onClose();
    router.push("/survey")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ">
      <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md h-[250px] p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-600"
        >   
          <X size={18} />
        </button>

        {/* Modal Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Popup Title</h2>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button  className="flex items-center justify-between bg-[#133c8b] hover:bg-[#0a3e5b] text-white rounded-lg py-3 px-2 transition-all duration-200"
          onClick={handleSearchClick}
          >
            <div className="flex items-center gap-3">
              <Search size={18} className="text-white" />
              <span className="text-sm font-medium">Search</span>
            </div>
            <span className="text-lg font-light">→</span>
          </button>

          <button className="flex items-center justify-between bg-[#00A896] hover:bg-[#00907f] text-white rounded-lg py-3 px-2 transition-all duration-200"
          onClick={handleSurveyCLick}
          >
            <div className="flex items-center gap-3">
              <ClipboardList size={18} className="text-white" />
              <span className="text-sm font-medium">Survey</span>
            </div>
            <span className="text-lg font-light">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyModal;
