import React from "react";
import { NodeProps } from "reactflow";
import { SourceHandle, TargetHandle } from "./Handles";
import { useEntities } from "../contexts/EntityContext";
import { ContentTypeNodeData, getFilteredElementsData, nodeBaseStyle } from "../utils/layout";
import { ActionButton } from "./ActionButton";
import { ElementRow } from "./ElementRow";
import { useNodeExpansion } from "../hooks/useNodeExpansion";
import { useNodeIsolation } from "../hooks/useNodeIsolation";

export const ContentTypeNode: React.FC<NodeProps<ContentTypeNodeData>> = ({
  data,
  selected,
}) => {
  const { isExpanded, toggleExpansion } = useNodeExpansion(data.id);
  const isolateNode = useNodeIsolation(data.id);
  const { filteredElements } = getFilteredElementsData(data);
  const { snippets } = useEntities();

  const containerStyle: React.CSSProperties = {
    ...nodeBaseStyle,
    background: selected ? "#f3f3fe" : "white",
    minWidth: 250,
  };

  return (
    <div onClick={toggleExpansion} style={containerStyle}>
      <div className="flex justify-between items-center px-2 py-1">
        <div className="font-bold">{data.label}</div>
        <ActionButton
          onClick={isolateNode}
          title="Isolate related nodes"
          icon="🔍"
        />
      </div>
      <TargetHandle id="target" />
      {isExpanded
        ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filteredElements
              .filter(el => el.type !== "guidelines")
              .map((el, i, arr) => (
                <ElementRow
                  key={el.id}
                  element={el.type === "snippet"
                    ? {
                      ...el,
                      name: snippets.find(s => s.id === el.snippet?.id)?.name ?? "Unknown Snippet",
                    }
                    : el}
                  isLast={i === arr.length - 1}
                />
              ))}
          </div>
        )
        : <SourceHandle id="source" />}
    </div>
  );
};
