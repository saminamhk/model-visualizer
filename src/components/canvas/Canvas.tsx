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
  const { contentTypes, snippets, showSnippets } = useEntities();
  const { expandedNodes, isolatedNodeId } = useNodeState();
  const { setNodes } = useReactFlow();
  const processedGraph = useGraphData(contentTypes, snippets);

  useNodeLayout(
    processedGraph,
    selectedNodeId,
    expandedNodes,
    isolatedNodeId,
    showSnippets,
    setNodes,
  );

  return (
    <div className="flex h-full w-full">
      <Sidebar types={contentTypes} snippets={snippets} onMenuSelect={onNodeSelect} />
      <div className="flex-1 w-full h-full pb-12">
        <Toolbar />
        <ReactFlow
          defaultNodes={[]}
          edges={showSnippets
            ? [...processedGraph.typeEdges, ...processedGraph.snippetEdges]
            : processedGraph.typeEdges}
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
