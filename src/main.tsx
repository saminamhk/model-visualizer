import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./contexts/AppContext";
import "./index.css";
import "@kontent-ai/stylekit/styles/styles.css";
import { ReactFlowProvider } from "@xyflow/react";
import { CanvasProvider } from "./contexts/CanvasContext";
import { ViewProvider } from "./contexts/ViewContext";
import { ContentModelProvider } from "./contexts/ContentModelContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <ReactFlowProvider>
        <CanvasProvider>
          <ViewProvider>
            <ContentModelProvider>
              <App />
            </ContentModelProvider>
          </ViewProvider>
        </CanvasProvider>
      </ReactFlowProvider>
    </AppProvider>
  </React.StrictMode>,
);
