import { createAppError } from "../utils/errors";
import {
  ElementTypeLabels,
  ElementType,
  Action,
  ApiResponse,
  ContentType,
  Snippet,
  ResolvedType,
  AnnotatedElement,
} from "./types/mapi";

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

export const makeMapiRequest = async <T>(
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

    const responseText = await response.text();

    try {
      const responseData = JSON.parse(responseText);

      if (!response.ok) {
        return {
          error: createAppError(
            responseData.message || "Unknown API error",
            responseData.errorCode || response.status,
            responseData,
          ),
        };
      }

      return { data: responseData };
    } catch (parseError) {
      console.error("Failed to parse response:", responseText);
      return {
        error: createAppError(
          "Invalid server response format",
          "PARSE_ERROR",
          { parseError, responseText },
        ),
      };
    }
  } catch (error) {
    console.error("Network error:", error);
    return {
      error: createAppError(
        error instanceof Error ? error.message : "An unknown error occurred",
        "FETCH_ERROR",
        error,
      ),
    };
  }
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
            content_group: element.content_group,
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
