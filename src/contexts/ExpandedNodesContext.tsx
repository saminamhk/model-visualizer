import React, { createContext, useContext, useState, ReactNode } from "react";

type ExpandedNodesContextType = {
  expandedNodes: Set<string>;
  toggleNode: (nodeId: string) => void;
  setNodeExpanded: (nodeId: string, expanded: boolean) => void;
};

const ExpandedNodesContext = createContext<ExpandedNodesContextType | undefined>(undefined);

export const ExpandedNodesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const setNodeExpanded = (nodeId: string, expanded: boolean) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (expanded) {
        next.add(nodeId);
      } else {
        next.delete(nodeId);
      }
      return next;
    });
  };

  return (
    <ExpandedNodesContext.Provider value={{ expandedNodes, toggleNode, setNodeExpanded }}>
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
