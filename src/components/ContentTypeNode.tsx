// src/components/ContentTypeNode.tsx
import React, { useEffect, useRef, useState } from "react";

import { SourceHandle, TargetHandle } from "./Handles";
import { ContentTypeElements } from "@kontent-ai/management-sdk";
import { NodeProps } from "reactflow";

type ContentTypeNodeData = {
  label: string;
  elements: ContentTypeElements.ContentTypeElementModel[];
};

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
  const [expanded, setExpanded] = useState(false);

  const { filteredElements, hasSnippet } = data.elements.reduce(
    (acc, el) => ({
      filteredElements: el.type !== "guidelines" && el.type !== "snippet" 
        ? [...acc.filteredElements, el]
        : acc.filteredElements,
      hasSnippet: acc.hasSnippet || el.type === "snippet"
    }), 
    { 
      filteredElements: [] as ContentTypeElements.ContentTypeElementModel[], 
      hasSnippet: false 
    }
  );

  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation(); // differ between dragging and clicking
    setExpanded((prev) => !prev);
  };

  const isRelationshipElement = (
    element: ContentTypeElements.ContentTypeElementModel,
  ) =>
    element.type === "modular_content"
    || element.type === "subpages"
    || element.type === "rich_text";

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
    minWidth: 250, // fallback to 150 if measurement isn't ready
    position: "relative",
  };

  return (
    <div onClick={toggleExpanded} style={containerStyle}>
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
                      {/* Left column: element name */}
                      <div className="font-bold text-xs px-2.5">
                        {el.name}
                      </div>
                      {/* Right column: element type */}
                      <div className="text-xs px-2.5">
                        {elementTypeMap.get(el.type) || el.type}
                      </div>
                      {isRelationshipElement(el) && <SourceHandle id={`source-${el.id}`} />}
                    </div>
                  ),
              )}
              {hasSnippet && <div className="text-center text-sm font-bold p-2">Snippets</div>}
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
