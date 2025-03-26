import { ViewRenderer } from "../View";
import { Node, Edge } from "@xyflow/react";
import { ViewProps } from "../View";
import { isRelationshipElement } from "../../../utils/layout";

const createTaxonomyNodes = ({ taxonomies }: ViewProps): Node[] =>
  taxonomies.map((taxonomy, index) => ({
    id: taxonomy.id,
    type: "taxonomy",
    position: { x: 0, y: index * 100 }, // Initial position, will be adjusted by layout
    data: {
      id: taxonomy.id,
      label: taxonomy.name,
      terms: taxonomy.terms.map((term) => term.name),
    },
  }));

const createTypeNodes = ({ typesWithSnippets }: ViewProps): Node[] =>
  typesWithSnippets.map((type) => ({
    id: type.id,
    type: "contentType",
    position: { x: 0, y: 0 }, // Initial position, will be adjusted by layout
    hidden: !type.elements.some((el) => el.type === "taxonomy"),
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

const createNodes = (props: ViewProps): Node[] => [...createTaxonomyNodes(props), ...createTypeNodes(props)];

const createEdges = ({ typesWithSnippets, taxonomies }: ViewProps): Edge[] => {
  const edges: Edge[] = [];

  typesWithSnippets.forEach(type => {
    type.elements.forEach(element => {
      if (element.type === "taxonomy" && element.taxonomy_group?.id) {
        const taxonomy = taxonomies.find(s => s.id === element.taxonomy_group?.id);
        if (taxonomy) {
          edges.push({
            id: `${taxonomy.id}-${type.id}-${element.id}`,
            source: taxonomy.id,
            target: type.id,
            sourceHandle: `source-${taxonomy.id}`,
            targetHandle: `target-${element.id}`,
          });
        }
      }
    });
  });

  return edges;
};

export const TaxonomyViewRenderer: ViewRenderer = {
  createNodes,
  createEdges,
};
