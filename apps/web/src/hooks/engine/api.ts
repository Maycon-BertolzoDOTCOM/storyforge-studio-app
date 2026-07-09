/**
 * StoryForge Engine API client — connects frontend to Python backend.
 * Uses cascade router (Fable → Opus → Sonnet → Haiku) for LLM tasks.
 */

const ENGINE_URL = process.env.NEXT_PUBLIC_ENGINE_URL || "http://localhost:8000";

interface EngineResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

async function engineFetch<T>(path: string, options: RequestInit = {}): Promise<EngineResponse<T>> {
  try {
    const resp = await fetch(`${ENGINE_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    if (!resp.ok) {
      const body = await resp.text();
      return { ok: false, error: `Engine ${resp.status}: ${body}` };
    }
    const data = await resp.json();
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export interface Product {
  name: string | null;
  price: string | null;
  description: string | null;
  image_url: string | null;
  sku: string | null;
  source: string;
}

export interface CatalogResult {
  url: string;
  products: Product[];
}

export interface VideoSummary {
  title: string;
  url: string;
  summary: string;
  key_points: string[];
  products: Product[];
}

export interface GenerateResult {
  success: boolean;
  content: string;
  provider: string;
  difficulty: string;
  model_used: string;
  latency_ms: number;
  cost_estimate: number;
}

export async function scrapeCatalog(url: string): Promise<EngineResponse<CatalogResult>> {
  return engineFetch<CatalogResult>("/api/scrape", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}

export async function extractCatalogViaBrowser(url: string): Promise<EngineResponse<CatalogResult>> {
  return engineFetch<CatalogResult>("/api/browser/extract-catalog", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}

export async function monitorCompetitor(url: string): Promise<EngineResponse<{ competitor: string; products: Product[] }>> {
  return engineFetch("/api/browser/monitor-competitor", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}

export async function summarizeNoteGPT(url: string): Promise<EngineResponse<VideoSummary>> {
  return engineFetch<VideoSummary>("/api/notept/summarize", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}

export async function generateWithCascade(
  prompt: string,
  options: {
    system_prompt?: string;
    difficulty?: "low" | "medium" | "high";
    max_tokens?: number;
  } = {},
): Promise<EngineResponse<GenerateResult>> {
  return engineFetch<GenerateResult>("/api/generate", {
    method: "POST",
    body: JSON.stringify({ prompt, ...options }),
  });
}

export async function getRouterMetrics(): Promise<EngineResponse<Record<string, unknown>>> {
  return engineFetch("/api/router/metrics");
}
