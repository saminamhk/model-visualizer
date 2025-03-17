import React, { useState } from "react";
import IconSchemeConnected from "../icons/IconSchemeConnected";
import IconMagnifier from "../icons/Magnifier";
import { ActionButton } from "../controls/ActionButton";
import { useNodeState } from "../../contexts/NodeStateContext";
import { useReactFlow } from "reactflow";

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
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const { isolateRelated, isolateSingle, toggleNode } = useNodeState();
  const { fitView } = useReactFlow();

  const handleIsolateRelated = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    isolateRelated(id);
    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  const handleIsolateSingle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    isolateSingle(id);
    toggleNode(id);
    setTimeout(() => fitView({ duration: 800 }), 50);
  };

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
        className={`overflow-auto transition-all duration-300 ${isExpanded ? "opacity-100" : "max-h-0 opacity-0"}`}
      >
        <ul className="mb-15">
          {items.map(({ id, name }) => (
            <li
              key={id}
              onClick={() => onItemSelect(id)}
              onMouseEnter={() => setHoveredItemId(id)}
              onMouseLeave={() => setHoveredItemId(null)}
              className="cursor-pointer px-4 py-3 text-sm text-gray-600 hover:bg-[#b3b3ff39] hover:text-black transition-colors flex items-center"
            >
              {name}
              <span className="flex-1"></span>
              <div
                className="flex gap-1"
                style={{
                  opacity: hoveredItemId === id ? 1 : 0,
                  transition: "opacity 50ms ease-in-out",
                }}
              >
                <ActionButton
                  onClick={(e) => handleIsolateRelated(e, id)}
                  title="Show related nodes"
                  icon={<IconSchemeConnected />}
                />
                <ActionButton
                  onClick={(e) => handleIsolateSingle(e, id)}
                  title="Isolate node"
                  icon={<IconMagnifier />}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
