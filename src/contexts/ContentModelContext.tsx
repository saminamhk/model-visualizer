import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  ContentType,
  getContentTypes,
  getContentTypeSnippets,
  mergeTypesWithSnippets,
  Snippet,
  ResolvedType,
  Taxonomy,
  getTaxonomies,
} from "../utils/mapi";
import { useAppContext } from "./AppContext";
import { AppError, createAppError, isKontentError, isAppError } from "../utils/errors";

type ContentModelState = {
  contentTypes: ContentType[];
  snippets: Snippet[];
  typesWithSnippets: ResolvedType[];
  taxonomies: Taxonomy[];
  loading: boolean;
  error: AppError | null;
};

const ContentModelContext = createContext<ContentModelState | null>(null);

export const ContentModelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { customApp } = useAppContext();
  const [state, setState] = useState<Omit<ContentModelState, "loading" | "error">>({
    contentTypes: [],
    snippets: [],
    typesWithSnippets: [],
    taxonomies: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    const getContentModel = async () => {
      try {
        setLoading(true);
        setError(null);

        const [typesResult, snippetsResult, taxonomiesResult] = await Promise.all([
          getContentTypes(customApp.context.environmentId),
          getContentTypeSnippets(customApp.context.environmentId),
          getTaxonomies(customApp.context.environmentId),
        ]);

        const error = typesResult.error || snippetsResult.error || taxonomiesResult.error;
        if (error) throw error;

        const types = typesResult.data ?? [];
        const snippets = snippetsResult.data ?? [];
        const taxonomies = taxonomiesResult.data ?? [];

        setState({
          contentTypes: types,
          snippets: snippets,
          typesWithSnippets: mergeTypesWithSnippets(types, snippets),
          taxonomies: taxonomies,
        });
      } catch (error) {
        console.error("Error fetching content model:", error);
        if (isKontentError(error)) {
          setError(createAppError(error.message, error.errorCode, error));
        } else if (isAppError(error)) {
          setError(error);
        } else {
          setError(createAppError("An unknown error occurred", "UNKNOWN_ERROR", error));
        }
      } finally {
        setLoading(false);
      }
    };

    getContentModel();
  }, [customApp.context.environmentId]);

  return (
    <ContentModelContext.Provider value={{ ...state, loading, error }}>
      {children}
    </ContentModelContext.Provider>
  );
};

export const useContentModel = () => {
  const context = useContext(ContentModelContext);
  if (!context) {
    throw new Error("useContentModel must be used within ContentModelProvider");
  }
  return context;
};
