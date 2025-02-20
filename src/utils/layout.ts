import { ContentTypeElements } from "@kontent-ai/management-sdk";
import dagre from "dagre";
import { Node, Edge } from "reactflow";

const nodeWidth = 172;

type Element = ContentTypeElements.ContentTypeElementModel;

type NodeCalculation = {
  height: number;
  filteredElements: Element[];
};

export type ContentTypeNodeData = {
  id: string;
  label: string;
  elements: Element[];
  isExpanded?: boolean;
  selfReferences: string[]; // Array of element IDs that self-reference
};

// Helper to calculate node height and filter elements
export const getFilteredElementsData = (data: ContentTypeNodeData): NodeCalculation => {
  const filteredElements = data.elements.filter(element =>
    element.type !== "guidelines"
    && element.type !== "snippet"
  );

  if (!data.isExpanded) {
    return {
      height: 36, // Base height for collapsed node
      filteredElements,
    };
  }

  // Calculate expanded height:
  // - Header: 36px
  // - Each element: 28px (including border)
  // - Padding: 16px (8px top + 8px bottom)
  const elementsHeight = filteredElements.length * 28;

  return {
    height: 36 + elementsHeight + 16,
    filteredElements,
  };
};

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "LR",
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 50, // vertical spacing
    ranksep: 200, // horizontal spacing
    // ranker: 'longest-path' // Use tight-tree for more compact layout
  });

  // Set each node with its actual dimensions
  nodes.forEach((node) => {
    const { height } = getFilteredElementsData(node.data);
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: height,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Update positions while maintaining horizontal alignment
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const { height } = getFilteredElementsData(node.data);

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export const isRelationshipElement = (
  element: ContentTypeElements.ContentTypeElementModel,
): element is
  | ContentTypeElements.ILinkedItemsElement
  | ContentTypeElements.ISubpagesElement
  | ContentTypeElements.IRichTextElement =>
  (element.type === "modular_content"
    || element.type === "subpages"
    || element.type === "rich_text")
  && Array.isArray(element.allowed_content_types);
