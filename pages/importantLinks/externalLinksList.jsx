import React from "react";

const ExternalLinksList = ({ links = [] }) => {
  return (
    <section className="bg-white py-20 px-16 sm:px-24 md:px-40 lg:px-56 xl:px-72">
      <ul className="divide-y  border-b border-gray-300 max-w-[1200px] mx-auto">
        {links.map((item, index) => (
          <li key={index} className="py-0.5 divide-gray-300">
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#666666] text-[13px] font-light hover:text-[#c00] transition-colors duration-300"
            >
              ▪ {item.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ExternalLinksList;
