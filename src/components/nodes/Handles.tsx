import React from "react";
import { Handle, HandleProps, Position } from "reactflow";

type CustomHandleProps = Omit<HandleProps, "type" | "position">;

export const SourceHandle: React.FC<CustomHandleProps> = (props) => (
  <Handle
    {...props}
    id={`${props.id}`}
    type="source"
    position={Position.Right}
    className="custom-handle right"
  />
);

export const TargetHandle: React.FC<CustomHandleProps> = (props) => (
  <Handle
    {...props}
    id={`${props.id}`}
    type="target"
    position={Position.Left}
    className="custom-handle left"
  />
);
