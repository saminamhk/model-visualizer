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
  NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Toolbar } from "./Toolbar";
import { Sidebar } from "./Sidebar";
import { getLayoutedElements, isNodeRelated, nodeTypes } from "../../utils/layout";
import { useNodeState } from "../../contexts/NodeStateContext";
import { BaseCustomNode } from "../../utils/types/layout";

type CanvasProps = {
  initialNodes: Node[];
  initialEdges: Edge[];
};

export const Canvas: React.FC<CanvasProps> = ({
  initialNodes,
  initialEdges,
}) => {
  const { expandedNodes, isolation, includeRichText } = useNodeState();
  const { setNodes, getNodes, getEdges } = useReactFlow();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleNodeSelect = useCallback((node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const handleLayout = useCallback((nodes: Node[], edges: Edge[]) => {
    const layoutedNodes = getLayoutedElements(nodes, edges).nodes;
    setNodes(layoutedNodes);
  }, [setNodes]);

  const updatedNodes: Node[] = useMemo(() =>
    initialNodes.map(node => ({
      ...node,
      selected: node.id === selectedNodeId,
      data: {
        ...node.data,
        isExpanded: expandedNodes.has(node.id),
      },
      hidden: isolation
        ? isolation.mode === "related"
          ? !isNodeRelated(node.id, isolation.nodeId, initialEdges)
          : node.id !== isolation.nodeId
        : node.hidden,
    })), [selectedNodeId, expandedNodes, isolation, initialEdges, initialNodes]);

  const updatedEdges: Edge[] = useMemo(() =>
    initialEdges.map(edge => ({
      ...edge,
      hidden: edge.data?.isRichTextEdge ? !includeRichText : edge.hidden,
    })), [initialEdges, includeRichText]);

  useEffect(() => {
    handleLayout(updatedNodes, updatedEdges);
  }, [handleLayout, isolation, updatedNodes, updatedEdges, includeRichText]);

  // Handle node changes and trigger layout when dimensions change
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    if (changes.some(c => c.type === "dimensions")) {
      handleLayout(getNodes(), getEdges());
    } else {
      setNodes(nodes => applyNodeChanges(changes, nodes));
    }
  }, [getNodes, setNodes, getEdges, handleLayout]);

  return (
    <div className="flex h-full w-full">
      <Sidebar
        nodes={updatedNodes.filter(node => !node.hidden) as BaseCustomNode[]}
        onMenuSelect={setSelectedNodeId}
      />
      <div className="flex-1 w-full h-full pb-14">
        <Toolbar />
        <ReactFlow
          defaultNodes={updatedNodes}
          edges={updatedEdges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => handleNodeSelect(node)}
          onNodesChange={handleNodesChange}
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
