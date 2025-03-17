import { useState, useEffect } from "react";
import {
  ContentType,
  getContentTypes,
  getContentTypeSnippets,
  mergeTypesWithSnippets,
  Snippet,
  ResolvedType,
} from "../utils/mapi";
import { useAppContext } from "../contexts/AppContext";

export const useContentModel = () => {
  const { customApp } = useAppContext();
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ description: string; code: string } | null>(null);
  const [typesWithSnippets, setTypesWithSnippets] = useState<ResolvedType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [typesResult, snippetsResult] = await Promise.all([
          getContentTypes(customApp.context.environmentId),
          getContentTypeSnippets(customApp.context.environmentId),
        ]);
        if (typesResult.error) throw typesResult.error;
        if (snippetsResult.error) throw snippetsResult.error;

        setContentTypes(typesResult.data || []);
        setSnippets(snippetsResult.data || []);
        setTypesWithSnippets(mergeTypesWithSnippets(typesResult.data || [], snippetsResult.data || []));
      } catch (err: any) {
        console.error(err);
        setError({
          description: err.description ?? "Failed to fetch content model data",
          code: err.code ?? "FETCH_ERROR",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customApp.context.environmentId]);

  return {
    contentTypes,
    snippets,
    typesWithSnippets,
    loading,
    error,
  };
};
