"use client";

import { useState, useCallback } from "react";
import {
  scrapeCatalog,
  extractCatalogViaBrowser,
  monitorCompetitor,
  summarizeNoteGPT,
  generateWithCascade,
  type CatalogResult,
  type VideoSummary,
  type GenerateResult,
} from "./api";

export { useTokenOptimizer } from "./use-token-optimizer";
export type { OptimizationStats, BudgetStatus, CompactResult } from "./use-token-optimizer";

interface UseEngineState<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
}

export function useScrapeCatalog() {
  const [state, setState] = useState<UseEngineState<CatalogResult>>({
    loading: false,
    data: null,
    error: null,
  });

  const execute = useCallback(async (url: string) => {
    setState({ loading: true, data: null, error: null });
    const result = await scrapeCatalog(url);
    if (result.ok) {
      setState({ loading: false, data: result.data!, error: null });
    } else {
      setState({ loading: false, data: null, error: result.error! });
    }
    return result;
  }, []);

  return { ...state, execute };
}

export function useExtractCatalogViaBrowser() {
  const [state, setState] = useState<UseEngineState<CatalogResult>>({
    loading: false,
    data: null,
    error: null,
  });

  const execute = useCallback(async (url: string) => {
    setState({ loading: true, data: null, error: null });
    const result = await extractCatalogViaBrowser(url);
    if (result.ok) {
      setState({ loading: false, data: result.data!, error: null });
    } else {
      setState({ loading: false, data: null, error: result.error! });
    }
    return result;
  }, []);

  return { ...state, execute };
}

export function useMonitorCompetitor() {
  const [state, setState] = useState<UseEngineState<{ competitor: string; products: { name: string | null; price: string | null }[] }>>({
    loading: false,
    data: null,
    error: null,
  });

  const execute = useCallback(async (url: string) => {
    setState({ loading: true, data: null, error: null });
    const result = await monitorCompetitor(url);
    if (result.ok) {
      setState({ loading: false, data: result.data!, error: null });
    } else {
      setState({ loading: false, data: null, error: result.error! });
    }
    return result;
  }, []);

  return { ...state, execute };
}

export function useSummarizeNoteGPT() {
  const [state, setState] = useState<UseEngineState<VideoSummary>>({
    loading: false,
    data: null,
    error: null,
  });

  const execute = useCallback(async (url: string) => {
    setState({ loading: true, data: null, error: null });
    const result = await summarizeNoteGPT(url);
    if (result.ok) {
      setState({ loading: false, data: result.data!, error: null });
    } else {
      setState({ loading: false, data: null, error: result.error! });
    }
    return result;
  }, []);

  return { ...state, execute };
}

export function useGenerateCascade() {
  const [state, setState] = useState<UseEngineState<GenerateResult>>({
    loading: false,
    data: null,
    error: null,
  });

  const execute = useCallback(
    async (
      prompt: string,
      options: { system_prompt?: string; difficulty?: "low" | "medium" | "high"; max_tokens?: number } = {},
    ) => {
      setState({ loading: true, data: null, error: null });
      const result = await generateWithCascade(prompt, options);
      if (result.ok) {
        setState({ loading: false, data: result.data!, error: null });
      } else {
        setState({ loading: false, data: null, error: result.error! });
      }
      return result;
    },
    [],
  );

  return { ...state, execute };
}
