import React, { useState } from "react";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { useTranslation } from "next-i18next";

const SearchFilterForm = () => {
  const { t } = useTranslation("common");
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
    <div className="bg-white w-full rounded-md p-8 md:p-10">
      <form
        onSubmit={handleSearch}
        className="bg-[#f9f9f9] rounded-md py-10 px-13 flex flex-wrap justify-between gap-y-6"
      >
        {/* === Left Column === */}
        <div className="flex flex-col gap-6 flex-1 min-w-[380px] max-w-[450px]">
          {/* Search */}
          <div className="flex items-center justify-between control-label">
            <label
              className="flex items-center whitespace-nowrap"
              style={{
                color: "#000000",
                fontSize: "14px",
                fontFamily: '"Gill Sans MT", Arial, sans-serif',
                padding: "7px 15px 0px 10px",
              }}
            >
              <span className="border-l-2 border-[#e5b36a] h-10 mr-3"></span>
              {t("search")}
            </label>
            <input
              type="text"
              name="search"
              value={formData.search}
              onChange={handleChange}
              className="border border-gray-300 rounded-sm w-[250px] px-3 py-2 text-[14px] text-[#000] font-[500] focus:outline-none focus:ring-1 focus:ring-[#00A99D]"
              style={{ fontFamily: '"Gill Sans MT", Arial, sans-serif' }}
            />
          </div>

          {/* Sections */}
          <div className="flex items-center justify-between">
            <label
              className="flex items-center whitespace-nowrap"
              style={{
                color: "#000000",
                fontSize: "14px",
                fontFamily: '"Gill Sans MT", Arial, sans-serif',
                padding: "7px 15px 0px 10px",
              }}
            >
              <span className="border-l-2 border-[#e5b36a] h-10 mr-3"></span>
              {t("Sections")}
            </label>
            <MultiSelectDropdown
              options={sectionOptions}
              showCaret
              className="w-[250px]"
            />
          </div>
        </div>

        {/* === Right Column === */}
        <div className="flex flex-col gap-6 flex-1 min-w-[350px] max-w-[450px]">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <label
              className="flex items-center whitespace-nowrap"
              style={{
                color: "#000000",
                fontSize: "14px",
                fontFamily: '"Gill Sans MT", Arial, sans-serif',
                padding: "7px 15px 0px 10px",
              }}
            >
              <span className="border-l-2 border-[#e5b36a] h-10 mr-3"></span>
              {t("Theme")}
            </label>
            <MultiSelectDropdown
              options={themeOptions}
              showCaret
              className="w-[250px]"
            />
          </div>
        </div>

        {/* === Buttons === */}
        <div className="w-full flex justify-end gap-3 mt-2 pr-4">
          <button
            type="submit"
            className="submitBtn"
           
          >
            {t("search")}
          </button>

          <button
            type="button"
            onClick={handleSaveSearch}
            className="submitBtn  "
          >
            {t("Save_Search")}
          </button>
        </div>
      </form>

      {/* === Sorting Section === */} <div className="sort-section flex flex-wrap items-center gap-4 sm:gap-6 mt-2 mb-4 px-2 sm:px-3">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm font-semibold">
          <button className="bg-[#009e99] text-white rounded-[4px] px-3 sm:px-4 py-1.5 shadow-sm text-[13px] whitespace-nowrap">
            Sort by Relevance
          </button>
          <button className="text-[#f58220] hover:underline whitespace-nowrap">
            Sort by Date
          </button>
          <button className="text-[#f58220] hover:underline whitespace-nowrap">
            Sort by Title
          </button>
          <button className="text-[#f58220] hover:underline whitespace-nowrap">
            Sort by Module
          </button>
        </div>
      </div> {/* === Dummy Result Card === */}
      <div className="result-card w-full rounded-md px-4 sm:px-6 py-4 mb-6 border-l-4 border-[#009e99]">
        <h5 className="text-[#009e99] text-[10px] sm:text-[12px] font-bold uppercase tracking-wide pl-3 leading-snug">
          JOB SATISFACTION FOR YOUNG OMANI WORKERS (%) </h5>
        <p className="text-gray-600 text-[10px] sm:text-[12px] mt-1 leading-snug">
          The percentage of young Omani workers who are satisfied with their jobs according to the public opinion poll of youth attitude toward work.
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-3 text-[13px] sm:text-[14px]">
          <div className="flex items-center gap-2"> <img src="/assets/images/icons/file-icon.png" alt="File Icon" className="w-6 h-6" />
          </div>
          <div>
            <span className="font-semibold text-[#f58220] mr-1">Date

            </span>
            <span className="text-gray-700">2016/06/01</span> </div> <div> <span className="font-semibold text-[#f58220] mr-1">Module</span>
            <span className="text-gray-700">Indicators</span> </div> </div> </div>
    </div>
  );
};

export default SearchFilterForm;
