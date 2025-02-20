import { ContentTypeModels, ContentTypeSnippetModels } from "@kontent-ai/management-sdk";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

type MapiAction = "getContentTypes" | "getContentTypeSnippets";

const makeMapiRequest = async <T>(
  environmentId: string,
  action: MapiAction,
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
): Promise<ApiResponse<ContentTypeModels.ContentType[]>> => {
  return makeMapiRequest(environmentId, "getContentTypes");
};

export const getContentTypeSnippets = async (
  environmentId: string,
): Promise<ApiResponse<ContentTypeSnippetModels.ContentTypeSnippet[]>> => {
  return makeMapiRequest(environmentId, "getContentTypeSnippets");
};
