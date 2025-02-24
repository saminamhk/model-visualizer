import React from "react";
import { NodeProps, useReactFlow } from "reactflow";
import { SourceHandle, TargetHandle } from "./Handles";
import { useEntities } from "../../contexts/EntityContext";
import { ContentTypeNodeData, nodeBaseStyle } from "../../utils/layout";
import { ActionButton } from "./ActionButton";
import { ElementRow } from "./ElementRow";
import { useNodeState } from "../../contexts/NodeStateContext";
import IconSchemeConnected from "../icons/IconSchemeConnected";

export const ContentTypeNode: React.FC<NodeProps<ContentTypeNodeData>> = ({
  data,
  selected,
}) => {
  const { expandedNodes, toggleNode, isolateNode } = useNodeState();
  const { fitView } = useReactFlow();
  const { snippets } = useEntities();

  const isExpanded = expandedNodes.has(data.id);

  const handleIsolate = (e: React.MouseEvent) => {
    e.stopPropagation();
    isolateNode(data.id);
    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  const containerStyle: React.CSSProperties = {
    ...nodeBaseStyle,
    background: selected ? "#f3f3fe" : "white",
    minWidth: 250,
  };

  const filteredElements = data.elements.filter(el => el.type !== "guidelines");

  return (
    <div onClick={() => toggleNode(data.id)} style={containerStyle}>
      <div className="flex justify-between items-center px-2 py-1">
        <div className="font-bold">{data.label}</div>
        <ActionButton
          onClick={handleIsolate}
          title="Show related nodes"
          iconComponent={<IconSchemeConnected />}
        />
      </div>
      <TargetHandle id="target" />
      {isExpanded
        ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filteredElements
              .map((el, i) => (
                <ElementRow
                  key={el.id}
                  element={el.type === "snippet"
                    ? {
                      ...el,
                      name: snippets.find(s => s.id === el.snippet?.id)?.name ?? "Unknown Snippet",
                    }
                    : el}
                  isLast={i === filteredElements.length - 1}
                />
              ))}
          </div>
        )
        : <SourceHandle id="source" />}
    </div>
  );
};
