import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

type NodeIsolation = {
  nodeId: string;
  mode: "related" | "single";
} | null;

type NodeStateContextType = {
  expandedNodes: Set<string>;
  toggleNode: (nodeId: string, forceState?: boolean) => void;
  isolation: NodeIsolation;
  isolateRelated: (nodeId: string) => void;
  isolateSingle: (nodeId: string) => void;
  resetIsolation: () => void;
  includeRichText: boolean;
  setIncludeRichText: (value: boolean) => void;
};

const NodeStateContext = createContext<NodeStateContextType | undefined>(undefined);

export const NodeStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isolation, setIsolation] = useState<NodeIsolation>(null);
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
    <NodeStateContext.Provider
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
    </NodeStateContext.Provider>
  );
};

export const useNodeState = () => {
  const context = useContext(NodeStateContext);
  if (!context) {
    throw new Error("useNodeState must be used within a NodeStateProvider");
  }
  return context;
};
