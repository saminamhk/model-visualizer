import React from "react";
import { NodeProps } from "reactflow";
import { SnippetNodeData } from "../utils/layout";
import { ActionButton } from "./ActionButton";
import { SourceHandle } from "./Handles";
import { ElementRow } from "./ElementRow";
import { useNodeExpansion } from "../hooks/useNodeExpansion";
import { useNodeIsolation } from "../hooks/useNodeIsolation";
import { nodeBaseStyle } from "../utils/layout";

export const SnippetNode: React.FC<NodeProps<SnippetNodeData>> = ({
  data,
  selected,
}) => {
  const { isExpanded, toggleExpansion } = useNodeExpansion(data.id);
  const isolateNode = useNodeIsolation(data.id);

  const containerStyle: React.CSSProperties = {
    ...nodeBaseStyle,
    background: selected ? "#f3f3fe" : "white",
    minWidth: 350,
  };

  const namedElements = data.elements.filter(
    el => el.type !== "guidelines" && el.type !== "snippet",
  );

  return (
    <div onClick={toggleExpansion} style={containerStyle}>
      <div className="flex justify-between items-center px-2 py-1">
        <div className="font-bold">{data.label}</div>
        <ActionButton
          onClick={isolateNode}
          title="Show related nodes"
          icon="🔍"
        />
      </div>
      {isExpanded
        ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {namedElements.map((el, i) => (
              <ElementRow
                key={el.id}
                element={el}
                isLast={i === namedElements.length - 1}
              />
            ))}
          </div>
        )
        : <SourceHandle id="source" />}
    </div>
  );
};
