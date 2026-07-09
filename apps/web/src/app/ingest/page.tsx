/**
 * Ingestion Dashboard
 * Feed StoryForge with knowledge from YouTube design channels
 */
"use client";

import { useState } from "react";

interface DesignInsights {
  colorPalette: string[];
  designPrinciples: string[];
  typographySuggestions: string[];
  layoutPatterns: string[];
  moodKeywords: string[];
}

interface IngestJob {
  jobId: string;
  status: string;
  videoCount: number;
  processedCount: number;
}

export function IngestionDashboard() {
  const [channelUrl, setChannelUrl] = useState("");
  const [maxVideos, setMaxVideos] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentJob, setCurrentJob] = useState<IngestJob | null>(null);
  const [insights, setInsights] = useState<DesignInsights | null>(null);

  const handleIngest = async () => {
    if (!channelUrl) return;

    setIsProcessing(true);
    try {
      const resp = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelUrl, maxVideos }),
      });

      const { jobId } = await resp.json();
      setCurrentJob({ jobId, status: "queued", videoCount: 0, processedCount: 0 });

      // Poll for status
      const pollInterval = setInterval(async () => {
        const statusResp = await fetch(`/api/ingest/status/${jobId}`);
        const job = await statusResp.json();
        setCurrentJob(job);

        if (job.status === "completed") {
          clearInterval(pollInterval);
          setInsights(job.results?.[0]?.designInsights || null);
          setIsProcessing(false);
        } else if (job.status === "failed") {
          clearInterval(pollInterval);
          setIsProcessing(false);
        }
      }, 3000);
    } catch (err) {
      console.error("Ingest error:", err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🌱 Knowledge Ingestion</h1>
      <p className="text-gray-600 mb-6">
        Feed StoryForge with design knowledge from YouTube channels
      </p>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={channelUrl}
            onChange={(e) => setChannelUrl(e.target.value)}
            placeholder="https://www.youtube.com/@channel"
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <input
            type="number"
            value={maxVideos}
            onChange={(e) => setMaxVideos(Number(e.target.value))}
            min={1}
            max={50}
            className="w-24 border rounded-lg px-4 py-2"
          />
          <button
            onClick={handleIngest}
            disabled={isProcessing || !channelUrl}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Ingest"}
          </button>
        </div>
      </div>

      {currentJob && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Job Status</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{currentJob.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Videos Found</p>
              <p className="font-medium">{currentJob.videoCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Processed</p>
              <p className="font-medium">{currentJob.processedCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Progress</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${
                      currentJob.videoCount > 0
                        ? (currentJob.processedCount / currentJob.videoCount) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {insights && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Extracted Design Insights</h2>

          {insights.colorPalette.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Color Palette</h3>
              <div className="flex gap-2">
                {insights.colorPalette.map((color, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {insights.designPrinciples.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Design Principles</h3>
              <ul className="list-disc list-inside text-sm">
                {insights.designPrinciples.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {insights.typographySuggestions.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Typography</h3>
              <div className="flex flex-wrap gap-2">
                {insights.typographySuggestions.map((t, i) => (
                  <span key={i} className="bg-gray-100 px-3 py-1 rounded text-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {insights.moodKeywords.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Mood</h3>
              <div className="flex flex-wrap gap-2">
                {insights.moodKeywords.map((m, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
