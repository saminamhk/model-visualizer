import { useMemo } from "react";
import { isRelationshipElement, isSnippetElement, ProcessedEdge, ProcessedGraph } from "../utils/layout";
import { Element, ContentType, Snippet } from "../utils/mapi";

const createNodes = (types: ContentType[], snippets: Snippet[]) => {
  const typeNodes = types.map((type) => ({
    id: type.id,
    type: "contentType",
    data: {
      id: type.id,
      label: type.name,
      elements: type.elements,
      selfReferences: type.elements
        .filter(
          (el: Element) =>
            isRelationshipElement(el)
            && el.allowed_content_types?.some((allowed) => allowed.id === type.id),
        )
        .map((el: Element) => el.id),
    },
    position: { x: 0, y: 0 },
  }));

  const snippetNodes = snippets.map((snippet) => ({
    id: snippet.id,
    type: "snippet",
    data: {
      id: snippet.id,
      label: snippet.name,
      elements: snippet.elements,
    },
    position: { x: 0, y: 0 },
  }));

  return { typeNodes, snippetNodes };
};

const createEdgesFromSources = (
  sources: (ContentType | Snippet)[],
  checkSelfReference: boolean,
): ProcessedEdge[] => {
  const edgeSet = new Set<string>();
  const edges: ProcessedEdge[] = [];

  sources.forEach((source) => {
    source.elements.forEach((element: Element) => {
      if (isRelationshipElement(element)) {
        element.allowed_content_types?.forEach((allowed) => {
          // Optionally skip self-references if desired.
          if (checkSelfReference && source.id === allowed.id) return;
          const edgeKey = `${source.id}-${element.id}-${allowed.id}`;
          if (!edgeSet.has(edgeKey)) {
            edgeSet.add(edgeKey);
            edges.push({
              id: edgeKey,
              source: source.id,
              target: allowed.id ?? "",
              sourceHandle: `source-${element.id}`,
              targetHandle: "target",
            });
          }
        });
      }
      if (isSnippetElement(element)) {
        const edgeKey = `${source.id}-${element.id}-${element.snippet.id}`;
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          edges.push({
            id: edgeKey,
            source: element.snippet.id ?? "",
            target: source.id ?? "", // snippet edges are created in reverse
            sourceHandle: "source",
            targetHandle: `target-${element.id}`,
          });
        }
      }
    });
  });

  return edges;
};

export const useGraphData = (types: ContentType[], snippets: Snippet[]): ProcessedGraph => {
  return useMemo(() => {
    const { typeNodes, snippetNodes } = createNodes(types, snippets);
    const typeEdges = createEdgesFromSources(types, true);
    const snippetEdges = createEdgesFromSources(snippets, false);
    return {
      typeNodes,
      snippetNodes,
      typeEdges,
      snippetEdges,
    };
  }, [types, snippets]);
};
