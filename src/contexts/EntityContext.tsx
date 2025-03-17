import React, { createContext, useContext } from "react";
import { ContentType, ResolvedType, Snippet } from "../utils/mapi";

type EntityContextType = {
  contentTypes: ContentType[];
  snippets: Snippet[];
  typesWithSnippets: ResolvedType[];
};

const EntityContext = createContext<EntityContextType | null>(null);

export const EntityProvider: React.FC<{
  children: React.ReactNode;
  contentTypes: ContentType[];
  snippets: Snippet[];
  typesWithSnippets: ResolvedType[];
}> = ({ children, contentTypes, snippets, typesWithSnippets }) => (
  <EntityContext.Provider
    value={{
      contentTypes,
      snippets,
      typesWithSnippets,
    }}
  >
    {children}
  </EntityContext.Provider>
);

export const useEntities = () => {
  const context = useContext(EntityContext);
  if (!context) throw new Error("useEntities must be used within EntityProvider");
  return context;
};
