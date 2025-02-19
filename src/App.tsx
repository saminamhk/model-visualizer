import "@kontent-ai/stylekit/styles/styles.css";

import React, { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Canvas } from "./components/Canvas";
import { useAppContext } from "./contexts/AppContext";
import { getContentTypes } from "./utils/mapi";
import { ContentTypeModels } from "@kontent-ai/management-sdk";
import { Loader } from "./components/Loader";

const App: React.FC = () => {
  const customAppContext = useAppContext();
  const [loading, setLoading] = useState(true);
  const [contentTypes, setContentTypes] = useState<
    ContentTypeModels.ContentType[]
  >([]);

  if (customAppContext && customAppContext.isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        Error: {customAppContext.description}, error code: {customAppContext.code}
      </div>
    );
  }

  useEffect(() => {
    if (!customAppContext) {
      setLoading(true);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const environmentId = customAppContext.context.environmentId;
      const result = await getContentTypes(environmentId);
      if (result.error) {
        console.error(result.error);
      } else {
        setContentTypes(result.data || []);
      }
      setLoading(false);
    };
    fetchData();
  }, [customAppContext]);

  return loading
    ? (
      <div className="centered">
        <Loader
          title={"Just a moment"}
          message={"Your content model is being loaded and layouted. This may take a while depending on your model complexity."}
        />
      </div>
    )
    : (
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 border-r bg-[#f3f3f3] border-gray-200 relative z-10">
          <Sidebar types={contentTypes} />
        </div>
        {/* Canvas */}
        <div className="flex-1">
          <Canvas types={contentTypes} />
        </div>
      </div>
    );
};

export default App;
