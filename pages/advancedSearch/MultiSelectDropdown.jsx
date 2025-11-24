import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "next-i18next";

  // const { locale } = useRouter();


const MultiSelectDropdown = ({
  options = [],
  placeholder,
  showCaret = false,
  selected = [], // controlled selected values from parent
  onChange,      // callback to parent
  locale
}) => {

      const { t } = useTranslation("common");
  const labelMap = {
  Achievements: t("About_Us"),
  GuidesClassifications: t("Guides_and_Classifications"),
  All: t("all"),
  Events: t("events"),
  Publications:t("publications"),
  News: t("news"),
};

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Update parent with selected values
  const handleCheckboxChange = (option) => {
    let updatedSelected;

    if (option === "All") {
      updatedSelected = ["All"]; // Only All stays selected
    } else {
      updatedSelected = selected.filter((i) => i !== "All");

      if (selected.includes(option)) {
        updatedSelected = updatedSelected.filter((i) => i !== option);
      } else {
        updatedSelected = [...updatedSelected, option];
      }
    }

    onChange?.(updatedSelected);
  };

  // Updated selected text (display label instead of backend value)
  const getDisplayText = () => {
    if (selected.length === 0) return "";

    if (selected.length === 1) {
      return labelMap[selected[0]] || selected[0];
    }

    return `${selected.length} selected`;
  };

  return (
    <div className=" col-span-8  relative"  ref={dropdownRef}>
      {/* === Dropdown trigger === */}
      <div
        onClick={toggleDropdown}
        style={{borderBottom:"2px solid #97a4a7 !important"}}
        className={`border border-gray-300  ${locale === "ar" ? 'col-span-8 max-w-[280px]' : 'col-span-8'} rounded-sm px-3 bg-white cursor-pointer flex justify-between items-center   h-[40px] focus:ring-1 focus:ring-[#009e99]`}
      >
        <span className="truncate text-gray-800">
          {getDisplayText()}
        </span>

        {/* RIGHT SIDE OF BAR */}
        <div className="flex items-center gap-2">

          {/* CLEAR BUTTON */}
          {selected.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange?.([]);
              }}
              className="text-[11px] text-gray-500 hover:text-red-600 cursor-pointer"
            >
              {t("clear")}   
            </span>
          )}

          {/* Caret Icon */}
          {showCaret && (
            <i
              className={`fa-solid fa-caret-down text-gray-500 text-xs transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            ></i>
          )}
        </div>
      </div>

      {/* === Dropdown list === */}
      {isOpen && (
        <div className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-sm shadow-md z-10 max-h-52 overflow-y-auto"  >
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => handleCheckboxChange(option)}
                className="accent-[#009e99] w-4 h-4"
              />

              {/*  Show mapped label instead of backend value */}
              <span className="text-gray-700">
                {labelMap[option] || option}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
