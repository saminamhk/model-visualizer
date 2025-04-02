import { ViewRenderer } from "../View";
import { Edge } from "@xyflow/react";
import { ViewProps } from "../View";
import { isRelationshipElement } from "../../../utils/layout";
import { BaseCustomNode } from "../../../utils/types/layout";

const createTaxonomyNodes = ({ taxonomies }: ViewProps): BaseCustomNode[] =>
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

const createTypeNodes = ({ typesWithSnippets }: ViewProps): BaseCustomNode[] =>
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

const createNodes = (props: ViewProps): BaseCustomNode[] => [...createTaxonomyNodes(props), ...createTypeNodes(props)];

const createEdges = ({ typesWithSnippets, taxonomies }: ViewProps): Edge[] =>
  typesWithSnippets.flatMap(type =>
    type.elements.flatMap(element => {
      if (element.type !== "taxonomy" || !element.taxonomy_group?.id) return [];

      const taxonomy = taxonomies.find(s => s.id === element.taxonomy_group?.id);
      if (!taxonomy) return [];

      return [{
        id: `${taxonomy.id}-${type.id}-${element.id}`,
        source: taxonomy.id,
        target: type.id,
        sourceHandle: `source-${taxonomy.id}`,
        targetHandle: `target-${element.id}`,
      }];
    })
  );

export const TaxonomyViewRenderer: ViewRenderer = {
  createNodes,
  createEdges,
};
