import "@kontent-ai/stylekit/styles/styles.css";

import React, { useEffect, useState, useCallback } from "react";
import { Canvas } from "./components/Canvas";
import { useAppContext } from "./contexts/AppContext";
import { ContentType, getContentTypes, getContentTypeSnippets, Snippet } from "./utils/mapi";
import { ReactFlowProvider } from "reactflow";
import { EntityProvider } from "./contexts/EntityContext";
import { Loader } from "./components/Loader";
import { ErrorDisplay } from "./components/ErrorDisplay";

const App: React.FC = () => {
  const { customApp } = useAppContext();
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showSnippets, setShowSnippets] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ description: string; code: string } | null>(null);

  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [typesResult, snippetsResult] = await Promise.all([
          getContentTypes(customApp.context.environmentId),
          getContentTypeSnippets(customApp.context.environmentId),
        ]);
        if (typesResult.error) throw typesResult.error;
        if (snippetsResult.error) throw snippetsResult.error;

        setContentTypes(typesResult.data || []);
        setSnippets(snippetsResult.data || []);
      } catch (err) {
        console.error(err);
        setError({ description: "Failed to fetch content types and snippets", code: "FETCH_ERROR" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customApp.context.environmentId]);

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

  if (error) {
    return <ErrorDisplay description={error.description} code={error.code} />;
  }

  return (
    <div
      className="flex h-screen bg-white"
      style={{ boxShadow: "inset 50px 0 10px -50px #bfbfbf" }}
    >
      <ReactFlowProvider>
        <EntityProvider
          contentTypes={contentTypes}
          snippets={snippets}
          showSnippets={showSnippets}
          toggleSnippets={() => setShowSnippets(!showSnippets)}
        >
          <Canvas
            selectedNodeId={selectedNodeId}
            onNodeSelect={handleNodeSelect}
          />
        </EntityProvider>
      </ReactFlowProvider>
    </div>
  );
};

export default App;
