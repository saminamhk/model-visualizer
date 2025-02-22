import { useState, useEffect } from "react";
import { ContentType, getContentTypes, getContentTypeSnippets, Snippet } from "../utils/mapi";
import { useAppContext } from "../contexts/AppContext";

export const useContentModel = () => {
  const { customApp } = useAppContext();
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [showSnippets, setShowSnippets] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ description: string; code: string } | null>(null);

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
      } catch (err) {
        console.error(err);
        setError({ description: "Failed to fetch content types and snippets", code: "FETCH_ERROR" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customApp.context.environmentId]);

  return {
    contentTypes,
    snippets,
    showSnippets,
    toggleSnippets: () => setShowSnippets(prev => !prev),
    loading,
    error,
  };
};
