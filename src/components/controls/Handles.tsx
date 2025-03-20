import React from "react";
import { Handle, HandleProps, Position } from "@xyflow/react";

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
