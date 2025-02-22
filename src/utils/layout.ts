import { ContentTypeElements } from "@kontent-ai/management-sdk";
import dagre from "dagre";
import { Node, Edge } from "reactflow";
import { Element } from "./mapi";
import { ContentTypeNode } from "../components/nodes/ContentTypeNode";
import { SnippetNode } from "../components/nodes/SnippetNode";

const nodeWidth = 172;

export const nodeBaseStyle: React.CSSProperties = {
  paddingTop: 5,
  paddingBottom: 5,
  border: "1px solid #ddd",
  borderRadius: 10,
  cursor: "pointer",
  position: "relative",
  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
};

export const nodeTypes = {
  contentType: ContentTypeNode,
  snippet: SnippetNode,
} as const;

export type ProcessedNode = {
  id: string;
  type: string;
  data: {
    id: string;
    label: string;
    elements: ContentTypeElements.ContentTypeElementModel[];
  };
  position: { x: number; y: number };
};

export type ProcessedEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
};

export type ProcessedGraph = {
  typeNodes: ProcessedNode[];
  typeEdges: ProcessedEdge[];
  snippetNodes: ProcessedNode[];
  snippetEdges: ProcessedEdge[];
};

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

export type SnippetNodeData = {
  id: string;
  label: string;
  elements: Element[];
  isExpanded?: boolean;
};

// Helper to calculate node height and filter elements
export const getFilteredElementsData = (data: ContentTypeNodeData): NodeCalculation => {
  const filteredElements = data.elements.filter(element => element.type !== "guidelines");

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

  const isSnippet = (node: Node) => node.type === "snippet";

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 50,
    ranksep: 200,
    align: "UL",
  });

  // Add nodes to graph with type-specific handling
  nodes.forEach((node) => {
    const { height } = getFilteredElementsData(node.data);
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: height,
      rank: isSnippet(node) ? 0 : 1, // Place snippets in first rank
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      const { height } = getFilteredElementsData(node.data);

      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - height / 2,
        },
      };
    }),
    edges,
  };
};

export const isRelationshipElement = (
  element: Element,
): element is
  | ContentTypeElements.ILinkedItemsElement
  | ContentTypeElements.ISubpagesElement
  | ContentTypeElements.IRichTextElement =>
  (element.type === "modular_content"
    || element.type === "subpages"
    || element.type === "rich_text")
  && Array.isArray(element.allowed_content_types);

export const isNodeRelated = (nodeId: string, targetId: string, edges: Edge[]): boolean => {
  if (nodeId === targetId) return true;

  // Check if there's a direct connection in either direction
  return edges.some(edge =>
    (edge.source === nodeId && edge.target === targetId)
    || (edge.target === nodeId && edge.source === targetId)
  );
};
