import React from "react";

import { SourceHandle, TargetHandle } from "./Handles";
import { ContentTypeElements } from "@kontent-ai/management-sdk";
import { NodeProps } from "reactflow";
import { useExpandedNodes } from "../contexts/ExpandedNodesContext";
import { ContentTypeNodeData, getFilteredElementsData, isRelationshipElement } from "../utils/layout";

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

export const ContentTypeNode: React.FC<NodeProps<ContentTypeNodeData>> = ({
  data,
  selected,
}) => {
  const { expandedNodes, toggleNode } = useExpandedNodes();
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

  return (
    <div onClick={() => toggleNode(data.id)} style={containerStyle}>
      {expanded
        ? (
          <div>
            <div className="font-bold p-2 text-center">{data.label}</div>
            {/* Render a single incoming handle on the left border */}
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
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
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
              {data.elements.some(el => el.type === "snippet") && (
                <div className="text-center text-sm font-bold p-2">Snippets</div>
              )}
            </div>
          </div>
        )
        : (
          // Collapsed view: one incoming and one outgoing (aggregated) handle.
          <div className="font-bold p-2 text-center">
            <div>{data.label}</div>
            <TargetHandle id="target" />
            <SourceHandle id="source" />
          </div>
        )}
    </div>
  );
};
