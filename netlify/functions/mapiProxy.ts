import { Handler, HandlerEvent } from "@netlify/functions";
import { ManagementClient } from "@kontent-ai/management-sdk";

type Action = keyof Pick<ManagementClient, "listContentTypes" | "listContentTypeSnippets" | "listTaxonomies">;

type ActionMap = {
  [K in Action]: () => ReturnType<ManagementClient[K]>;
};

type RequestPayload = {
  environmentId: string;
  action: Action;
};

const createResponse = (statusCode: number, body: string) => ({
  statusCode,
  body,
});

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return createResponse(405, "Method Not Allowed");
  }

  try {
    const { environmentId, action }: RequestPayload = JSON.parse(event.body || "{}");
    if (!environmentId || !action) {
      return createResponse(400, "Missing environmentId or action");
    }

    const apiKey = process.env.MAPI_KEY;
    if (!apiKey) {
      console.error("API key is missing from environment variables.");
      return createResponse(500, "Server misconfiguration");
    }

    const client = new ManagementClient({ environmentId, apiKey });

    const actions: ActionMap = {
      listContentTypes: () => client.listContentTypes(),
      listContentTypeSnippets: () => client.listContentTypeSnippets(),
      listTaxonomies: () => client.listTaxonomies(),
    };

    const actionFn = actions[action];
    if (!actionFn) {
      return createResponse(400, "Unsupported action");
    }

    const response = await actionFn().toAllPromise();
    return createResponse(200, JSON.stringify(response.data.items));
  } catch (error) {
    console.error("Error:", error);
    return createResponse(500, error instanceof Error ? error.message : "An unknown error occurred");
  }
};
