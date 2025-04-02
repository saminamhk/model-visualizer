import React from "react";
import { Handle, HandleProps, Position } from "@xyflow/react";

type TargetHandleProps = Omit<HandleProps, "type" | "position">;

export const TargetHandle: React.FC<TargetHandleProps> = (props) => (
  <Handle
    {...props}
    type="target"
    position={Position.Left}
    className="custom-handle left"
    isConnectable={false}
  />
);
