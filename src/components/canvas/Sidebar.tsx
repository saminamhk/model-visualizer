import { ContentTypeModels, ContentTypeSnippetModels } from "@kontent-ai/management-sdk";
import React, { useState } from "react";
import { useNodeState } from "../../contexts/NodeStateContext";
import { useReactFlow } from "reactflow";

type ContentType = ContentTypeModels.ContentType;
type Snippet = ContentTypeSnippetModels.ContentTypeSnippet;

interface SidebarProps {
  types: ContentType[];
  snippets: Snippet[];
  onMenuSelect: (typeId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ types, snippets, onMenuSelect }) => {
  const { toggleNode } = useNodeState();
  const { getNodes, setCenter } = useReactFlow();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSidebarSelection = (typeId: string) => {
    onMenuSelect(typeId);
    const node = getNodes().find(n => n.id === typeId);
    if (node) {
      toggleNode(typeId, true);
      setCenter(node.position.x + 125, node.position.y + 80, { duration: 800, zoom: 1.2 });
    }
  };

  const renderList = (title: string, items: { id: string; name: string }[]) => (
    <>
      <h2 className="py-6 text-sm pb-1 font-semibold border-b-2 border-[#5b4ff5]/30 mx-4 px-2">
        {title}
      </h2>
      <ul>
        {items.map(({ id, name }) => (
          <li
            key={id}
            onClick={() => handleSidebarSelection(id)}
            className="py-2 pl-4 mx-4 text-sm cursor-pointer hover:bg-[#b7babe27] rounded-md m-1"
          >
            {name}
          </li>
        ))}
      </ul>
    </>
  );

  const toggleButton = (
    <button
      onClick={() => setIsCollapsed(!isCollapsed)}
      className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white border-1 border-[#5b4ff5] rounded-full w-9 h-9 hover:bg-[#e7e6ff] transition-all duration-300 z-40 flex items-center justify-center"
    >
      <span className="font-bold text-lg">
        {isCollapsed ? "≫" : "≪"}
      </span>
    </button>
  );

  return (
    <div className="relative flex">
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "w-0" : "w-64"
        } border-r border-gray-200 relative z-10 top-0 shadow-lg shadow-neutral-300 overflow-hidden`}
      >
        <div
          className={`w-64 transition-transform duration-300 ${isCollapsed ? "-translate-x-full" : "translate-x-0"}`}
        >
          {renderList("Content Types", types)}
          {renderList("Snippets", snippets)}
        </div>
      </div>
      {toggleButton}
    </div>
  );
};
