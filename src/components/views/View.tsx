import { useMemo } from "react";
import { Node, Edge } from "@xyflow/react";
import { ContentType, ResolvedType, Snippet, Taxonomy } from "../../utils/types/mapi";
import { Canvas } from "../canvas/Canvas";

export type ViewProps = {
  contentTypes: ContentType[];
  snippets: Snippet[];
  typesWithSnippets: ResolvedType[];
  taxonomies: Taxonomy[];
};

export type ViewRenderer = {
  createNodes: (props: ViewProps) => Node[];
  createEdges: (props: ViewProps) => Edge[];
};

export const View = ({
  renderer,
  ...props
}: ViewProps & { renderer: ViewRenderer }) => {
  const nodes = useMemo(() => renderer.createNodes(props), [props, renderer]);
  const edges = useMemo(() => renderer.createEdges(props), [props, renderer]);

  return (
    <Canvas
      initialNodes={nodes}
      initialEdges={edges}
    />
  );
};
