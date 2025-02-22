import { useReactFlow } from "reactflow";
import { isNodeRelated } from "../utils/layout";

export const useNodeIsolation = (nodeId: string) => {
  const { setNodes, fitView, getEdges } = useReactFlow();

  const isolateNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    const edges = getEdges();
    setNodes(nodes =>
      nodes.map(node => ({
        ...node,
        hidden: !isNodeRelated(node.id, nodeId, edges),
      }))
    );
    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  return isolateNode;
};
