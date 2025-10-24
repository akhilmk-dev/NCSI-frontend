import React, { useState } from "react";
import MultiSelectDropdown from "./MultiSelectDropdown";



const SearchFilterForm = () => {
  const [formData, setFormData] = useState({
    search: "",
    title: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search data:", formData);
  };

  const handleSaveSearch = () => {
    console.log("Saved search:", formData);
  };

  // Dropdown options
  const sectionOptions = [
    "[All]",
    "Discussion Board",
    "Blog",
    "Indicators",
    "News",
    "Publications",
    "Events",
    "Career",
  ];

  const themeOptions = [
    "[All]",
    "Tourism",
    "General statistics",
    "Environment",
    "Social",
    "Population",
    "Health",
    "Education and culture",
    "Security & Safety",
    "Census and Surveys",
    "Annual reports of the Centre",
    "Economic",
    "Opinion polls",
    "Other",
  ];

  return (
    <div className="bg-[#ffff]  rounded-md w-full px-20 py-10 md:px-28 lg:px-40 mt-5 pt-5">
      <form
        onSubmit={handleSearch}
        className="flex flex-wrap justify-center gap-x-12 gap-y-6 pt-3 bg-[#f8f8f8]"
      >
        {/* Left column */}
        <div className="flex flex-col gap-4 flex-1 min-w-[400px] max-w-[480px]">
          {/* Search */}
          <div className="flex items-center justify-between">
            <label className="flex items-center w-[100px] text-sm font-semibold text-black whitespace-nowrap">
              <span className="border-l-2 border-[#e5b36a] h-4 mr-2"></span>
              Search
            </label>
            <input
              type="text"
              name="search"
              value={formData.search}
              onChange={handleChange}
              className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#009e99] w-[260px]"
            />
          </div>

          {/* Sections */}
          <div className="flex items-center justify-between">
            <label className="flex items-center w-[100px] text-sm font-semibold text-black whitespace-nowrap">
              <span className="border-l-2 border-[#e5b36a] h-4 mr-2"></span>
              Sections
            </label>
            <MultiSelectDropdown
              options={sectionOptions}
              placeholder="Select Sections"
            />
          </div>


        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 flex-1 min-w-[300px] max-w-[400px] justify-start">
          <div className="flex items-center justify-between mt-1">
            <label className="flex items-center w-[90px] text-sm font-semibold text-black whitespace-nowrap">
              <span className="border-l-2 border-[#e5b36a] h-4 mr-2"></span>
              Theme
            </label>
            <MultiSelectDropdown
              options={themeOptions}
              placeholder="Select Theme"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex justify-end gap-3 mt-8 pr-10">
          <button
            type="submit"
            className="bg-[#009e99] text-white px-6 py-1.5 rounded-sm text-sm font-semibold hover:bg-[#008b87] transition-all"
          >
            SEARCH
          </button>
          <button
            type="button"
            onClick={handleSaveSearch}
            className="bg-[#009e99] text-white px-6 py-1.5 rounded-sm text-sm font-semibold hover:bg-[#008b87] transition-all"
          >
            SAVE SEARCH
          </button>
        </div>
      </form>
    </div>
  );
};


export default SearchFilterForm;
