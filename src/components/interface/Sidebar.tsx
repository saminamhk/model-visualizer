import React, { useState, useRef, useEffect, useMemo } from "react";
import { useReactFlow } from "@xyflow/react";
import { SidebarSection } from "./SidebarSection";
import IconChevronDoubleRight from "../icons/IconChevronDoubleRight";
import IconChevronDoubleLeft from "../icons/IconChevronDoubleLeft";
import { BaseCustomNode } from "../../utils/types/layout";

type SidebarItem = {
  id: string;
  name: string;
  type: "contentType" | "snippet" | "taxonomy";
};

type SidebarProps = {
  nodes: ReadonlyArray<BaseCustomNode>;
  onMenuSelect: (typeId: string) => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ nodes, onMenuSelect }) => {
  const { fitView } = useReactFlow();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const sideBarSectionRef = useRef<HTMLDivElement>(null);

  // Group nodes by type
  const groupedNodes = useMemo(() =>
    nodes.reduce((acc, node) => {
      if (!node.hidden) { // Only include visible nodes
        const item: SidebarItem = {
          id: node.id,
          name: node.data.label,
          type: node.type,
        };

        if (!acc[node.type]) {
          acc[node.type] = [];
        }
        acc[node.type].push(item);
      }
      return acc;
    }, {} as Record<string, SidebarItem[]>), [nodes]);

  // Filter nodes based on search term
  const filterItems = (items: ReadonlyArray<SidebarItem>) =>
    items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSidebarSelection = (typeId: string) => {
    onMenuSelect(typeId);
    const node = nodes.find(n => n.id === typeId);
    if (node) {
      fitView({ duration: 800, nodes: [node] });
    }
  };

  const checkScroll = () => {
    if (sideBarSectionRef.current) { // display scroll indicator (fade out) if there is a scrollbar
      const { scrollHeight, clientHeight, scrollTop } = sideBarSectionRef.current;
      setShowScrollIndicator(scrollHeight > clientHeight && scrollHeight - clientHeight - scrollTop > 10);
    }
  };

  useEffect(() => {
    checkScroll();
  }, [nodes, searchTerm]);

  return (
    <div className="relative flex">
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "w-0" : "w-72"
        } border-r border-gray-200 relative z-10 top-0 shadow-lg shadow-neutral-300 overflow-hidden bg-white`}
      >
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-1 content-center h-14">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 px-2 focus:outline-none"
          />
        </div>
        <div
          ref={sideBarSectionRef}
          onScroll={checkScroll}
          className={`w-72 transition-transform duration-300 ${
            isCollapsed ? "-translate-x-full" : "translate-x-0"
          } h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']`}
        >
          {groupedNodes.contentType && (
            <SidebarSection
              title="Content Types"
              items={filterItems(groupedNodes.contentType)}
              onItemSelect={handleSidebarSelection}
            />
          )}

          {groupedNodes.snippet && (
            <SidebarSection
              title="Snippets"
              items={filterItems(groupedNodes.snippet)}
              onItemSelect={handleSidebarSelection}
            />
          )}

          {groupedNodes.taxonomy && (
            <SidebarSection
              title="Taxonomies"
              items={filterItems(groupedNodes.taxonomy)}
              onItemSelect={handleSidebarSelection}
            />
          )}
        </div>
        <span className="mb-15"></span>
        {showScrollIndicator && (
          <div
            className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent, white)",
            }}
          />
        )}
      </div>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white border-[#5b4ff5] border-2 rounded-full w-9 h-9 hover:bg-[#e7e6ff] transition-all duration-300 z-40 flex items-center justify-center"
      >
        {isCollapsed ? <IconChevronDoubleRight /> : <IconChevronDoubleLeft />}
      </button>
    </div>
  );
};
