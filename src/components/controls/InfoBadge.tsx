import React from "react";

type InfoBadgeProps = {
  title: string;
  icon: string | React.ReactNode;
  className?: string;
  iconStyle?: React.CSSProperties; // required for group color coding as tailwind JIT compiler doesn't like dynamic colors
};

export const InfoBadge: React.FC<InfoBadgeProps> = ({ title, icon, className, iconStyle }) => (
  <div className="relative group text-xs text-gray-400 hover:text-gray-700">
    <div
      className={`rounded-full p-1 flex items-center justify-center focus:outline-none cursor-help ${className}`}
      style={iconStyle}
    >
      {icon}
    </div>
    <div className="absolute top-0 left-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-[9999] pointer-events-none">
      {title}
    </div>
  </div>
);
