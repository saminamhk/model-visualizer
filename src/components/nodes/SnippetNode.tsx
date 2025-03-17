import React from "react";
import { NodeProps, useReactFlow } from "reactflow";
import { SnippetNodeData } from "../../utils/layout";
import { ActionButton } from "../controls/ActionButton";
import { SourceHandle } from "../controls/Handles";
import { useNodeState } from "../../contexts/NodeStateContext";
import { nodeBaseStyle } from "../../utils/layout";
import IconSeparate from "../icons/IconSeparate";

export const SnippetNode: React.FC<NodeProps<SnippetNodeData>> = ({
  data,
  selected,
}) => {
  const { expandedNodes, toggleNode, isolateRelated } = useNodeState();
  const { fitView } = useReactFlow();

  const isExpanded = expandedNodes.has(data.id);

  const handleIsolate = (e: React.MouseEvent) => {
    e.stopPropagation();
    isolateRelated(data.id);
    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  const containerStyle: React.CSSProperties = {
    ...nodeBaseStyle,
    background: selected ? "#f3f3fe" : "white",
    minWidth: 350,
  };

  return (
    <div onClick={() => toggleNode(data.id)} style={containerStyle}>
      <div className="flex justify-between items-center px-2 py-1">
        <div className="font-bold">{data.label}</div>
        <ActionButton
          onClick={handleIsolate}
          title="Show related nodes"
          icon={<IconSeparate />}
        />
      </div>
      {isExpanded
        ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <SourceHandle id="source" />
          </div>
        )
        : <SourceHandle id="source" />}
    </div>
  );
};
