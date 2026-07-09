import type { CatalogResult, CompetitorResult, IngestionConfig } from "./types";

const DEFAULT_ENGINE_URL = "http://localhost:8000";

async function engineFetch<T>(
  engineUrl: string,
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const resp = await fetch(`${engineUrl}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Engine API error ${resp.status}: ${body}`);
  }
  return resp.json() as Promise<T>;
}

/**
 * Scrape a product catalog from a URL via the engine's HTTP scraper.
 * Uses JSON-LD first, falls back to HTML parsing.
 */
export async function scrapeCatalog(
  url: string,
  config: IngestionConfig = {},
): Promise<CatalogResult> {
  const engineUrl = config.engineUrl ?? DEFAULT_ENGINE_URL;
  return engineFetch<CatalogResult>(engineUrl, "/api/scrape", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}

/**
 * Extract a product catalog using browser automation (browser-use).
 * For JS-rendered sites where HTTP scraping fails.
 */
export async function extractCatalogViaBrowser(
  url: string,
  config: IngestionConfig = {},
): Promise<CatalogResult> {
  const engineUrl = config.engineUrl ?? DEFAULT_ENGINE_URL;
  return engineFetch<CatalogResult>(engineUrl, "/api/browser/extract-catalog", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}

/**
 * Monitor a competitor's pricing via browser automation.
 */
export async function monitorCompetitor(
  url: string,
  config: IngestionConfig = {},
): Promise<CompetitorResult> {
  const engineUrl = config.engineUrl ?? DEFAULT_ENGINE_URL;
  return engineFetch<CompetitorResult>(engineUrl, "/api/browser/monitor-competitor", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}
