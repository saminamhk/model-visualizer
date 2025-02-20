import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./contexts/AppContext";
import "./index.css";
import "@kontent-ai/stylekit/styles/styles.css";
import { ExpandedNodesProvider } from "./contexts/ExpandedNodesContext";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <ExpandedNodesProvider>
        <App />
      </ExpandedNodesProvider>
    </AppProvider>
  </React.StrictMode>,
);
