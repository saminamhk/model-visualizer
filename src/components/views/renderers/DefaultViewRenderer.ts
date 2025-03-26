import { ViewRenderer } from "../View";
import { Node, Edge } from "@xyflow/react";
import { ViewProps } from "../View";
import { isRelationshipElement } from "../../../utils/layout";
import { layoutConfig } from "../../../utils/config";

type DefaultViewProps = ViewProps & { includeRichText?: boolean };

const createNodes = ({ typesWithSnippets }: DefaultViewProps): Node[] =>
  typesWithSnippets.map((type) => ({
    id: type.id,
    type: "contentType",
    position: { x: 0, y: 0 }, // Initial position, will be adjusted by layout
    data: {
      id: type.id,
      label: type.name,
      elements: type.elements,
      contentGroups: type.contentGroups,
      selfReferences: type.elements
        .filter(
          (el) =>
            isRelationshipElement(el)
            && el.allowed_content_types?.some((allowed) => allowed.id === type.id),
        )
        .map((el) => el.id),
    },
  }));

const createEdges = ({ typesWithSnippets, includeRichText }: DefaultViewProps): Edge[] => {
  const edgeSet = new Set<string>();
  const edges: Edge[] = [];

  typesWithSnippets.forEach((type) => {
    type.elements.forEach((element) => {
      if (!includeRichText && element.type === "rich_text") return;
      if (isRelationshipElement(element)) {
        element.allowed_content_types?.forEach((allowed) => {
          // skip self-references as they're handled in the node
          if (type.id === allowed.id) return;

          const edgeKey = `${type.id}-${element.id}-${allowed.id}`;
          if (!edgeSet.has(edgeKey)) {
            edgeSet.add(edgeKey);
            edges.push({
              id: edgeKey,
              source: type.id,
              target: allowed.id ?? "",
              sourceHandle: `source-${element.id}`,
              targetHandle: "target",
              type: layoutConfig.edgeType,
            });
          }
        });
      }
    });
  });

  return edges;
};

export const DefaultViewRenderer: ViewRenderer = {
  createNodes,
  createEdges,
};
