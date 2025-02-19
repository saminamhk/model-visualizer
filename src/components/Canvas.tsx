// src/components/Canvas.tsx
import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, { MiniMap, Controls, Background, Node, Edge, NodeChange, applyNodeChanges } from "reactflow";
import "reactflow/dist/style.css";
import { getLayoutedElements } from "../utils/layout";
import { ContentTypeNode } from "./ContentTypeNode";
import { ContentTypeElements, ContentTypeModels } from "@kontent-ai/management-sdk";

type ContentType = ContentTypeModels.ContentType;

type Elements = ContentTypeElements.ContentTypeElementModel[];

type ProcessedGraph = {
  nodes: Array<{
    id: string;
    data: { label: string; elements: Elements };
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
  // Create nodes with a single incoming handle.
  const nodes: ProcessedGraph["nodes"] = contentTypes.map((type) => ({
    id: type.id,
    type: "contentType", // custom node type for our component
    data: {
      label: type.name,
      elements: type.elements,
    },
    position: { x: 0, y: 0 }, // position is calculated later
  }));

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
};

export const Canvas: React.FC<CanvasProps> = ({ types }) => {
  // Process the content types to create initial nodes and edges.
  const entities = processContentTypes(types); // assume processContentTypes now passes full data
  const [nodes, setNodes] = useState<Node[]>(entities.nodes);
  const [edges, setEdges] = useState<Edge[]>(entities.edges);

  useEffect(() => {
    const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges);
    setNodes(layoutedNodes);
  }, []); // run only on mount

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background color="grey" gap={20} />
      </ReactFlow>
    </div>
  );
};
