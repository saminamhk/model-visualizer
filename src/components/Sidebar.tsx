import { ContentTypeModels } from "@kontent-ai/management-sdk";
import React from "react";
import { useExpandedNodes } from "../contexts/ExpandedNodesContext";

type SidebarProps = {
  types: Array<ContentTypeModels.ContentType>;
  onTypeSelect: (typeId: string) => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ types, onTypeSelect }) => {
  const { setNodeExpanded } = useExpandedNodes();

  const handleTypeClick = (typeId: string) => {
    onTypeSelect(typeId);
    setNodeExpanded(typeId, true);
  };

  return (
    <div className="p-4">
      <h2 className="font-semibold mb-4 p-2">Content Types</h2>
      <ul>
        {types.map((type) => (
          <li
            key={type.id}
            className="py-2 text-sm cursor-pointer hover:bg-gray-200 px-2 rounded"
            onClick={() => handleTypeClick(type.id)}
          >
            {type.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
