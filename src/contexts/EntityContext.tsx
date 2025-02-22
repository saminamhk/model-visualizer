import React, { createContext, useContext } from "react";
import { ContentTypeModels, ContentTypeSnippetModels } from "@kontent-ai/management-sdk";

type EntityContextType = {
  contentTypes: ContentTypeModels.ContentType[];
  snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
  showSnippets: boolean;
  toggleSnippets: () => void;
  getEntityById: (id: string) => {
    type: "contentType" | "snippet";
    name: string;
    data: ContentTypeModels.ContentType | ContentTypeSnippetModels.ContentTypeSnippet;
  } | undefined;
};

const EntityContext = createContext<EntityContextType | null>(null);

export const EntityProvider: React.FC<{
  children: React.ReactNode;
  contentTypes: ContentTypeModels.ContentType[];
  snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
  showSnippets: boolean;
  toggleSnippets: () => void;
}> = ({ children, contentTypes, snippets, showSnippets, toggleSnippets }) => {
  const getEntityById = (id: string) => {
    const contentType = contentTypes.find(t => t.id === id);
    if (contentType) return { type: "contentType" as const, name: contentType.name, data: contentType };

    const snippet = snippets.find(s => s.id === id);
    if (snippet) return { type: "snippet" as const, name: snippet.name, data: snippet };

    return undefined;
  };

  return (
    <EntityContext.Provider
      value={{
        contentTypes,
        snippets,
        showSnippets,
        toggleSnippets,
        getEntityById,
      }}
    >
      {children}
    </EntityContext.Provider>
  );
};

export const useEntities = () => {
  const context = useContext(EntityContext);
  if (!context) throw new Error("useEntities must be used within EntityProvider");
  return context;
};
