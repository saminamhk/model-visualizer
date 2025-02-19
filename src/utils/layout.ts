import dagre from "dagre";
import { Node, Edge } from "reactflow";

const nodeWidth = 172;
const nodeHeight = 36;

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "LR",
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Configure graph spacing options.
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 50, // increase horizontal spacing
    ranksep: 200, // increase vertical spacing
  });

  // Set each node in the Dagre graph. Adjust width and height if nodes are larger.
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Set each edge in the Dagre graph.
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Run Dagre layout
  dagre.layout(dagreGraph);

  // Update node positions based on Dagre's calculations.
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
