export type ViewType = "default" | "snippet";

export interface ViewConfig {
  id: ViewType;
  label: string;
  description: string;
}

export const VIEWS: ViewConfig[] = [
  {
    id: "default",
    label: "Default View",
    description: "Shows relationships between content types",
  },
  {
    id: "snippet",
    label: "Snippet View",
    description: "Shows how snippets are used across content types",
  },
];
