import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { IsolationMode } from "../utils/layout";

type NodeStateContextType = {
  expandedNodes: Set<string>;
  toggleNode: (nodeId: string, forceState?: boolean) => void;
  isolationMode: IsolationMode;
  isolateRelated: (nodeId: string) => void;
  isolateSingle: (nodeId: string) => void;
  resetIsolation: () => void;
};

const NodeStateContext = createContext<NodeStateContextType | undefined>(undefined);

export const NodeStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isolationMode, setIsolationMode] = useState<IsolationMode>(null);

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
    setIsolationMode({ nodeId, mode: "related" });
  }, []);

  const isolateSingle = useCallback((nodeId: string) => {
    setIsolationMode({ nodeId, mode: "single" });
  }, []);

  const resetIsolation = useCallback(() => {
    setIsolationMode(null);
  }, []);

  return (
    <NodeStateContext.Provider
      value={{
        expandedNodes,
        toggleNode,
        isolationMode,
        isolateRelated,
        isolateSingle,
        resetIsolation,
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
