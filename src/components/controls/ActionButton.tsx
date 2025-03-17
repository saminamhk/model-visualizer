import React, { useState } from "react";
import { createPortal } from "react-dom";

type ActionButtonProps = {
  onClick: (e: React.MouseEvent) => void;
  title: string;
  icon?: string | React.ReactNode;
};

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, title, icon }) => {
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setTooltipPosition(null)}
        className="hover:bg-[#b3b3ff39] rounded-full p-1 flex items-center justify-center focus:outline-none"
      >
        {icon}
      </button>
      {tooltipPosition && createPortal( // renders tooltip to the body element (ensures it's above other elements regardless of where the button is used)
        <div
          className="fixed bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap pointer-events-none z-1000"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          {title}
          <div // tooltip arrow
            className="absolute left-1/2 -translate-x-1/2 -bottom-1"
            style={{
              width: 0,
              height: 0,
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderTop: "4px solid #1f2937", // matches bg-gray-800
            }}
          />
        </div>,
        document.body,
      )}
    </div>
  );
};
