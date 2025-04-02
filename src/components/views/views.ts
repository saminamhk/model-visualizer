import { DefaultViewRenderer } from "./renderers/DefaultViewRenderer";
import { SnippetViewRenderer } from "./renderers/SnippetViewRenderer";
import { TaxonomyViewRenderer } from "./renderers/TaxonomyViewRenderer";
import { ViewRenderer } from "./View";

export type ViewType = keyof typeof views;

export type ViewInfo = {
  id: string;
  label: string;
  description: string;
  renderer: ViewRenderer;
};

export const views = {
  default: {
    id: "default",
    label: "Default View",
    description: "Shows relationships between content types",
    renderer: DefaultViewRenderer,
  },
  snippet: {
    id: "snippet",
    label: "Snippet View",
    description: "Shows how snippets are used across content types",
    renderer: SnippetViewRenderer,
  },
  taxonomy: {
    id: "taxonomy",
    label: "Taxonomy View",
    description: "Shows how taxonomies are used across content types",
    renderer: TaxonomyViewRenderer,
  },
} as const satisfies Record<string, ViewInfo>;
