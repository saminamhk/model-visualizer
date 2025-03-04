import React from "react";
import ReactFlow, { MiniMap, Controls, Background, applyNodeChanges, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import { useEntities } from "../../contexts/EntityContext";
import { useGraphData } from "../../hooks/useGraphData";
import { Toolbar } from "./Toolbar";
import { Sidebar } from "./Sidebar";
import { nodeTypes } from "../../utils/layout";
import { useNodeState } from "../../contexts/NodeStateContext";
import { useNodeLayout } from "../../hooks/useNodeLayout";

type CanvasProps = {
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string) => void;
};

export const Canvas: React.FC<CanvasProps> = ({
  selectedNodeId,
  onNodeSelect,
}) => {
  const { contentTypes, snippets, typesWithSnippets } = useEntities();
  const { expandedNodes, isolationMode } = useNodeState();
  const { setNodes } = useReactFlow();
  const { nodes, edges } = useGraphData(typesWithSnippets);

  useNodeLayout(nodes, edges, selectedNodeId, expandedNodes, isolationMode, setNodes);

  return (
    <div className="flex h-full w-full">
      <Sidebar types={contentTypes} snippets={snippets} onMenuSelect={onNodeSelect} />
      <div className="flex-1 w-full h-full pb-14">
        <Toolbar />
        <ReactFlow
          defaultNodes={[]}
          edges={edges}
          onNodesChange={(changes) => setNodes(nodes => applyNodeChanges(changes, nodes))}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => onNodeSelect(node.id)}
          fitView
        >
          <MiniMap pannable />
          <Controls />
          <Background id="background-1" color="grey" gap={20} />
        </ReactFlow>
      </div>
    </div>
  );
};
