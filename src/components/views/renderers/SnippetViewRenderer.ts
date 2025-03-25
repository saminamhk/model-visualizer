import { ViewRenderer } from "../View";
import { Node, Edge } from "@xyflow/react";
import { ViewProps } from "../View";

const createSnippetNodes = (props: ViewProps): Node[] => {
  const { snippets } = props;

  return snippets.map((snippet, index) => ({
    id: snippet.id,
    type: "snippet",
    position: { x: 0, y: index * 100 }, // Initial position, will be adjusted by layout
    data: {
      id: snippet.id,
      label: snippet.name,
      elements: snippet.elements,
    },
  }));
};

const createTypeNodes = (props: ViewProps): Node[] => {
  const { contentTypes } = props;

  return contentTypes.map((type, index) => ({
    id: type.id,
    type: "contentType",
    position: { x: 0, y: index * 100 }, // Initial position, will be adjusted by layout
    hidden: !type.elements.some((el) => el.type === "snippet"),
    data: {
      id: type.id,
      label: type.name,
      elements: type.elements,
      contentGroups: type.contentGroups,
    },
  }));
};

const createNodes = (props: ViewProps): Node[] => [...createSnippetNodes(props), ...createTypeNodes(props)];

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
            targetHandle: `target-${element.id}`,
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
