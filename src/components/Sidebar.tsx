import { ContentTypeModels } from "@kontent-ai/management-sdk";
import React from "react";
import { useExpandedNodes } from "../contexts/ExpandedNodesContext";
import { useReactFlow } from "reactflow";

type ContentType = ContentTypeModels.ContentType;

interface SidebarProps {
  types: ContentType[];
  onTypeSelect: (typeId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ types, onTypeSelect }) => {
  const { toggleNode } = useExpandedNodes();
  const { getNodes, setCenter } = useReactFlow();

  const handleTypeClick = (typeId: string) => {
    onTypeSelect(typeId);
    toggleNode(typeId, true);

    const node = getNodes().find(n => n.id === typeId);
    if (node) {
      setCenter(
        node.position.x + 125,
        node.position.y + 80,
        { duration: 800, zoom: 1.2 },
      );
    }
  };

  return (
    <div className="p-4">
      <h2 className="font-semibold mb-4 p-2">Content Types</h2>
      <ul>
        {types.map(({ id, name }) => (
          <li
            key={id}
            onClick={() => handleTypeClick(id)}
            className="py-2 px-2 text-sm rounded cursor-pointer hover:bg-gray-200"
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
};
