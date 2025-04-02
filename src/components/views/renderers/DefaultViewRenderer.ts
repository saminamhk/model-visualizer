import { ViewRenderer } from "../View";
import { Edge } from "@xyflow/react";
import { ViewProps } from "../View";
import { isRelationshipElement } from "../../../utils/layout";
import { layoutConfig } from "../../../utils/config";
import { BaseCustomNode } from "../../../utils/types/layout";

const createNodes = ({ typesWithSnippets }: ViewProps): BaseCustomNode[] =>
  typesWithSnippets.map((type) => ({
    id: type.id,
    type: "contentType",
    position: { x: 0, y: 0 }, // Initial position, will be adjusted by layout
    data: {
      id: type.id,
      label: type.name,
      elements: type.elements,
      contentGroups: type.contentGroups,
      // if a linked item element can reference its own type, log its id
      selfReferences: type.elements
        .filter(
          (el) =>
            isRelationshipElement(el)
            && el.allowed_content_types?.some((allowed) => allowed.id === type.id),
        )
        .map((el) => el.id),
    },
  }));

const createEdges = ({ typesWithSnippets }: ViewProps): Edge[] =>
  typesWithSnippets.flatMap((type) =>
    type.elements.flatMap((element) => {
      if (!isRelationshipElement(element)) return [];

      return (element.allowed_content_types ?? [])
        .filter(allowed => type.id !== allowed.id) // skip self-references
        .map(allowed => ({
          id: `${type.id}-${element.id}-${allowed.id}`,
          source: type.id,
          target: allowed.id ?? "",
          sourceHandle: `source-${element.id}`,
          targetHandle: "target",
          type: layoutConfig.edgeType,
          data: {
            isRichTextEdge: element.type === "rich_text",
          },
        }));
    })
  );

export const DefaultViewRenderer: ViewRenderer = {
  createNodes,
  createEdges,
};
