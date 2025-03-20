import React from "react";
import { NodeProps, useReactFlow } from "@xyflow/react";
import { SnippetNodeData } from "../../utils/layout";
import { ActionButton } from "../controls/ActionButton";
import { SourceHandle } from "../controls/Handles";
import { useNodeState } from "../../contexts/NodeStateContext";
import { nodeBaseStyle } from "../../utils/layout";
import IconSchemeConnected from "../icons/IconSchemeConnected";
import { ElementRow } from "./ElementRow";
import IconMagnifier from "../icons/Magnifier";
import { useAppContext } from "../../contexts/AppContext";

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

  const { customApp } = useAppContext();

  return (
    <div onClick={() => toggleNode(data.id)} style={containerStyle}>
      <div className="flex text-gray-400 justify-between items-center">
        <div className="text-xs px-2">Snippet</div>
        <a
          className="px-2"
          href={`https://app.kontent.ai/${customApp.context.environmentId}/content-models/snippets/edit/${data.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ActionButton title="Edit snippet" onClick={() => {}} icon="✎" />
        </a>
      </div>
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
