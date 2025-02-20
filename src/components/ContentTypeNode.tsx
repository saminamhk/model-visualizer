import React from "react";

import { SourceHandle, TargetHandle } from "./Handles";
import { ContentTypeElements } from "@kontent-ai/management-sdk";
import { NodeProps, useReactFlow } from "reactflow";
import { useExpandedNodes } from "../contexts/ExpandedNodesContext";
import { ContentTypeNodeData, getFilteredElementsData, isRelationshipElement, isNodeRelated } from "../utils/layout";

type ElementType = ContentTypeElements.ContentTypeElementModel["type"];

type ElementTypeLabels = {
  [K in ElementType]: string;
};

const elementTypeLabels: ElementTypeLabels = {
  text: "Text",
  rich_text: "Rich Text",
  number: "Number",
  multiple_choice: "Multiple Choice",
  date_time: "Date & Time",
  asset: "Asset",
  modular_content: "Linked Items",
  subpages: "Subpages",
  url_slug: "URL Slug",
  guidelines: "Guidelines",
  taxonomy: "Taxonomy",
  custom: "Custom",
  snippet: "Content Type Snippet",
};

const ActionButton: React.FC<{
  onClick: (e: React.MouseEvent) => void;
  title: string;
  icon: string;
}> = ({ onClick, title, icon }) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className="hover:bg-[#f3f3fe] rounded-full p-1 flex items-center justify-center focus:outline-none"
    >
      {icon}
    </button>
    <div className="absolute top-0 left-full transform -translate-y-1/2 -translate-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-[9999]">
      {title}
    </div>
  </div>
);

export const ContentTypeNode: React.FC<NodeProps<ContentTypeNodeData>> = ({
  data,
  selected,
}) => {
  const { expandedNodes, toggleNode } = useExpandedNodes();
  const { setNodes, fitView, getEdges } = useReactFlow();

  const expanded = expandedNodes.has(data.id);
  const { filteredElements } = getFilteredElementsData(data);

  const elementTypeMap: ReadonlyMap<ElementType, string> = new Map(
    Object.entries(elementTypeLabels) as [ElementType, string][],
  );

  const containerStyle: React.CSSProperties = {
    paddingTop: 5,
    paddingBottom: 5,
    border: "1px solid #ddd",
    borderRadius: 16,
    background: selected ? "#f3f3fe" : "white",
    cursor: "pointer",
    minWidth: 250,
    position: "relative",
  };

  const showRelatedNodes = (e: React.MouseEvent) => {
    e.stopPropagation();
    const edges = getEdges();
    setNodes(nodes =>
      nodes.map(node => ({
        ...node,
        hidden: !isNodeRelated(node.id, data.id, edges),
      }))
    );
    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  return (
    <div onClick={() => toggleNode(data.id)} style={containerStyle}>
      {expanded
        ? (
          <div>
            <div className="flex justify-between items-center px-2 py-1">
              <div className="font-bold">{data.label}</div>
              <ActionButton
                onClick={showRelatedNodes}
                title="Isolate related nodes"
                icon="🔍"
              />
            </div>
            <TargetHandle id="target" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              {filteredElements.map(
                (el, i) =>
                  el.type !== "guidelines" && el.type !== "snippet" && (
                    <div
                      key={el.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: 4,
                        paddingBottom: 4,
                        position: "relative",
                        borderBottom: i < filteredElements.length - 1 ? "1px solid #ddd" : "none",
                      }}
                    >
                      <div className="font-bold text-xs px-2.5 flex items-center gap-1">
                        {el.name}
                        {data.selfReferences.includes(el.id ?? "") && (
                          <div className="relative group">
                            <span className="cursor-help text-purple-600">♾️</span>
                            <div className="absolute top-0 left-full transform translate-x-2 ml-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-[9999]">
                              This element can reference its own content type
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-xs px-2.5">
                        {elementTypeMap.get(el.type) || el.type}
                      </div>
                      {isRelationshipElement(el) && <SourceHandle id={`source-${el.id}`} />}
                    </div>
                  ),
              )}
            </div>
          </div>
        )
        : (
          <div className="flex justify-between items-center px-2 py-1">
            <div className="font-bold">{data.label}</div>
            <ActionButton
              onClick={showRelatedNodes}
              title="Isolate related nodes"
              icon="🔍"
            />
            <TargetHandle id="target" />
            <SourceHandle id="source" />
          </div>
        )}
    </div>
  );
};
