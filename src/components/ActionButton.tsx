import React from "react";

type ActionButtonProps = {
  onClick: (e: React.MouseEvent) => void;
  title: string;
  icon: string;
};

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, title, icon }) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className="hover:bg-[#f3f3fe] rounded-full p-1 flex items-center justify-center focus:outline-none"
    >
      {icon}
    </button>
    <div className="absolute top-0 right-full transform -translate-y-1/2 -translate-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-[9999]">
      {title}
    </div>
  </div>
);
