import React from "react";
import { useReactFlow } from "@xyflow/react";
import { useCanvas } from "../../contexts/CanvasContext";
import { delayTwoAnimationFrames, nodeBaseStyle } from "../../utils/layout";
import { useAppContext } from "../../contexts/AppContext";
import { ActionButton } from "../controls/ActionButton";
import IconSchemeConnected from "../icons/IconSchemeConnected";
import IconMagnifier from "../icons/IconMagnifier";
import { SourceHandle } from "../controls/Handles";
import { InfoBadge } from "../controls/InfoBadge";
import IconWarning from "../icons/IconWarning";
import { BaseCustomNode } from "../../utils/types/layout";

type TaxonomyNodeData = BaseCustomNode<{
  isExpanded?: boolean;
  terms: ReadonlyArray<string>; // rendering only first level terms seems sufficient in this case
}>;

export const TaxonomyNode: React.FC<TaxonomyNodeData> = ({ data, selected }) => {
  const { expandedNodes, toggleNode, isolateRelated, isolateSingle } = useCanvas();
  const { fitView } = useReactFlow();
  const { customApp } = useAppContext();

  const isExpanded = expandedNodes.has(data.id);

  const handleIsolateRelated = (e: React.MouseEvent) => {
    e.stopPropagation();
    isolateRelated(data.id);
    delayTwoAnimationFrames(() => fitView({ duration: 800 }));
  };

  const handleIsolateSingle = (e: React.MouseEvent) => {
    e.stopPropagation();
    isolateSingle(data.id);
    toggleNode(data.id, true);
    requestAnimationFrame(() => fitView({ duration: 800 }));
  };

  const containerStyle: React.CSSProperties = {
    ...nodeBaseStyle,
    background: selected ? "#f3f3fe" : "white",
    minWidth: 250,
  };

  return (
    <div onClick={() => toggleNode(data.id)} style={containerStyle}>
      <div className="flex text-gray-400 justify-between items-center">
        <div className="text-xs px-2">Taxonomy</div>
        <a
          className="px-2"
          href={`https://app.kontent.ai/${customApp.context.environmentId}/content-models/taxonomy/edit/${data.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ActionButton title="Edit taxonomy" onClick={() => {}} icon="✎" />
        </a>
      </div>
      <div className="flex justify-between items-center px-2 py-1">
        <div className="font-bold">{data.label}</div>
        <span className="flex-1"></span>
        {isExpanded && (
          <InfoBadge
            title="Only first level terms shown."
            icon={<IconWarning />}
            className="text-sm"
          />
        )}
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
      <SourceHandle id={`source-${data.id}`} />
      {isExpanded
        ? (
          <ul className="px-2 list-disc list-inside marker:text-[#5b4ff5] text-xs">
            {data.terms.map((term) => (
              <li key={term} className="py-1">
                <span className="relative left-[-5px]">{term}</span>
              </li>
            ))}
          </ul>
        )
        : null}
    </div>
  );
};
