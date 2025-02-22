import React from "react";

type ActionButtonProps = {
  onClick: (e: React.MouseEvent) => void;
  title: string;
  icon?: string;
  iconComponent?: React.ReactNode;
};

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, title, icon, iconComponent }) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className="hover:bg-[#b3b3ff39] rounded-full p-1 flex items-center justify-center focus:outline-none"
    >
      {iconComponent || icon}
    </button>
    <div className="absolute top-0 right-full transform -translate-y-1/2 -translate-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-[9999] pointer-events-none">
      {title}
    </div>
  </div>
);
