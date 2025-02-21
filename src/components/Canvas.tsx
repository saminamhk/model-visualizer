import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReactFlow, { MiniMap, Controls, Background, Node, NodeChange, applyNodeChanges, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { getLayoutedElements, isRelationshipElement } from "../utils/layout";
import { ContentTypeNode } from "./ContentTypeNode";
import { ContentTypeElements, ContentTypeModels, ContentTypeSnippetModels } from "@kontent-ai/management-sdk";
import { useExpandedNodes } from "../contexts/ExpandedNodesContext";
import { SnippetNode } from "./SnippetNode";
import { useSnippets } from "../contexts/SnippetsContext";

type ContentType = ContentTypeModels.ContentType;

type ProcessedNode = {
  id: string;
  type: string;
  data: {
    id: string;
    label: string;
    elements: ContentTypeElements.ContentTypeElementModel[];
  };
  position: { x: number; y: number };
};

type ProcessedEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
};

type ProcessedGraph = {
  nodes: Array<ProcessedNode>;
  edges: Array<ProcessedEdge>;
};

const processSnippets = (snippets: ContentTypeSnippetModels.ContentTypeSnippet[]): Array<ProcessedNode> => {
  return snippets.map((snippet) => ({
    id: snippet.id,
    type: "snippet",
    data: { id: snippet.id, label: snippet.name, elements: snippet.elements },
    position: { x: 0, y: 0 }, // layouting is done separately
  }));
};

const processContentTypes = (contentTypes: ContentType[]): ProcessedGraph => {
  const nodes = contentTypes.map((type) => ({
    id: type.id,
    type: "contentType",
    data: {
      id: type.id,
      label: type.name,
      elements: type.elements,
      selfReferences: type.elements
        .filter(element =>
          isRelationshipElement(element)
          && element.allowed_content_types?.some(allowed => allowed.id === type.id)
        )
        .map(element => element.id),
    },
    position: { x: 0, y: 0 },
  }));

  const { edges } = contentTypes.reduce(
    (acc, sourceType) => {
      sourceType.elements.forEach((element) => {
        if (isRelationshipElement(element)) {
          element.allowed_content_types?.forEach((allowed) => {
            const targetId = allowed.id;
            if (sourceType.id !== targetId) {
              const edgeKey = `${sourceType.id}-${element.id}-${targetId}`;
              if (!acc.edgeSet.has(edgeKey)) {
                acc.edgeSet.add(edgeKey);
                acc.edges.push({
                  id: edgeKey,
                  source: sourceType.id,
                  target: targetId ?? "",
                  sourceHandle: `source-${element.id}`,
                  targetHandle: "target",
                });
              }
            }
          });
        }
      });
      return acc;
    },
    { edges: [] as ProcessedEdge[], edgeSet: new Set<string>() },
  );

  return { nodes, edges };
};

const nodeTypes = {
  contentType: ContentTypeNode,
  snippet: SnippetNode,
};

type CanvasProps = {
  types: Array<ContentTypeModels.ContentType>;
  snippets: Array<ContentTypeSnippetModels.ContentTypeSnippet>;
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string) => void;
};

export const Canvas: React.FC<CanvasProps> = ({
  types,
  selectedNodeId,
  snippets,
  onNodeSelect,
}) => {
  const processedSnippets = useMemo(() => processSnippets(snippets), [snippets]);
  const processedGraph = useMemo(() => processContentTypes(types), [types]);

  // Create edges for snippet relationships
  const snippetEdges = useMemo(() => {
    const edges: Edge[] = [];
    processedSnippets.forEach(snippet => {
      snippet.data.elements.forEach(element => {
        if (isRelationshipElement(element)) {
          element.allowed_content_types?.forEach(allowed => {
            edges.push({
              id: `${snippet.id}-${element.id}-${allowed.id}`,
              source: snippet.id,
              sourceHandle: `source-${element.id}`,
              target: allowed.id ?? "",
              targetHandle: "target",
            });
          });
        }
      });
    });
    return edges;
  }, [processedSnippets]);

  const { expandedNodes } = useExpandedNodes();
  const { showSnippets } = useSnippets();

  const updateNodeState = useCallback(
    (nodes: Node[]): Node[] =>
      nodes.map((node) => ({
        ...node,
        selected: node.id === selectedNodeId,
        data: {
          ...node.data,
          isExpanded: expandedNodes.has(node.id),
        },
      })),
    [selectedNodeId, expandedNodes],
  );

  // Initialize nodes with layout applied.
  const [nodes, setNodes] = useState<Node[]>(() => {
    const initialNodes = updateNodeState(processedGraph.nodes);
    return getLayoutedElements(initialNodes, processedGraph.edges).nodes;
  });

  useEffect(() => {
    setNodes((prevNodes) => {
      const baseNodes = prevNodes.filter(node => node.type !== "snippet");
      const updatedNodes = updateNodeState(baseNodes);
      const layoutedNodes = getLayoutedElements(updatedNodes, processedGraph.edges).nodes;

      if (showSnippets) {
        const snippetNodes = updateNodeState(processedSnippets);
        const layoutedSnippets = getLayoutedElements(snippetNodes, [], "LR").nodes
          .map(node => ({
            ...node,
            position: {
              x: node.position.x - 500,
              y: node.position.y,
            },
          }));
        return [...layoutedNodes, ...layoutedSnippets];
      }

      return layoutedNodes;
    });
  }, [expandedNodes, selectedNodeId, updateNodeState, processedGraph.edges, showSnippets, processedSnippets]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={showSnippets ? [...processedSnippets, ...nodes] : nodes}
        edges={showSnippets ? [...processedGraph.edges, ...snippetEdges] : processedGraph.edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeSelect(node.id)}
        fitView
      >
        <MiniMap pannable />
        <Controls />
        <Background id="background-1" color="grey" gap={20} />
      </ReactFlow>
    </div>
  );
};
