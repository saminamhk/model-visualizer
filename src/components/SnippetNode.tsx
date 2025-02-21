import React from "react";
import { NodeProps, useReactFlow } from "reactflow";
import { useExpandedNodes } from "../contexts/ExpandedNodesContext";
import { isRelationshipElement, isNodeRelated, SnippetNodeData, elementTypeMap } from "../utils/layout";
import { ActionButton } from "./ActionButton";
import { SourceHandle } from "./Handles";

export const SnippetNode: React.FC<NodeProps<SnippetNodeData>> = ({
  data,
  selected,
}) => {
  const { expandedNodes, toggleNode } = useExpandedNodes();
  const { setNodes, fitView, getEdges } = useReactFlow();
  const expanded = expandedNodes.has(data.id);

  const containerStyle: React.CSSProperties = {
    paddingTop: 5,
    paddingBottom: 5,
    border: "1px solid #ddd",
    borderRadius: 16,
    background: selected ? "#f3f3fe" : "white",
    cursor: "pointer",
    minWidth: 350,
    position: "relative",
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
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
      <div className="flex justify-between items-center px-2 py-1">
        <div className="font-bold flex items-center gap-2">
          {data.label}
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
            Snippet
          </span>
        </div>
        <ActionButton
          onClick={showRelatedNodes}
          title="Isolate related nodes"
          icon="🔍"
        />
      </div>
      {expanded && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {data.elements.map((el, i) =>
            el.type !== "guidelines" && el.type !== "snippet" && (
              <div
                key={el.id}
                className="flex items-center justify-between py-1 px-2 relative"
                style={{
                  borderBottom: i < data.elements.length - 1 ? "1px solid #ddd" : "none",
                }}
              >
                <div className="font-bold text-xs">{el.name}</div>
                <div className="text-xs">
                  {elementTypeMap.get(el.type) || el.type}
                </div>
                {isRelationshipElement(el) && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <SourceHandle id={`source-${el.id}`} />
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
