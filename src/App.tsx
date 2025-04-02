import "@kontent-ai/stylekit/styles/styles.css";

import React from "react";
import { View } from "./components/views/View";
import { useView } from "./contexts/ViewContext";
import { Loader } from "./components/utils/Loader";
import { ErrorDisplay } from "./components/utils/ErrorDisplay";
import { useContentModel } from "./contexts/ContentModelContext";

const ViewContainer: React.FC = () => {
  const { currentView } = useView();
  const { contentTypes, snippets, typesWithSnippets, loading, error, taxonomies } = useContentModel();

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
    return <ErrorDisplay description={error.body} code={error.statusCode.toString()} />;
  }

  const viewProps = {
    contentTypes,
    snippets,
    typesWithSnippets,
    taxonomies,
  };

  return (
    <View
      {...viewProps}
      renderer={currentView.renderer}
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
