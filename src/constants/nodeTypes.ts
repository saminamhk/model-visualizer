import { ContentTypeNode } from "../components/ContentTypeNode";
import { SnippetNode } from "../components/SnippetNode";

export const nodeTypes = {
  contentType: ContentTypeNode,
  snippet: SnippetNode,
} as const;
