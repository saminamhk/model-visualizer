import { ViewRenderer } from "../View";
import { Node, Edge } from "reactflow";
import { ViewProps } from "../View";

const createNodes = (props: ViewProps): Node[] => {
  const { snippets, contentTypes } = props;

  const entities = [...snippets, ...contentTypes];

  return entities.map((entity, index) => ({
    id: entity.id,
    type: "contentType",
    position: { x: 0, y: index * 100 }, // Initial position, will be adjusted by layout
    data: {
      id: entity.id,
      label: entity.name,
      elements: entity.elements,
    },
  }));
};

const createEdges = (props: ViewProps): Edge[] => {
  const { contentTypes, snippets } = props;
  const edges: Edge[] = [];

  contentTypes.forEach(type => {
    type.elements.forEach(element => {
      if (element.type === "snippet" && element.snippet?.id) {
        const snippet = snippets.find(s => s.id === element.snippet?.id);
        if (snippet) {
          edges.push({
            id: `${snippet.id}-${type.id}-${element.id}`,
            source: snippet.id,
            target: type.id,
            sourceHandle: "source",
            targetHandle: "target",
          });
        }
      }
    });
  });

  return edges;
};

export const SnippetViewRenderer: ViewRenderer = {
  createNodes,
  createEdges,
  getSidebarItems: ({ snippets }) => snippets.map(snippet => ({ id: snippet.id, name: snippet.name })),
};
