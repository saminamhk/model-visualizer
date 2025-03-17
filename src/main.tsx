import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./contexts/AppContext";
import "./index.css";
import "@kontent-ai/stylekit/styles/styles.css";
import { ReactFlowProvider } from "reactflow";
import { NodeStateProvider } from "./contexts/NodeStateContext";
import { ViewProvider } from "./contexts/ViewContext";
import { EntityProvider } from "./contexts/EntityContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <ReactFlowProvider>
        <NodeStateProvider>
          <ViewProvider>
            <EntityProvider
              contentTypes={[]}
              snippets={[]}
              typesWithSnippets={[]}
            >
              <App />
            </EntityProvider>
          </ViewProvider>
        </NodeStateProvider>
      </ReactFlowProvider>
    </AppProvider>
  </React.StrictMode>,
);
