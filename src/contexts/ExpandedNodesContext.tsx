import React, { createContext, useContext, useState, ReactNode } from "react";

type ExpandedNodesContextType = {
  expandedNodes: Set<string>;
  toggleNode: (nodeId: string, forceState?: boolean) => void;
};

const ExpandedNodesContext = createContext<ExpandedNodesContextType | undefined>(undefined);

export const ExpandedNodesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodeId: string, forceState?: boolean) => {
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
  };

  return (
    <ExpandedNodesContext.Provider value={{ expandedNodes, toggleNode }}>
      {children}
    </ExpandedNodesContext.Provider>
  );
};

export const useExpandedNodes = () => {
  const context = useContext(ExpandedNodesContext);
  if (!context) {
    throw new Error("useExpandedNodes must be used within an ExpandedNodesProvider");
  }
  return context;
};
