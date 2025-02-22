import "@kontent-ai/stylekit/styles/styles.css";

import React, { useEffect, useState, useCallback } from "react";
import { Canvas } from "./components/Canvas";
import { useAppContext } from "./contexts/AppContext";
import { getContentTypes, getContentTypeSnippets } from "./utils/mapi";
import { ContentTypeModels, ContentTypeSnippetModels } from "@kontent-ai/management-sdk";
import { Loader } from "./components/Loader";
import { ReactFlowProvider } from "reactflow";
import { SnippetsProvider } from "./contexts/SnippetsContext";

const App: React.FC = () => {
  const customAppContext = useAppContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ description: string; code: string } | null>(null);
  const [contentTypes, setContentTypes] = useState<ContentTypeModels.ContentType[]>([]);
  const [snippets, setSnippets] = useState<ContentTypeSnippetModels.ContentTypeSnippet[]>([]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [environmentId, setEnvironmentId] = useState<string>("");
  const [showSnippets, setShowSnippets] = useState(false);

  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  useEffect(() => {
    if (!customAppContext) return;

    if (customAppContext.isError) {
      setError({
        description: customAppContext.description,
        code: customAppContext.code,
      });
      setLoading(false);
      return;
    }

    setEnvironmentId(customAppContext.context.environmentId);

    const fetchData = async () => {
      try {
        setLoading(true);
        const [typesResult, snippetsResult] = await Promise.all([
          getContentTypes(customAppContext.context.environmentId),
          getContentTypeSnippets(customAppContext.context.environmentId),
        ]);
        if (typesResult.error) throw typesResult.error;
        if (snippetsResult.error) throw snippetsResult.error;

        setContentTypes(typesResult.data || []);
        setSnippets(snippetsResult.data || []);
      } catch (err) {
        console.error(err);
        setError({
          description: "Failed to load content model",
          code: "FETCH_ERROR",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customAppContext]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        Error: {error.description}, error code: {error.code}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="centered">
        <Loader
          title="Just a moment"
          message="Your content model is being loaded and layouted. This may take a while depending on your model complexity."
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white" style={{ boxShadow: "inset 50px 0 10px -50px #bfbfbf" }}>
      <ReactFlowProvider>
        <SnippetsProvider
          snippets={snippets}
          showSnippets={showSnippets}
          toggleSnippets={() => setShowSnippets(!showSnippets)}
        >
          <Canvas
            types={contentTypes}
            snippets={snippets}
            selectedNodeId={selectedNodeId}
            onNodeSelect={handleNodeSelect}
            environmentId={environmentId}
          />
        </SnippetsProvider>
      </ReactFlowProvider>
    </div>
  );
};

export default App;
