import { ViewRenderer } from "../View";
import { Node, Edge } from "@xyflow/react";
import { ViewProps } from "../View";

const createSnippetNodes = ({ snippets }: ViewProps): Node[] =>
  snippets.map((snippet, index) => ({
    id: snippet.id,
    type: "snippet",
    position: { x: 0, y: index * 100 }, // Initial position, will be adjusted by layout
    data: {
      id: snippet.id,
      label: snippet.name,
      elements: snippet.elements,
    },
  }));

const createTypeNodes = ({ contentTypes }: ViewProps): Node[] =>
  contentTypes.map((type, index) => ({
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

const createNodes = (props: ViewProps): Node[] => [...createSnippetNodes(props), ...createTypeNodes(props)];

const createEdges = ({ contentTypes, snippets }: ViewProps): Edge[] => {
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
};
