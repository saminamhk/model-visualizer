import { useMemo } from "react";
import { Node, Edge } from "@xyflow/react";
import { ContentType, ResolvedType, Snippet, Taxonomy } from "../../utils/mapi";
import { Canvas } from "../canvas/Canvas";
import { useNodeState } from "../../contexts/NodeStateContext";

export type ViewProps = {
  contentTypes: ContentType[];
  snippets: Snippet[];
  typesWithSnippets: ResolvedType[];
  taxonomies: Taxonomy[];
};

export type ViewRenderer<T extends ViewProps = ViewProps> = {
  createNodes: (props: T) => Node[];
  createEdges: (props: T) => Edge[];
};

export const View = <T extends ViewProps>({
  renderer,
  ...props
}: T & { renderer: ViewRenderer<T> } & { includeRichText?: boolean }) => {
  const { includeRichText } = useNodeState();

  const nodes = useMemo(() => renderer.createNodes(props as T), [props, renderer]);
  const edges = useMemo(() => renderer.createEdges({ ...props as T, includeRichText }), [
    props,
    renderer,
    includeRichText,
  ]);

  return (
    <Canvas
      initialNodes={nodes}
      initialEdges={edges}
    />
  );
};
