import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./contexts/AppContext";
import "./index.css";
import "@kontent-ai/stylekit/styles/styles.css";
import { ReactFlowProvider } from "reactflow";
import { NodeStateProvider } from "./contexts/NodeStateContext";
import { EntityProvider } from "./contexts/EntityContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <ReactFlowProvider>
        <NodeStateProvider>
          <EntityProvider
            contentTypes={[]}
            snippets={[]}
            showSnippets={false}
            toggleSnippets={() => {}}
          >
            <App />
          </EntityProvider>
        </NodeStateProvider>
      </ReactFlowProvider>
    </AppProvider>
  </React.StrictMode>,
);
