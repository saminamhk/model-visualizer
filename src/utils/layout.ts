import { ContentTypeElements } from "@kontent-ai/management-sdk";
import dagre from "dagre";
import { Node, Edge } from "reactflow";
import { Element, SnippetElement } from "./mapi";
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
  edgeType: "contentType" | "snippet";
};

export type ProcessedGraph = {
  typeNodes: ProcessedNode[];
  snippetNodes: ProcessedNode[];
  edges: ProcessedEdge[];
};

type NodeData = {
  id: string;
  label: string;
  isExpanded?: boolean;
};

export type ContentTypeNodeData = NodeData & {
  elements: Element[];
  selfReferences: string[];
};

export type SnippetNodeData = NodeData & {
  elements: Element[];
};

export const calculateNodeHeight = (data: ContentTypeNodeData | SnippetNodeData) => {
  const filteredElements = data.elements.filter(element => element.type !== "guidelines");
  const baseNodeHeight = 42;
  const elementHeight = 24;

  return data.isExpanded ? baseNodeHeight + filteredElements.length * elementHeight : baseNodeHeight;
};

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "LR",
) => {
  console.log("getLayoutedElements called");
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 50,
    ranksep: 200,
    align: "UL", // UL, UR, DL, DR
    ranker: "tight-tree", // network-simplex, tight-tree, longest-path
  });

  nodes.forEach((node) => {
    const height = calculateNodeHeight(node.data);
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: height,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      const height = calculateNodeHeight(node.data);

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

export const isSnippetElement = (element: Element): element is SnippetElement => {
  return element.type === "snippet";
};
