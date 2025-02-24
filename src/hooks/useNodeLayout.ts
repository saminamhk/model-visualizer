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
    console.log("useNodeLayout called");
    const typeNodes = processedGraph.typeNodes.map(node => ({
      ...node,
      selected: node.id === selectedNodeId,
      data: {
        ...node.data,
        isExpanded: expandedNodes.has(node.id),
      },
      hidden: isolatedNodeId ? !isNodeRelated(node.id, isolatedNodeId, processedGraph.edges) : false,
    }));

    const typeEdges = processedGraph.edges.filter(edge => edge.edgeType === "contentType");

    if (!showSnippets) {
      setNodes(getLayoutedElements(typeNodes, typeEdges).nodes);
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
        ? !isNodeRelated(node.id, isolatedNodeId, processedGraph.edges)
        : false,
    }));



    setNodes(getLayoutedElements([...typeNodes, ...snippetNodes], processedGraph.edges).nodes);
  }, [isolatedNodeId, showSnippets, setNodes]);
};
