import React, { useMemo } from "react";
import { Node, Edge } from "@xyflow/react";
import { ResolvedType, Snippet } from "../../utils/mapi";
import { ContentTypeModels } from "@kontent-ai/management-sdk";
import { Canvas } from "../canvas/Canvas";
import { useNodeState } from "../../contexts/NodeStateContext";

export type ViewProps = {
  contentTypes: ContentTypeModels.ContentType[];
  snippets: Snippet[];
  typesWithSnippets: ResolvedType[];
};

export type ViewRenderer = {
  createNodes: (props: ViewProps) => Node[];
  createEdges: (props: ViewProps & { includeRichText: boolean }) => Edge[];
  getSidebarItems: (props: ViewProps) => { id: string; name: string }[];
};

export const View: React.FC<ViewProps & { renderer: ViewRenderer }> = ({
  renderer,
  contentTypes,
  ...props
}) => {
  const { includeRichText } = useNodeState();

  const nodes = useMemo(() => renderer.createNodes({ contentTypes, ...props }), [contentTypes, props, renderer]);

  const edges = useMemo(() => renderer.createEdges({ includeRichText, contentTypes, ...props }), [
    contentTypes,
    props,
    renderer,
    includeRichText,
  ]);

  return (
    <Canvas
      initialNodes={nodes}
      initialEdges={edges}
      types={contentTypes}
    />
  );
};
