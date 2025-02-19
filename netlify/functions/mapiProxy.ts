import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { ManagementClient } from "@kontent-ai/management-sdk";

type Action = "getContentTypes" | "getContentTypeSnippets";

type ProxyRequest = {
  environmentId: string;
  action: Action;
  payload?: Record<string, unknown>;
};

export const handler: Handler = async (
  event: HandlerEvent,
  _context: HandlerContext,
) => {
  // Ensure this function only accepts POST requests.
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    // Parse the incoming request.
    const { environmentId, action, payload }: ProxyRequest = JSON.parse(event.body || "{}");

    if (!environmentId || !action) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing environmentId or action" }),
      };
    }

    const apiKey = process.env.MAPI_KEY;
    if (!apiKey) {
      console.error("API key is missing from environment variables.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server misconfiguration" }),
      };
    }

    // Instantiate the ManagementClient with the secret API key.
    const client = new ManagementClient({
      environmentId,
      apiKey,
    });

    // Route different actions (e.g., fetch content types).
    if (action === "getContentTypes") {
      const response = await client.listContentTypes().toAllPromise();
      return {
        statusCode: 200,
        body: JSON.stringify(response.data.items),
      };
    }

    if (action === "getContentTypeSnippets") {
      const response = await client.listContentTypeSnippets().toAllPromise();
      return {
        statusCode: 200,
        body: JSON.stringify(response.data.items),
      };
    }

    // Additional actions can be handled here.
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Unsupported action" }),
    };
  } catch (error: any) {
    console.error("Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
