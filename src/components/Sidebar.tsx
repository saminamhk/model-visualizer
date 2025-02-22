import { ContentTypeModels, ContentTypeSnippetModels } from "@kontent-ai/management-sdk";
import React, { useState } from "react";
import { useExpandedNodes } from "../contexts/ExpandedNodesContext";
import { useReactFlow } from "reactflow";

type ContentType = ContentTypeModels.ContentType;
type Snippet = ContentTypeSnippetModels.ContentTypeSnippet;

interface SidebarProps {
  types: ContentType[];
  snippets: Snippet[];
  onMenuSelect: (typeId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ types, snippets, onMenuSelect }) => {
  const { toggleNode } = useExpandedNodes();
  const { getNodes, setCenter } = useReactFlow();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSidebarSelection = (typeId: string) => {
    onMenuSelect(typeId);
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
    <div className="relative flex">
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "w-0 overflow-hidden" : "w-64"
        } border-r border-gray-200 relative z-10 shadow-lg shadow-neutral-300`}
      >
        <div>
          <div className="w-64">
            {/* Fixed width container to prevent content shrinking */}
            <h2 className="pt-6 text-sm pb-1 font-semibold border-b-2 border-[#5b4ff5]/30 mx-4 px-2">
              Content Types
            </h2>
            <ul>
              {types.map(({ id, name }) => (
                <li
                  key={id}
                  onClick={() => handleSidebarSelection(id)}
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
                  onClick={() => handleSidebarSelection(id)}
                  className="py-2 pl-6 w-full text-sm cursor-pointer hover:bg-gradient-to-r hover:from-[#5b4ff5]/2 hover:via-[#5b4ff5]/4 hover:to-[#5b4ff5]/6"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-[2vw] top-1/2 -translate-y-1/2 bg-white border-2 border-[#5b4ff5] rounded-full w-[1.5vw] h-[1.5vw] hover:bg-[#e7e6ff] transition-all duration-300 z-40 flex items-center justify-center"
      >
        <span className="font-bold text-lg">
          {isCollapsed ? "≫" : "≪"}
        </span>
      </button>
    </div>
  );
};
