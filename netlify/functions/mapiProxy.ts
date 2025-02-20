import { Handler, HandlerEvent } from "@netlify/functions";
import { ManagementClient } from "@kontent-ai/management-sdk";

type Action = "getContentTypes" | "getContentTypeSnippets";

type ProxyRequest = {
  environmentId: string;
  action: Action;
};

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { environmentId, action }: ProxyRequest = JSON.parse(event.body || "{}");
    if (!environmentId || !action) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing environmentId or action" }) };
    }

    const apiKey = process.env.MAPI_KEY;
    if (!apiKey) {
      console.error("API key is missing from environment variables.");
      return { statusCode: 500, body: JSON.stringify({ error: "Server misconfiguration" }) };
    }

    const client = new ManagementClient({ environmentId, apiKey });
    const actions = {
      getContentTypes: () => client.listContentTypes(),
      getContentTypeSnippets: () => client.listContentTypeSnippets(),
      // more actions here
    };

    const actionFn = actions[action];
    if (!actionFn) {
      return { statusCode: 400, body: JSON.stringify({ error: "Unsupported action" }) };
    }

    const response = await actionFn().toAllPromise();
    return { statusCode: 200, body: JSON.stringify(response.data.items) };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error:", errorMessage);
    return { statusCode: 500, body: JSON.stringify({ error: errorMessage }) };
  }
};
