import { ContentTypeModels, ContentTypeSnippetModels } from "@kontent-ai/management-sdk";

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

export const getContentTypes = async (environmentId: string): Promise<ApiResponse<ContentTypeModels.ContentType[]>> => {
  try {
    const response = await fetch("/.netlify/functions/mapiProxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        environmentId,
        action: "getContentTypes",
      }),
    });
    if (!response.ok) {
      return { error: `HTTP error ${response.status}` };
    }
    const data = await response.json();
    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getContentTypeSnippets = async (
  environmentId: string,
): Promise<ApiResponse<ContentTypeSnippetModels.ContentTypeSnippet[]>> => {
  try {
    const response = await fetch("/.netlify/functions/mapiProxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        environmentId,
        action: "getContentTypeSnippets",
      }),
    });
    if (!response.ok) {
      return { error: `HTTP error ${response.status}` };
    }
    const data = await response.json();
    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
};
