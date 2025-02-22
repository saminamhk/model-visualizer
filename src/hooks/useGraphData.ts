import { useMemo } from "react";
import { isRelationshipElement, ProcessedEdge } from "../utils/layout";
import { Element, ContentType, Snippet } from "../utils/mapi";
import { ProcessedGraph } from "../utils/layout";

const createNodes = (contentTypes: ContentType[], snippets: Snippet[]) => {
  const typeNodes = contentTypes.map((type) => ({
    id: type.id,
    type: "contentType",
    data: {
      id: type.id,
      label: type.name,
      elements: type.elements,
      selfReferences: type.elements
        .filter(el => isRelationshipElement(el) && el.allowed_content_types?.some(t => t.id === type.id))
        .map(el => el.id),
    },
    position: { x: 0, y: 0 },
  }));

  const snippetNodes = snippets.map(snippet => ({
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

const createEdges = (contentTypes: ContentType[], snippets: Snippet[]) => {
  const { typeEdges } = contentTypes.reduce(
    (acc, sourceType) => {
      sourceType.elements.forEach((element: Element) => {
        if (isRelationshipElement(element)) {
          element.allowed_content_types?.forEach((allowed) => {
            const targetId = allowed.id;
            if (sourceType.id !== targetId) {
              const edgeKey = `${sourceType.id}-${element.id}-${targetId}`;
              if (!acc.edgeSet.has(edgeKey)) {
                acc.edgeSet.add(edgeKey);
                acc.typeEdges.push({
                  id: edgeKey,
                  source: sourceType.id,
                  target: targetId ?? "",
                  sourceHandle: `source-${element.id}`,
                  targetHandle: "target",
                });
              }
            }
          });
        }
      });
      return acc;
    },
    { typeEdges: [] as ProcessedEdge[], edgeSet: new Set<string>() },
  );

  const { snippetEdges } = snippets.reduce(
    (acc, snippet) => {
      snippet.elements.forEach(element => {
        if (isRelationshipElement(element)) {
          element.allowed_content_types?.forEach(allowed => {
            acc.edgeSet.add(`${snippet.id}-${element.id}-${allowed.id}`);
            acc.snippetEdges.push({
              id: `${snippet.id}-${element.id}-${allowed.id}`,
              source: snippet.id,
              sourceHandle: `source-${element.id}`,
              target: allowed.id ?? "",
              targetHandle: "target",
            });
          });
        }
      });
      return acc;
    },
    { snippetEdges: [] as ProcessedEdge[], edgeSet: new Set<string>() },
  );

  return { typeEdges, snippetEdges };
};

export const useGraphData = (types: ContentType[], snippets: Snippet[]): ProcessedGraph => {
  return useMemo(() => {
    const { typeNodes, snippetNodes } = createNodes(types, snippets);
    const { typeEdges, snippetEdges } = createEdges(types, snippets);

    return {
      typeNodes,
      typeEdges,
      snippetNodes,
      snippetEdges,
    };
  }, [types, snippets]);
};
