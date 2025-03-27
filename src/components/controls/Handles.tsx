import React from "react";
import { Handle, HandleProps, Position } from "@xyflow/react";
import { Element } from "../../utils/types/mapi";

type CustomHandleProps = Omit<HandleProps, "type" | "position">;

export const SourceHandle: React.FC<CustomHandleProps> = (props) => (
  <Handle
    {...props}
    id={`${props.id}`}
    type="source"
    position={Position.Right}
    className="custom-handle right"
    isConnectable={false}
  />
);

export const TargetHandle: React.FC<CustomHandleProps> = (props) => (
  <Handle
    {...props}
    id={`${props.id}`}
    type="target"
    position={Position.Left}
    className="custom-handle left"
    isConnectable={false}
  />
);

export const renderCollapsedHandles = (element: Element) => {
  switch (element.type) {
    case "taxonomy":
    case "snippet":
      return <TargetHandle key={element.id} id={`target-${element.id}`} />;
    case "modular_content":
    case "subpages":
    case "rich_text":
      return <SourceHandle key={element.id} id={`source-${element.id}`} />;
    default:
      return null;
  }
};
