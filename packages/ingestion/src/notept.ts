import type { IngestionConfig, VideoSummary } from "./types";

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
 * Summarize a NoteGPT video URL.
 * Sends the URL to the engine which uses AI to extract key points and products.
 */
export async function summarizeNoteGPT(
  url: string,
  config: IngestionConfig = {},
): Promise<VideoSummary> {
  const engineUrl = config.engineUrl ?? DEFAULT_ENGINE_URL;
  return engineFetch<VideoSummary>(engineUrl, "/api/notept/summarize", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}
