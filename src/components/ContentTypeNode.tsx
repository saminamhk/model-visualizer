import React from "react";

import { SourceHandle, TargetHandle } from "./Handles";
import { NodeProps, useReactFlow } from "reactflow";
import { useExpandedNodes } from "../contexts/ExpandedNodesContext";
import {
  ContentTypeNodeData,
  getFilteredElementsData,
  isRelationshipElement,
  isNodeRelated,
  elementTypeMap,
} from "../utils/layout";
import { ActionButton } from "./ActionButton";
import { ContentTypeElements } from "@kontent-ai/management-sdk";
import { useSnippets } from "../contexts/SnippetsContext";

export const ContentTypeNode: React.FC<NodeProps<ContentTypeNodeData>> = ({
  data,
  selected,
}) => {
  const { expandedNodes, toggleNode } = useExpandedNodes();
  const { setNodes, fitView, getEdges } = useReactFlow();
  const { snippets } = useSnippets();

  const expanded = expandedNodes.has(data.id);
  const { filteredElements } = getFilteredElementsData(data);

  const containerStyle: React.CSSProperties = {
    paddingTop: 5,
    paddingBottom: 5,
    border: "1px solid #ddd",
    borderRadius: 16,
    background: selected ? "#f3f3fe" : "white",
    cursor: "pointer",
    minWidth: 250,
    position: "relative",
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
  };

  const isolateRelatedNodes = (e: React.MouseEvent) => {
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

  const renderElements = () => {
    return filteredElements.map((el, i) => {
      if (el.type === "snippet") {
        const snippetEl = el as ContentTypeElements.ISnippetElement;
        const snippet = snippets.find(s => s.id === snippetEl.snippet.id);
        return (
          <div
            key={el.id}
            className="flex items-center justify-between py-1"
            style={{
              borderBottom: i < filteredElements.length - 1 ? "1px solid #ddd" : "none",
            }}
          >
            <div className="font-bold text-xs px-2.5 flex items-center gap-1">
              {snippet?.name || snippetEl.snippet.codename}
            </div>
            <div className="text-xs px-2.5">
              Snippet
            </div>
          </div>
        );
      }

      return (
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
            {el.type !== "guidelines" && el.name}
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
      );
    });
  };

  return (
    <div onClick={() => toggleNode(data.id)} style={containerStyle}>
      <div className="flex justify-between items-center px-2 py-1">
        <div className="font-bold">{data.label}</div>
        <ActionButton
          onClick={isolateRelatedNodes}
          title="Isolate related nodes"
          icon="🔍"
        />
      </div>
      <TargetHandle id="target" />
      {expanded
        ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {renderElements()}
          </div>
        )
        : <SourceHandle id="source" />}
    </div>
  );
};
