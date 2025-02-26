import { useEffect } from "react";
import { Node } from "reactflow";
import { ProcessedGraph } from "../utils/layout";
import { getLayoutedElements, isNodeRelated } from "../utils/layout";

export const useNodeLayout = (
  processedGraph: ProcessedGraph,
  selectedNodeId: string | null,
  expandedNodes: Set<string>,
  isolatedNodeId: string | null,
  setNodes: (nodes: Node[]) => void,
) => {
  useEffect(() => {
    console.log("useNodeLayout called");
    const typeNodes = processedGraph.nodes.map(node => ({
      ...node,
      selected: node.id === selectedNodeId,
      data: {
        ...node.data,
        isExpanded: expandedNodes.has(node.id),
      },
      hidden: isolatedNodeId ? !isNodeRelated(node.id, isolatedNodeId, processedGraph.edges) : false,
    }));

    setNodes(getLayoutedElements(typeNodes, processedGraph.edges).nodes);
  }, [processedGraph, selectedNodeId, expandedNodes, isolatedNodeId, setNodes]);
};
