import React from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import { useExpandedNodes } from "../contexts/ExpandedNodesContext";
import { useEntities } from "../contexts/EntityContext";
import { useGraphData } from "../hooks/useGraphData";
import { useNodeState } from "../hooks/useNodeState";
import { Toolbar } from "./Toolbar";
import { Sidebar } from "./Sidebar";
import { nodeTypes } from "../utils/layout";

type CanvasProps = {
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string) => void;
};

export const Canvas: React.FC<CanvasProps> = ({
  selectedNodeId,
  onNodeSelect,
}) => {
  const { expandedNodes } = useExpandedNodes();
  const { showSnippets, contentTypes, snippets } = useEntities();

  const processedGraph = useGraphData(contentTypes, snippets);
  const { nodes, onNodesChange } = useNodeState(
    processedGraph,
    selectedNodeId,
    expandedNodes,
    showSnippets,
  );

  return (
    <div className="flex h-full w-full">
      <Sidebar types={contentTypes} snippets={snippets} onMenuSelect={onNodeSelect} />
      <div className="flex-1 w-full h-full pb-12">
        <Toolbar />
        <ReactFlow
          nodes={nodes}
          edges={showSnippets
            ? [...processedGraph.typeEdges, ...processedGraph.snippetEdges]
            : processedGraph.typeEdges}
          onNodesChange={onNodesChange}
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
