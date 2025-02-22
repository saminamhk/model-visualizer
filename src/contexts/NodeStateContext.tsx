import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

type NodeStateContextType = {
  expandedNodes: Set<string>;
  toggleNode: (nodeId: string, forceState?: boolean) => void;
  isolatedNodeId: string | null;
  isolateNode: (nodeId: string) => void;
  resetIsolation: () => void;
};

const NodeStateContext = createContext<NodeStateContextType | undefined>(undefined);

export const NodeStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isolatedNodeId, setIsolatedNodeId] = useState<string | null>(null);

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

  const isolateNode = useCallback((nodeId: string) => {
    setIsolatedNodeId(nodeId);
  }, []);

  const resetIsolation = useCallback(() => {
    setIsolatedNodeId(null);
  }, []);

  return (
    <NodeStateContext.Provider
      value={{
        expandedNodes,
        toggleNode,
        isolatedNodeId,
        isolateNode,
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
