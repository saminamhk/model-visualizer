import { useExpandedNodes } from "../contexts/ExpandedNodesContext";

export const useNodeExpansion = (nodeId: string) => {
  const { expandedNodes, toggleNode } = useExpandedNodes();
  const isExpanded = expandedNodes.has(nodeId);

  return {
    isExpanded,
    toggleExpansion: () => toggleNode(nodeId),
  };
};
