import "@kontent-ai/stylekit/styles/styles.css";

import React, { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Canvas } from "./components/Canvas";
import { useAppContext } from "./contexts/AppContext";
import { getContentTypes } from "./utils/mapi";
import { ContentTypeModels } from "@kontent-ai/management-sdk";
import { Loader } from "./components/Loader";
import { ReactFlowProvider } from "reactflow";

const App: React.FC = () => {
  const customAppContext = useAppContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ description: string; code: string } | null>(null);
  const [contentTypes, setContentTypes] = useState<ContentTypeModels.ContentType[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  useEffect(() => {
    if (!customAppContext) {
      return;
    }

    if (customAppContext.isError) {
      setError({
        description: customAppContext.description,
        code: customAppContext.code,
      });
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getContentTypes(customAppContext.context.environmentId);

        if (result.error) {
          throw result.error;
        }

        setContentTypes(result.data || []);
      } catch (err) {
        console.error(err);
        setError({
          description: "Failed to load content types",
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
    <div className="flex h-screen">
      <ReactFlowProvider>
        <div className="w-64 border-r bg-[#f3f3f3] border-gray-200 relative z-10">
          <Sidebar
            types={contentTypes}
            onTypeSelect={handleNodeSelect}
          />
        </div>
        <div className="flex-1">
          <Canvas
            types={contentTypes}
            selectedNodeId={selectedNodeId}
            onNodeSelect={handleNodeSelect}
          />
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default App;
