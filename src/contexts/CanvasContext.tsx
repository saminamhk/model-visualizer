import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { NodeIsolation } from "../utils/types/layout";

type CanvasContextType = {
  expandedNodes: Set<string>;
  toggleNode: (nodeId: string, forceState?: boolean) => void;
  isolation: NodeIsolation | null;
  isolateRelated: (nodeId: string) => void;
  isolateSingle: (nodeId: string) => void;
  resetIsolation: () => void;
  includeRichText: boolean;
  setIncludeRichText: (value: boolean) => void;
};

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isolation, setIsolation] = useState<NodeIsolation | null>(null);
  const [includeRichText, setIncludeRichText] = useState(true);

  const toggleNode = useCallback((nodeId: string, forceState?: boolean) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      const shouldExpand = forceState === undefined ? !next.has(nodeId) : forceState;
      if (shouldExpand) {
        next.add(nodeId);
      } else {
        next.delete(nodeId);
      }
      return next;
    });
  }, []);

  const isolateRelated = useCallback((nodeId: string) => {
    setIsolation({ nodeId, mode: "related" });
  }, []);

  const isolateSingle = useCallback((nodeId: string) => {
    setIsolation({ nodeId, mode: "single" });
  }, []);

  const resetIsolation = useCallback(() => {
    setIsolation(null);
  }, []);

  return (
    <CanvasContext.Provider
      value={{
        expandedNodes,
        isolation,
        includeRichText,
        toggleNode,
        isolateRelated,
        isolateSingle,
        resetIsolation,
        setIncludeRichText,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};
