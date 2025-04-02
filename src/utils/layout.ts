import Dagre from "@dagrejs/dagre";
import { Node, Edge, NodeTypes } from "@xyflow/react";
import { Element, RelationshipElement, RequirableElement } from "./types/mapi";
import { ContentTypeNode } from "../components/nodes/ContentTypeNode";
import { SnippetNode } from "../components/nodes/SnippetNode";
import { TaxonomyNode } from "../components/nodes/TaxonomyNode";
import { layoutConfig } from "./config";

const nodeBaseStyle: React.CSSProperties = {
  paddingTop: 5,
  paddingBottom: 5,
  border: "1px solid #ddd",
  borderRadius: 10,
  cursor: "pointer",
  position: "relative",
  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
};

export const getNodeStyle = (selected: boolean): React.CSSProperties => ({
  ...nodeBaseStyle,
  background: selected ? "#f3f3fe" : "white",
  minWidth: 250,
});

export const nodeTypes = {
  contentType: ContentTypeNode,
  snippet: SnippetNode,
  taxonomy: TaxonomyNode,
} as const satisfies NodeTypes;

export const getLayoutedElements = (nodes: ReadonlyArray<Node>, edges: ReadonlyArray<Edge>) => {
  const baseNodeHeight = 76;
  const baseNodeWidth = 172;

  // exclude hidden nodes from layouting
  const visibleNodes = nodes.filter(node => !node.hidden);

  // edges disappear when their nodes are hidden, but this doesn't set their hidden property, hence the thorough filtering
  const visibleEdges = edges.filter(edge =>
    visibleNodes.some(node => node.id === edge.source)
    && visibleNodes.some(node => node.id === edge.target)
    && !edge.hidden
  );

  const graph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: layoutConfig.rankDirection,
    nodesep: layoutConfig.nodeSeparation,
    ranksep: layoutConfig.rankSeparation,
    align: layoutConfig.alignment,
    ranker: layoutConfig.ranker,
    acyclicer: layoutConfig.acyclicer,
  });

  visibleNodes.forEach((node) => {
    const width = node.width ?? node.measured?.width ?? baseNodeWidth;
    const height = node.height ?? node.measured?.height ?? baseNodeHeight;

    graph.setNode(node.id, { width, height });
  });

  visibleEdges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  Dagre.layout(graph);

  // Process visible nodes with new positions
  return {
    nodes: visibleNodes.map((node) => {
      const nodeWithPosition = graph.node(node.id);
      const width = node.width ?? node.measured?.width ?? baseNodeWidth;
      const height = node.height ?? node.measured?.height ?? baseNodeHeight;

      return {
        ...node,
        position: {
          x: nodeWithPosition.x - width / 2,
          y: nodeWithPosition.y - height / 2,
        },
      };
    }),
    edges,
  };
};

export const isRelationshipElement = (
  element: Element,
): element is RelationshipElement =>
  (element.type === "modular_content"
    || element.type === "subpages"
    || element.type === "rich_text")
  && Array.isArray(element.allowed_content_types);

export const isRequirableElement = (element: Element): element is RequirableElement =>
  element.type !== "guidelines"
  && element.type !== "snippet";

export const isNodeRelated = (nodeId: string, targetId: string, edges: ReadonlyArray<Edge>): boolean =>
  nodeId === targetId
    ? true
    : edges.some(edge =>
      (edge.source === nodeId && edge.target === targetId)
      || (edge.target === nodeId && edge.source === targetId)
    );

export const delayTwoAnimationFrames = (fn: () => unknown) =>
  requestAnimationFrame(() => requestAnimationFrame(() => fn()));
