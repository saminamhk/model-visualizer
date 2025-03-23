import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  useReactFlow,
  Node,
  Edge,
  useNodesInitialized,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Toolbar } from "./Toolbar";
import { Sidebar } from "./Sidebar";
import { getLayoutedElements, isNodeRelated, nodeTypes } from "../../utils/layout";
import { useNodeState } from "../../contexts/NodeStateContext";

type CanvasProps = {
  nodes: Node[];
  edges: Edge[];
  types: any[]; // We'll type this properly when adding snippet support
};

export const Canvas: React.FC<CanvasProps> = ({
  nodes,
  edges,
  types,
}) => {
  const { expandedNodes, isolation } = useNodeState();
  const { setNodes, getNodes, getEdges } = useReactFlow();
  const nodesInitialized = useNodesInitialized();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleNodeSelect = useCallback((node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  // TODO: optimize these two useEffects

  useEffect(() => {
    if (nodesInitialized) {
      setNodes(getLayoutedElements(getNodes(), getEdges()).nodes);
    }
  }, [nodesInitialized, getEdges, getNodes, setNodes]);

  const updatedNodes: Node[] = useMemo(() =>
    nodes.map(node => ({
      ...node,
      selected: node.id === selectedNodeId,
      data: {
        ...node.data,
        isExpanded: expandedNodes.has(node.id),
      },
      hidden: isolation
        ? isolation.mode === "related"
          ? !isNodeRelated(node.id, isolation.nodeId, edges)
          : node.id !== isolation.nodeId
        : false,
    })), [nodes, selectedNodeId, expandedNodes, isolation, edges]);

  useEffect(() => {
    console.log("nodes");
    setNodes(getLayoutedElements(updatedNodes, getEdges()).nodes);
  }, [updatedNodes, getEdges, setNodes]);

  return (
    <div className="flex h-full w-full">
      <Sidebar types={types} onMenuSelect={setSelectedNodeId} />
      <div className="flex-1 w-full h-full pb-14">
        <Toolbar />
        <ReactFlow
          defaultNodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => handleNodeSelect(node)}
          onNodesChange={(changes) => {
            console.log("changes", changes);
            return setNodes(nodes => applyNodeChanges(changes, nodes));
          }}
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
