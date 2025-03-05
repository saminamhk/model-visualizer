import { useEffect } from "react";
import { Edge, Node } from "reactflow";
import { getLayoutedElements, isNodeRelated } from "../utils/layout";
import { NodeIsolation } from "../utils/layout";

export const useNodeLayout = (
  nodes: Node[],
  edges: Edge[],
  selectedNodeId: string | null,
  expandedNodes: Set<string>,
  isolation: NodeIsolation,
  setNodes: (nodes: Node[]) => void,
) => {
  useEffect(() => {
    const updatedNodes = nodes.map(node => ({
      ...node,
      selected: node.id === selectedNodeId,
      data: {
        ...node.data,
        isExpanded: expandedNodes.has(node.id),
      },
      hidden: (() => {
        if (!isolation) return false;
        switch (isolation.mode) {
          case "related":
            return !isNodeRelated(node.id, isolation.nodeId, edges);
          case "single":
            return node.id !== isolation.nodeId;
          default:
            return false;
        }
      })(),
    }));

    const visibleNodes = updatedNodes.filter(node => !node.hidden);
    const visibleEdges = edges.filter(
      edge =>
        visibleNodes.some(node => node.id === edge.source)
        && visibleNodes.some(node => node.id === edge.target),
    );

    setNodes(getLayoutedElements(visibleNodes, visibleEdges).nodes);
  }, [selectedNodeId, isolation, expandedNodes, nodes, edges, setNodes]);
};
