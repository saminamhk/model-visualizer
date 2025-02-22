import { useCallback, useState, useEffect } from "react";
import { Node, NodeChange, applyNodeChanges } from "reactflow";
import { getLayoutedElements, ProcessedGraph, isNodeRelated } from "../utils/layout";

export const useNodeState = (
  processedGraph: ProcessedGraph,
  selectedNodeId: string | null,
  expandedNodes: Set<string>,
  showSnippets: boolean,
) => {
  const getLayoutedNodes = useCallback(() => {
    const typeNodes = processedGraph.typeNodes.map(node => ({
      ...node,
      selected: node.id === selectedNodeId,
      data: {
        ...node.data,
        isExpanded: expandedNodes.has(node.id),
      },
    }));

    const layoutedTypes = getLayoutedElements(typeNodes, processedGraph.typeEdges).nodes;

    if (!showSnippets) return layoutedTypes;

    const snippetNodes = processedGraph.snippetNodes.map(node => ({
      ...node,
      selected: node.id === selectedNodeId,
      data: {
        ...node.data,
        isExpanded: expandedNodes.has(node.id),
      },
    }));

    const layoutedSnippets = getLayoutedElements(snippetNodes, processedGraph.snippetEdges, "LR").nodes
      .map(node => ({
        ...node,
        position: {
          x: node.position.x - 500,
          y: node.position.y,
        },
      }));

    return [...layoutedTypes, ...layoutedSnippets];
  }, [processedGraph, selectedNodeId, expandedNodes, showSnippets]);

  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(() => {
    setNodes(getLayoutedNodes());
  }, [getLayoutedNodes]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes(nodes => applyNodeChanges(changes, nodes)),
    [],
  );

  // Update expansion state without full re-layout
  const updateExpansion = useCallback((nodeId: string, isExpanded: boolean) => {
    setNodes(nodes =>
      nodes.map(node =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, isExpanded } }
          : node
      )
    );
  }, []);

  // Handle node isolation
  const isolateNode = useCallback((nodeId: string) => {
    const edges = [...processedGraph.typeEdges, ...processedGraph.snippetEdges];
    setNodes(nodes =>
      nodes.map(node => ({
        ...node,
        hidden: !isNodeRelated(node.id, nodeId, edges),
      }))
    );
  }, [processedGraph.typeEdges, processedGraph.snippetEdges]);

  // Reset isolation
  const resetIsolation = useCallback(() => {
    setNodes(nodes =>
      nodes.map(node => ({
        ...node,
        hidden: false,
      }))
    );
  }, []);

  return {
    nodes,
    onNodesChange,
    updateExpansion,
    isolateNode,
    resetIsolation,
  };
};
