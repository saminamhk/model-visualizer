import React, { useState } from "react";

interface SidebarSectionProps {
  title: string;
  items: { id: string; name: string }[];
  onItemSelect: (id: string) => void;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  items,
  onItemSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 px-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-200 sticky top-0 z-10"
      >
        <div className="flex items-center">
          <span
            className={`transition-transform transform duration-200 text-gray-500 ${isExpanded ? "rotate-90" : ""}`}
          >
            ›
          </span>
          <span className="ml-2 font-medium text-gray-700">{title}</span>
        </div>
        <span className="text-xs text-gray-500">{items.length}</span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="mt-2 space-y-1 mb-4">
          {items.map(({ id, name }) => (
            <li
              key={id}
              onClick={() => onItemSelect(id)}
              className="cursor-pointer px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
