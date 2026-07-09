/**
 * StoryForge Ingestion API Client
 * Connects to the Python engine's ingestion endpoints
 */

const ENGINE_URL = process.env.NEXT_PUBLIC_ENGINE_URL || "http://localhost:8000";

export interface IngestJob {
  jobId: string;
  status: "queued" | "scraping" | "processing" | "completed" | "failed";
  channelUrl?: string;
  videoCount: number;
  processedCount: number;
  results?: VideoResult[];
  error?: string;
}

export interface VideoResult {
  videoId: string;
  transcript: string;
  summary: string;
  designInsights: DesignInsights;
}

export interface DesignInsights {
  colorPalette: string[];
  designPrinciples: string[];
  typographySuggestions: string[];
  layoutPatterns: string[];
  moodKeywords: string[];
}

export async function ingestChannel(
  channelUrl: string,
  maxVideos: number = 10,
  extractDesignInsights: boolean = true
): Promise<{ jobId: string }> {
  const resp = await fetch(`${ENGINE_URL}/ingest/channel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channelUrl, maxVideos, extractDesignInsights }),
  });

  if (!resp.ok) {
    throw new Error(`Ingest error: ${resp.status}`);
  }

  return resp.json();
}

export async function ingestVideo(
  videoId: string,
  extractDesignInsights: boolean = true
): Promise<VideoResult> {
  const resp = await fetch(`${ENGINE_URL}/ingest/video`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId, extractDesignInsights }),
  });

  if (!resp.ok) {
    throw new Error(`Ingest error: ${resp.status}`);
  }

  return resp.json();
}

export async function getJobStatus(jobId: string): Promise<IngestJob> {
  const resp = await fetch(`${ENGINE_URL}/ingest/status/${jobId}`);
  if (!resp.ok) {
    throw new Error(`Status error: ${resp.status}`);
  }
  return resp.json();
}

export async function listJobs(): Promise<IngestJob[]> {
  const resp = await fetch(`${ENGINE_URL}/ingest/jobs`);
  if (!resp.ok) {
    throw new Error(`List error: ${resp.status}`);
  }
  return resp.json();
}
