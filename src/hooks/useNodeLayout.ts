import { useEffect } from "react";
import { Node } from "reactflow";
import { ProcessedGraph } from "../utils/layout";
import { getLayoutedElements, isNodeRelated } from "../utils/layout";

export const useNodeLayout = (
  processedGraph: ProcessedGraph,
  selectedNodeId: string | null,
  expandedNodes: Set<string>,
  isolatedNodeId: string | null,
  showSnippets: boolean,
  setNodes: (nodes: Node[]) => void,
) => {
  useEffect(() => {
    const typeNodes = processedGraph.typeNodes.map(node => ({
      ...node,
      selected: node.id === selectedNodeId,
      data: {
        ...node.data,
        isExpanded: expandedNodes.has(node.id),
      },
      hidden: isolatedNodeId ? !isNodeRelated(node.id, isolatedNodeId, processedGraph.typeEdges) : false,
    }));

    if (!showSnippets) {
      setNodes(getLayoutedElements(typeNodes, processedGraph.typeEdges).nodes);
      return;
    }

    const snippetNodes = processedGraph.snippetNodes.map(node => ({
      ...node,
      selected: node.id === selectedNodeId,
      data: {
        ...node.data,
        isExpanded: expandedNodes.has(node.id),
      },
      hidden: isolatedNodeId
        ? !isNodeRelated(node.id, isolatedNodeId, [...processedGraph.typeEdges, ...processedGraph.snippetEdges])
        : false,
    }));

    const allNodes = [
      ...getLayoutedElements(typeNodes, processedGraph.typeEdges).nodes,
      ...getLayoutedElements(snippetNodes, processedGraph.snippetEdges, "LR").nodes.map(node => ({
        ...node,
        position: {
          x: node.position.x - 300,
          y: node.position.y,
        },
      })),
    ];

    setNodes(allNodes);
  }, [processedGraph, selectedNodeId, expandedNodes, isolatedNodeId, showSnippets, setNodes]);
};
