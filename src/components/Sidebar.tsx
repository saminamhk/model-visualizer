import { ContentTypeModels, ContentTypeSnippetModels } from "@kontent-ai/management-sdk";
import React from "react";
import { useExpandedNodes } from "../contexts/ExpandedNodesContext";
import { useReactFlow } from "reactflow";

type ContentType = ContentTypeModels.ContentType;
type Snippet = ContentTypeSnippetModels.ContentTypeSnippet;

interface SidebarProps {
  types: ContentType[];
  snippets: Snippet[];
  onTypeSelect: (typeId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ types, snippets, onTypeSelect }) => {
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
    <div>
      <h2 className="pt-6 text-sm pb-1 font-semibold border-b-2 border-[#5b4ff5]/30 mx-4 px-2">Content Types</h2>
      <ul>
        {types.map(({ id, name }) => (
          <li
            key={id}
            onClick={() => handleTypeClick(id)}
            className="py-2 pl-6 w-full text-sm cursor-pointer  hover:bg-gradient-to-r hover:from-[#5b4ff5]/2 hover:via-[#5b4ff5]/4 hover:to-[#5b4ff5]/6"
          >
            {name}
          </li>
        ))}
      </ul>
      <h2 className="pt-6 text-sm pb-1 font-semibold border-b-2 border-[#5b4ff5]/30 mx-4 px-2">Snippets</h2>
      <ul>
        {snippets.map(({ id, name }) => (
          <li
            key={id}
            className="py-2 pl-6 w-full text-sm cursor-pointer hover:bg-gradient-to-r hover:from-[#5b4ff5]/2 hover:via-[#5b4ff5]/4 hover:to-[#5b4ff5]/6"
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
};
