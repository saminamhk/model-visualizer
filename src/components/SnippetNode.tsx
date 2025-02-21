import React from "react";
import { NodeProps, Position, Handle, useReactFlow } from "reactflow";
import { useExpandedNodes } from "../contexts/ExpandedNodesContext";
import { isRelationshipElement, isNodeRelated, SnippetNodeData } from "../utils/layout";
import { ActionButton } from "./ActionButton";

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
            <Handle
              type="source"
              position={Position.Right}
              id="source"
              className="custom-handle right"
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              {data.elements.map((el, i) =>
                el.type !== "guidelines" && el.type !== "snippet" && (
                  <div
                    key={el.id}
                    className="flex items-center justify-between py-1 px-2"
                    style={{
                      borderBottom: i < data.elements.length - 1 ? "1px solid #ddd" : "none",
                    }}
                  >
                    <div className="font-bold text-xs">{el.name}</div>
                    <div className="text-xs">
                      {el.type}
                    </div>
                    {isRelationshipElement(el) && (
                      <Handle
                        type="source"
                        position={Position.Right}
                        id={`source-${el.id}`}
                        className="custom-handle right"
                      />
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )
        : (
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
            <Handle
              type="source"
              position={Position.Right}
              id="source"
              className="custom-handle right"
            />
          </div>
        )}
    </div>
  );
};
