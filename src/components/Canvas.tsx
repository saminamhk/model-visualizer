import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReactFlow, { MiniMap, Controls, Background, Node, NodeChange, applyNodeChanges } from "reactflow";
import "reactflow/dist/style.css";
import { getLayoutedElements, isRelationshipElement } from "../utils/layout";
import { ContentTypeNode } from "./ContentTypeNode";
import { ContentTypeElements, ContentTypeModels } from "@kontent-ai/management-sdk";
import { useExpandedNodes } from "../contexts/ExpandedNodesContext";

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
  label?: string;
  sourceHandle: string;
  targetHandle: string;
};

type ProcessedGraph = {
  nodes: Array<ProcessedNode>;
  edges: Array<ProcessedEdge>;
};

const processContentTypes = (contentTypes: ContentType[]): ProcessedGraph => {
  // Build nodes: each content type becomes a node with its id, label, and elements.
  const nodes = contentTypes.map((type) => ({
    id: type.id,
    type: "contentType",
    data: {
      id: type.id,
      label: type.name,
      elements: type.elements,
    },
    // Initial position; layout will be computed later.
    position: { x: 0, y: 0 },
  }));

  const { edges } = contentTypes.reduce(
    (acc, sourceType) => {
      sourceType.elements.forEach((element) => {
        if (isRelationshipElement(element)) {
          element.allowed_content_types?.forEach((allowed) => {
            const targetId = allowed.id;
            const edgeKey = `${sourceType.id}-${element.id}-${targetId}`;
            if (!acc.edgeSet.has(edgeKey)) {
              acc.edgeSet.add(edgeKey);
              acc.edges.push({
                id: edgeKey,
                source: sourceType.id,
                target: targetId ?? "",
                // Assign a computed outgoing handle for the source node.
                sourceHandle: `source-${element.id}`,
                // Use a single incoming handle for the target node.
                targetHandle: "target",
              });
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
};

type CanvasProps = {
  types: Array<ContentTypeModels.ContentType>;
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string) => void;
};

export const Canvas: React.FC<CanvasProps> = ({
  types,
  selectedNodeId,
  onNodeSelect,
}) => {
  const processedGraph = useMemo(() => processContentTypes(types), [types]);
  const { expandedNodes } = useExpandedNodes();

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

  // Recalculate layout whenever expansion or selection changes.
  useEffect(() => {
    setNodes((prevNodes) => {
      const updatedNodes = updateNodeState(prevNodes);
      return getLayoutedElements(updatedNodes, processedGraph.edges).nodes;
    });
  }, [expandedNodes, selectedNodeId, updateNodeState, processedGraph.edges]);

  // Handle drag/other node changes.
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={processedGraph.edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeSelect(node.id)}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background color="grey" gap={20} />
      </ReactFlow>
    </div>
  );
};
