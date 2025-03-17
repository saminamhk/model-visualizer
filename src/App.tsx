import "@kontent-ai/stylekit/styles/styles.css";

import React, { useState, useCallback } from "react";
import { View } from "./components/views/View";
import { DefaultViewRenderer } from "./components/views/renderers/DefaultViewRenderer";
import { SnippetViewRenderer } from "./components/views/renderers/SnippetViewRenderer";
import { useView } from "./contexts/ViewContext";
import { Loader } from "./components/utils/Loader";
import { ErrorDisplay } from "./components/utils/ErrorDisplay";
import { useContentModel } from "./hooks/useContentModel";

const ViewContainer: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { currentView } = useView();
  const { contentTypes, snippets, typesWithSnippets, loading, error } = useContentModel();

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

  const viewProps = {
    contentTypes,
    snippets,
    typesWithSnippets,
    selectedNodeId,
    onNodeSelect: handleNodeSelect,
  };

  return (
    <View
      {...viewProps}
      renderer={currentView === "default" ? DefaultViewRenderer : SnippetViewRenderer}
    />
  );
};

const App: React.FC = () => {
  return (
    <div className="content-model-viewer h-screen bg-white" style={{ boxShadow: "inset 50px 0 10px -50px #bfbfbf" }}>
      <ViewContainer />
    </div>
  );
};

export default App;
