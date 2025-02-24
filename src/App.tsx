import "@kontent-ai/stylekit/styles/styles.css";

import React, { useState, useCallback } from "react";
import { Canvas } from "./components/canvas/Canvas";
import { EntityProvider } from "./contexts/EntityContext";
import { Loader } from "./components/utils/Loader";
import { ErrorDisplay } from "./components/utils/ErrorDisplay";
import { useContentModel } from "./hooks/useContentModel";

const App: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { contentTypes, snippets, loading, error } = useContentModel();

  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  if (loading) {
    return (
      <div className="centered">
        <Loader
          title="Just a moment..."
          message="Your content model is being loaded and layouted. This may take a while depending on your model complexity."
        />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay description={error.description} code={error.code} />;
  }

  return (
    <div className="content-model-viewer h-screen bg-white" style={{ boxShadow: "inset 50px 0 10px -50px #bfbfbf" }}>
      <EntityProvider
        contentTypes={contentTypes}
        snippets={snippets}
      >
        <Canvas selectedNodeId={selectedNodeId} onNodeSelect={handleNodeSelect} />
      </EntityProvider>
    </div>
  );
};

export default App;
