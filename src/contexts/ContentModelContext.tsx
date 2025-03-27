import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getContentTypes, getContentTypeSnippets, mergeTypesWithSnippets, getTaxonomies } from "../utils/mapi";
import { useAppContext } from "./AppContext";
import { AppError, createAppError, isKontentError, isAppError } from "../utils/errors";
import { ResolvedType, ContentType, Snippet, Taxonomy } from "../utils/types/mapi";

type ContentModelData = {
  contentTypes: ContentType[];
  snippets: Snippet[];
  typesWithSnippets: ResolvedType[];
  taxonomies: Taxonomy[];
};

type ContentModelContextState = ContentModelData & {
  loading: boolean;
  error: AppError | null;
  importContentModel: (model: ContentModelData) => void;
  isInspectMode: boolean;
  exitInspectMode: () => void;
};

const ContentModelContext = createContext<ContentModelContextState | null>(null);

export const ContentModelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { customApp } = useAppContext();
  const [model, setModel] = useState<ContentModelData>({
    contentTypes: [],
    snippets: [],
    typesWithSnippets: [],
    taxonomies: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);
  const [isInspectMode, setIsInspectMode] = useState(false);

  // Import content model (enters inspect mode)
  const importContentModel = (newModel: ContentModelData) => {
    setModel(newModel);
    setIsInspectMode(true);
  };

  // Exit inspect mode (triggers API reload via dependency)
  const exitInspectMode = () => {
    setIsInspectMode(false);
  };

  // Fetch content model from API when not in inspect mode
  useEffect(() => {
    // Skip API call when in inspect mode
    if (isInspectMode) return;

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

        setModel({
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
  }, [customApp.context.environmentId, isInspectMode]); // Add isInspectMode to dependencies

  return (
    <ContentModelContext.Provider
      value={{
        ...model,
        loading,
        error,
        importContentModel,
        isInspectMode,
        exitInspectMode,
      }}
    >
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
