// components/organization/OrganizationChart.jsx
import React from "react";

const OrganizationChart = () => {
  return (
   
      <div className="flex justify-center">
        <div className="relative group w-[280px] md:w-[320px] rounded-md overflow-hidden shadow-md">
          {/* Image */}
          <img
            src="/assets/images/gallery/hierarchy-img-1.png"
            alt="Chief Executive"
            className="w-full h-auto object-cover"
          />

          {/* Role overlay */}
          <div className="absolute bottom-0 left-0 w-full bg-gray-600 text-white text-center py-3 font-semibold text-[15px] transition-all duration-500 group-hover:bg-[#0d2d67]">
            {/* Default label */}
            <span className="block group-hover:hidden">Chief Executive</span>

            {/* On hover */}
            <span className="hidden group-hover:block">
              H.E. Dr. Khalifa bin Abdullah bin Hamad Al Barwani
            </span>
          </div>
        </div>
      </div>
    
  );
};

export default OrganizationChart;
