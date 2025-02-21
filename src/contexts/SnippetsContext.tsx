import React, { createContext, useContext } from "react";
import { ContentTypeSnippetModels } from "@kontent-ai/management-sdk";

type SnippetsContextType = {
  snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
  showSnippets: boolean;
  toggleSnippets: () => void;
};

const SnippetsContext = createContext<SnippetsContextType | null>(null);

export const SnippetsProvider: React.FC<{
  children: React.ReactNode;
  snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
  showSnippets: boolean;
  toggleSnippets: () => void;
}> = ({ children, snippets, showSnippets, toggleSnippets }) => {
  return (
    <SnippetsContext.Provider value={{ snippets, showSnippets, toggleSnippets }}>
      {children}
    </SnippetsContext.Provider>
  );
};

export const useSnippets = () => {
  const context = useContext(SnippetsContext);
  if (!context) {
    throw new Error("useSnippets must be used within a SnippetsProvider");
  }
  return context;
};
