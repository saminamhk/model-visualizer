import { ViewRenderer } from "../View";
import { Node, Edge } from "reactflow";
import { ViewProps } from "../View";
import { isRelationshipElement } from "../../../utils/layout";
import { useNodeState } from "../../../contexts/NodeStateContext";

const createNodes = (props: ViewProps): Node[] => {
  const { typesWithSnippets } = props;

  return typesWithSnippets.map((type) => ({
    id: type.id,
    type: "contentType",
    position: { x: 0, y: 0 }, // Initial position, will be adjusted by layout
    data: {
      id: type.id,
      label: type.name,
      elements: type.elements,
      selfReferences: type.elements
        .filter(
          (el) =>
            isRelationshipElement(el)
            && el.allowed_content_types?.some((allowed) => allowed.id === type.id),
        )
        .map((el) => el.id),
    },
  }));
};

const createEdges = (props: ViewProps): Edge[] => {
  const { typesWithSnippets } = props;
  const { includeRichText } = useNodeState();
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
  getSidebarItems: ({ contentTypes }) => contentTypes.map(type => ({ id: type.id, name: type.name })),
};
