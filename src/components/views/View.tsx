import React, { useMemo } from "react";
import { Node, Edge } from "reactflow";
import { ResolvedType, Snippet } from "../../utils/mapi";
import { ContentTypeModels } from "@kontent-ai/management-sdk";
import { Canvas } from "../canvas/Canvas";
import { useNodeState } from "../../contexts/NodeStateContext";

export type ViewProps = {
  contentTypes: ContentTypeModels.ContentType[];
  snippets: Snippet[];
  typesWithSnippets: ResolvedType[];
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string) => void;
};

export type ViewRenderer = {
  createNodes: (props: ViewProps) => Node[];
  createEdges: (props: ViewProps) => Edge[];
  getSidebarItems: (props: ViewProps) => { id: string; name: string }[];
};

export const View: React.FC<ViewProps & { renderer: ViewRenderer }> = ({
  renderer,
  contentTypes,
  ...props
}) => {
  const { includeRichText } = useNodeState();

  const nodes = useMemo(() => renderer.createNodes({ contentTypes, ...props }), [contentTypes, props, renderer]);

  const edges = useMemo(() => renderer.createEdges({ contentTypes, ...props }), [
    contentTypes,
    props,
    renderer,
    includeRichText,
  ]);

  return (
    <Canvas
      nodes={nodes}
      edges={edges}
      types={contentTypes}
      selectedNodeId={props.selectedNodeId}
      onNodeSelect={props.onNodeSelect}
    />
  );
};
