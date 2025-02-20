// src/components/Canvas.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Node,
  NodeChange,
  applyNodeChanges,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { getLayoutedElements } from "../utils/layout";
import { ContentTypeNode } from "./ContentTypeNode";
import { ContentTypeElements, ContentTypeModels } from "@kontent-ai/management-sdk";
import { useExpandedNodes } from "../contexts/ExpandedNodesContext";

type ContentType = ContentTypeModels.ContentType;

type ProcessedGraph = {
  nodes: Array<{
    id: string;
    type: string;
    data: {
      id: string;
      label: string;
      elements: ContentTypeElements.ContentTypeElementModel[];
    };
    position: { x: number; y: number };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    label?: string;
    sourceHandle: string;
    targetHandle: string;
  }>;
};

const processContentTypes = (contentTypes: ContentType[]): ProcessedGraph => {
  const nodes: ProcessedGraph["nodes"] = contentTypes.map((type) => {
    console.log("Creating node for type:", type.id); // Debug log
    return {
      id: type.id,
      type: "contentType",
      data: {
        id: type.id,
        label: type.name,
        elements: type.elements,
      },
      position: { x: 0, y: 0 },
    };
  });

  // process elements to create edges, each with a unique outgoing handle on the source node
  const edges: ProcessedGraph["edges"] = [];
  const edgeSet = new Set<string>();

  contentTypes.forEach((sourceType) => {
    sourceType.elements.forEach((element) => {
      // Only process relationship elements (modular_content, subpages, or rich_text)
      // that specify allowed content types.
      if (
        (element.type === "modular_content"
          || element.type === "subpages"
          || element.type === "rich_text")
        && Array.isArray(element.allowed_content_types)
      ) {
        element.allowed_content_types.forEach((allowed) => {
          const targetId = allowed.id;
          // Create a unique key including the source element id so that
          // if there are multiple elements creating connections to the same target,
          // they remain distinct.
          const edgeKey = `${sourceType.id}-${element.id}-${targetId}`;
          if (!edgeSet.has(edgeKey)) {
            edgeSet.add(edgeKey);
            edges.push({
              id: edgeKey,
              source: sourceType.id,
              target: targetId ?? "",
              // Use a computed outgoing handle ID for the source node.
              sourceHandle: `source-${element.id}`,
              // For target nodes, always use the single incoming handle "target".
              targetHandle: "target",
              // You could optionally include a label if needed.
              // label: element.codename,
            });
          }
        });
      }
    });
  });

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

// Separate flow component to use hooks
const Flow: React.FC<CanvasProps> = ({ types, selectedNodeId, onNodeSelect }) => {
  // Memoize the processed entities
  const entities = useMemo(() => processContentTypes(types), [types]);
  const { expandedNodes } = useExpandedNodes();
  const reactFlowInstance = useReactFlow();
  const [shouldCenter, setShouldCenter] = useState(false);

  // Create a memoized function to get current nodes state
  const getUpdatedNodes = useCallback((baseNodes: Node[]) => {
    return baseNodes.map(node => ({
      ...node,
      selected: node.id === selectedNodeId,
      data: {
        ...node.data,
        isExpanded: expandedNodes.has(node.id),
      },
    }));
  }, [selectedNodeId, expandedNodes]);

  // Initialize nodes
  const [nodes, setNodes] = useState<Node[]>(() => {
    const initialNodes = getUpdatedNodes(entities.nodes);
    const { nodes: layoutedNodes } = getLayoutedElements(initialNodes, entities.edges);
    return layoutedNodes;
  });

  // Handle expansion/collapse and selection changes
  useEffect(() => {
    const updatedNodes = getUpdatedNodes(nodes);
    const { nodes: layoutedNodes } = getLayoutedElements(updatedNodes, entities.edges);
    setNodes(layoutedNodes);
  }, [expandedNodes, selectedNodeId, getUpdatedNodes]);

  // Handle centering
  useEffect(() => {
    if (selectedNodeId && shouldCenter) {
      const node = nodes.find(n => n.id === selectedNodeId);
      if (node) {
        reactFlowInstance.setCenter(
          node.position.x + 125,
          node.position.y,
          { duration: 800, zoom: 1.5 },
        );
        setShouldCenter(false);
      }
    }
  }, [selectedNodeId, shouldCenter, nodes, reactFlowInstance]);

  // Update shouldCenter when selection changes
  useEffect(() => {
    if (selectedNodeId) {
      setShouldCenter(true);
    }
  }, [selectedNodeId]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={entities.edges}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
      onNodeClick={(_, node) => {
        setShouldCenter(false);
        onNodeSelect(node.id);
      }}
      fitView
    >
      <MiniMap />
      <Controls />
      <Background color="grey" gap={20} />
    </ReactFlow>
  );
};

// Wrapper component to provide ReactFlow context
export const Canvas: React.FC<CanvasProps> = (props) => {
  return (
    <div className="w-full h-full">
      <ReactFlowProvider>
        <Flow {...props} />
      </ReactFlowProvider>
    </div>
  );
};
