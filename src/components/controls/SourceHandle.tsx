import React from "react";
import { Handle, HandleProps, Position } from "@xyflow/react";

type SourceHandleProps = Omit<HandleProps, "type" | "position">;

export const SourceHandle: React.FC<SourceHandleProps> = (props) => (
  <Handle
    {...props}
    type="source"
    position={Position.Right}
    className="custom-handle right"
    isConnectable={false}
  />
);
