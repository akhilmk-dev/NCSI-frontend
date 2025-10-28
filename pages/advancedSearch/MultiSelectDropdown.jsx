import React, { useState, useRef, useEffect } from "react";

const MultiSelectDropdown = ({ options = [], placeholder, showCaret = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const dropdownRef = useRef(null);

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

  const handleCheckboxChange = (option) => {
    if (option === "[All]") {
      if (selectedItems.length === options.length - 1) {
        setSelectedItems([]);
      } else {
        setSelectedItems(options.filter((item) => item !== "[All]"));
      }
      return;
    }
    if (selectedItems.includes(option)) {
      setSelectedItems(selectedItems.filter((item) => item !== option));
    } else {
      setSelectedItems([...selectedItems, option]);
    }
  };

  return (
    <div className="relative w-[250px]" ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm bg-white cursor-pointer flex justify-between items-center focus:ring-1 focus:ring-[#009e99]"
      >
        <span className="truncate">
          {selectedItems.length > 0
            ? selectedItems.join(", ")
            : placeholder || "Select"}
        </span>

        {showCaret && (
          <i
            className={`fa-solid fa-caret-down text-gray-500 text-xs ml-2 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          ></i>
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-sm shadow-md z-10 max-h-52 overflow-y-auto">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={
                  option === "[All]"
                    ? selectedItems.length === options.length - 1
                    : selectedItems.includes(option)
                }
                onChange={() => handleCheckboxChange(option)}
                className="accent-[#009e99] w-4 h-4"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
