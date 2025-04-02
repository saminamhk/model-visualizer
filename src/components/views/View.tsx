import { useMemo } from "react";
import { Edge } from "@xyflow/react";
import { ContentType, ResolvedType, Snippet, Taxonomy } from "../../utils/types/mapi";
import { WorkSpace } from "../interface/Workspace";
import { BaseCustomNode } from "../../utils/types/layout";

export type ViewProps = {
  contentTypes: ReadonlyArray<ContentType>;
  snippets: ReadonlyArray<Snippet>;
  typesWithSnippets: ReadonlyArray<ResolvedType>;
  taxonomies: ReadonlyArray<Taxonomy>;
};

export type ViewRenderer = {
  createNodes: (props: ViewProps) => BaseCustomNode[];
  createEdges: (props: ViewProps) => Edge[];
};

export const View = ({
  renderer,
  ...props
}: ViewProps & { renderer: ViewRenderer }) => {
  const nodes = useMemo(() => renderer.createNodes(props), [props, renderer]);
  const edges = useMemo(() => renderer.createEdges(props), [props, renderer]);

  return (
    <WorkSpace
      initialNodes={nodes}
      initialEdges={edges}
    />
  );
};
