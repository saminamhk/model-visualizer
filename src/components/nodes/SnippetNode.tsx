import React from "react";
import { NodeProps, useReactFlow } from "reactflow";
import { SnippetNodeData } from "../../utils/layout";
import { ActionButton } from "../controls/ActionButton";
import { SourceHandle } from "../controls/Handles";
import { useNodeState } from "../../contexts/NodeStateContext";
import { nodeBaseStyle } from "../../utils/layout";
import IconSchemeConnected from "../icons/IconSchemeConnected";
import { ElementRow } from "./ElementRow";
import IconMagnifier from "../icons/Magnifier";

export const SnippetNode: React.FC<NodeProps<SnippetNodeData>> = ({
  data,
  selected,
}) => {
  const { expandedNodes, toggleNode, isolateRelated, isolateSingle } = useNodeState();
  const { fitView } = useReactFlow();

  const isExpanded = expandedNodes.has(data.id);

  const handleIsolateRelated = (e: React.MouseEvent) => {
    e.stopPropagation();
    isolateRelated(data.id);
    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  const handleIsolateSingle = (e: React.MouseEvent) => {
    e.stopPropagation();
    isolateSingle(data.id);
    toggleNode(data.id);
    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  const containerStyle: React.CSSProperties = {
    ...nodeBaseStyle,
    background: selected ? "#f3f3fe" : "white",
    minWidth: 250,
  };

  const filteredElements = data.elements.filter(el => el.type !== "guidelines" && el.type !== "snippet");

  return (
    <div onClick={() => toggleNode(data.id)} style={containerStyle}>
      <div className="text-xs text-gray-400 px-2">Snippet</div>
      <div className="flex justify-between items-center px-2 py-1">
        <div className="font-bold">{data.label}</div>
        <span className="flex-1"></span>
        <ActionButton
          onClick={handleIsolateRelated}
          title="Show related nodes"
          icon={<IconSchemeConnected />}
        />
        <ActionButton
          onClick={handleIsolateSingle}
          title="Isolate node"
          icon={<IconMagnifier />}
        />
      </div>
      {isExpanded
        ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filteredElements
              .map((el, i) => (
                <ElementRow
                  key={el.id}
                  element={{ ...el, fromSnippet: false, name: el.name ?? "" }}
                  isLast={i === filteredElements.length - 1}
                />
              ))}
            <SourceHandle id="source" />
          </div>
        )
        : <SourceHandle id="source" />}
    </div>
  );
};
