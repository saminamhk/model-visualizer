import { Handler, HandlerEvent } from "@netlify/functions";
import { ManagementClient, SharedModels } from "@kontent-ai/management-sdk";

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
    return createResponse(405, JSON.stringify({ body: `Method Not Allowed: ${event.httpMethod}`, statusCode: 405 }));
  }

  try {
    const { environmentId, action }: RequestPayload = JSON.parse(event.body || "{}");
    if (!environmentId || !action) {
      return createResponse(400, JSON.stringify({ body: "Missing environmentId or action", statusCode: 400 }));
    }

    const apiKey = process.env.MAPI_KEY;
    if (!apiKey) {
      console.error("API key is missing from environment variables.");
      return createResponse(500, JSON.stringify({ body: "Server misconfiguration", statusCode: 500 }));
    }

    const client = new ManagementClient({ environmentId, apiKey });

    const actions: ActionMap = {
      listContentTypes: () => client.listContentTypes(),
      listContentTypeSnippets: () => client.listContentTypeSnippets(),
      listTaxonomies: () => client.listTaxonomies(),
    };

    const actionFn = actions[action];
    if (!actionFn) {
      return createResponse(400, JSON.stringify({ body: `Unsupported action: "${action}"`, statusCode: 400 }));
    }

    const response = await actionFn().toAllPromise();
    return createResponse(200, JSON.stringify(response.data.items));
  } catch (error) {
    console.error("Error:", error);
    return error instanceof SharedModels.ContentManagementBaseKontentError
      ? createResponse(error.errorCode, JSON.stringify({ body: error.message, statusCode: error.errorCode }))
      : createResponse(
        500,
        JSON.stringify({ body: error instanceof Error ? error.message : "An unknown error occurred", statusCode: 500 }),
      );
  }
};
