import { useState, useEffect } from "react";
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
import { useAppContext } from "../contexts/AppContext";
import { AppError, createAppError, isKontentError, isAppError } from "../utils/errors";

type ContentModelState = {
  contentTypes: ContentType[];
  snippets: Snippet[];
  typesWithSnippets: ResolvedType[];
  taxonomies: Taxonomy[];
};

const initialState: ContentModelState = {
  contentTypes: [],
  snippets: [],
  typesWithSnippets: [],
  taxonomies: [],
};

export const useContentModel = () => {
  const { customApp } = useAppContext();
  const [state, setState] = useState<ContentModelState>(initialState);
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

        // If any request returned an error, throw it
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
          setError(createAppError(
            error.message,
            error.errorCode,
            error,
          ));
        } else if (isAppError(error)) {
          setError(error);
        } else {
          setError(createAppError(
            "An unknown error occurred",
            "UNKNOWN_ERROR",
            error,
          ));
        }
      } finally {
        setLoading(false);
      }
    };

    getContentModel();
  }, [customApp.context.environmentId]);

  return {
    ...state,
    loading,
    error,
  };
};
