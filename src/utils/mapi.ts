import {
  ContentTypeElements,
  ContentTypeModels,
  ContentTypeSnippetModels,
  ManagementClient,
  TaxonomyModels,
} from "@kontent-ai/management-sdk";

export type ApiResponse<T> = {
  data?: T;
  error?: string;
};

export type Element = ContentTypeElements.ContentTypeElementModel;

export type ContentType = ContentTypeModels.ContentType;

export type Snippet = ContentTypeSnippetModels.ContentTypeSnippet;

export type SnippetElement = ContentTypeElements.ISnippetElement;

export type AnnotatedElement = Element & { fromSnippet: { id: string; name: string } | false };

export type ResolvedType = Omit<ContentTypeModels.ContentType, "elements"> & {
  elements: AnnotatedElement[];
};

export type Taxonomy = TaxonomyModels.Taxonomy;

export type ElementType = Element["type"];

export type NamedElement = Exclude<
  ContentTypeElements.ContentTypeElementModel,
  ContentTypeElements.IGuidelinesElement | ContentTypeElements.ISnippetElement
>;

type ElementTypeLabels = {
  [K in ElementType]: string;
};

type Action = keyof Pick<ManagementClient, "listContentTypes" | "listContentTypeSnippets" | "listTaxonomies">;

export const elementTypeLabels: ElementTypeLabels = {
  text: "Text",
  rich_text: "Rich Text",
  number: "Number",
  multiple_choice: "Multiple Choice",
  date_time: "Date & Time",
  asset: "Asset",
  modular_content: "Linked Items",
  subpages: "Subpages",
  url_slug: "URL Slug",
  guidelines: "Guidelines",
  taxonomy: "Taxonomy",
  custom: "Custom",
  snippet: "Snippet",
};

export const elementTypeMap: ReadonlyMap<ElementType, string> = new Map(
  Object.entries(elementTypeLabels) as [ElementType, string][],
);

const makeMapiRequest = async <T>(
  environmentId: string,
  action: Action,
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch("/.netlify/functions/mapiProxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        environmentId,
        action,
      }),
    });
    if (!response.ok) {
      return { error: `HTTP error ${response.status}` };
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
};

export const getContentTypes = async (
  environmentId: string,
): Promise<ApiResponse<ContentType[]>> => {
  return makeMapiRequest(environmentId, "listContentTypes");
};

export const getContentTypeSnippets = async (
  environmentId: string,
): Promise<ApiResponse<Snippet[]>> => {
  return makeMapiRequest(environmentId, "listContentTypeSnippets");
};

export const getTaxonomies = async (
  environmentId: string,
): Promise<ApiResponse<Taxonomy[]>> => {
  return makeMapiRequest(environmentId, "listTaxonomies");
};

export const mergeTypesWithSnippets = (
  types: ContentType[],
  snippets: Snippet[],
): ResolvedType[] =>
  types.map((type) => ({
    ...type,
    elements: type.elements.flatMap((element) => {
      if (element.type === "snippet") {
        const snippet = snippets.find((s) => s.id === element.snippet.id);
        return snippet?.elements.map((s) =>
          ({
            ...s,
            fromSnippet: {
              id: snippet.id,
              name: snippet.name,
            },
          }) as AnnotatedElement
        ) ?? [];
      }

      return [{ ...element, fromSnippet: false }];
    }),
  }));
