import { useMemo } from "react";
import { Node, Edge } from "@xyflow/react";
import { ContentType, ResolvedType, Snippet, Taxonomy } from "../../utils/types/mapi";
import { WorkSpace } from "../interface/Workspace";

export type ViewProps = {
  contentTypes: ReadonlyArray<ContentType>;
  snippets: ReadonlyArray<Snippet>;
  typesWithSnippets: ReadonlyArray<ResolvedType>;
  taxonomies: ReadonlyArray<Taxonomy>;
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
    <WorkSpace
      initialNodes={nodes}
      initialEdges={edges}
    />
  );
};
