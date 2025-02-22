import "@kontent-ai/stylekit/styles/styles.css";

import React, { useEffect, useState, useCallback } from "react";
import { Canvas } from "./components/Canvas";
import { AppProvider, useAppContext } from "./contexts/AppContext";
import { ContentType, getContentTypes, getContentTypeSnippets, Snippet } from "./utils/mapi";
import { ReactFlowProvider } from "reactflow";
import { EntityProvider } from "./contexts/EntityContext";

const App: React.FC = () => {
  const { customApp } = useAppContext();
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showSnippets, setShowSnippets] = useState(false);

  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      }
    };

    fetchData();
  }, [customApp.context.environmentId]);

  return (
    <div
      className="flex h-screen bg-white"
      style={{ boxShadow: "inset 50px 0 10px -50px #bfbfbf" }}
    >
      <AppProvider>
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
      </AppProvider>
    </div>
  );
};

export default App;
