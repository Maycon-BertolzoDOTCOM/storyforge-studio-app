/**
 * Competitor Dashboard
 * Visualize design insights from ingested YouTube channels
 */
"use client";

import { useState, useEffect } from "react";

interface Channel {
  id: number;
  name: string;
  url: string;
  subscriberCount?: string;
  videoCount?: string;
  lastScraped?: string;
}

interface Video {
  id: number;
  videoId: string;
  title: string;
  designTags?: string;
  colorPalette?: string;
  scrapedAt?: string;
}

interface DesignInsights {
  colorPalette: string[];
  designPrinciples: string[];
  typographySuggestions: string[];
  layoutPatterns: string[];
  moodKeywords: string[];
}

export function CompetitorDashboard() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [insights, setInsights] = useState<DesignInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const resp = await fetch("/api/channels");
      const data = await resp.json();
      setChannels(data);
    } catch (err) {
      console.error("Failed to fetch channels:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelVideos = async (channelId: number) => {
    try {
      const resp = await fetch(`/api/channels/${channelId}/videos`);
      const data = await resp.json();
      setVideos(data);
      aggregateInsights(data);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    }
  };

  const aggregateInsights = (videoList: Video[]) => {
    const allColors: string[] = [];
    const allTags: string[] = [];

    videoList.forEach((video) => {
      if (video.colorPalette) {
        try {
          const colors = JSON.parse(video.colorPalette);
          allColors.push(...colors);
        } catch {}
      }
      if (video.designTags) {
        try {
          const tags = JSON.parse(video.designTags);
          allTags.push(...tags);
        } catch {}
      }
    });

    // Count frequencies
    const colorFreq = allColors.reduce((acc, color) => {
      acc[color] = (acc[color] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tagFreq = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort by frequency
    const topColors = Object.entries(colorFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([color]) => color);

    const topTags = Object.entries(tagFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);

    setInsights({
      colorPalette: topColors,
      designPrinciples: [],
      typographySuggestions: [],
      layoutPatterns: [],
      moodKeywords: topTags,
    });
  };

  const handleSelectChannel = (channel: Channel) => {
    setSelectedChannel(channel);
    fetchChannelVideos(channel.id);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🎯 Competitor Dashboard</h1>

      <div className="grid grid-cols-12 gap-6">
        {/* Channel List */}
        <div className="col-span-4">
          <h2 className="text-lg font-semibold mb-4">Channels</h2>
          <div className="space-y-2">
            {channels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => handleSelectChannel(channel)}
                className={`p-4 rounded-lg cursor-pointer transition ${
                  selectedChannel?.id === channel.id
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <h3 className="font-medium">{channel.name}</h3>
                <p className="text-sm text-gray-500">{channel.subscriberCount}</p>
                <p className="text-xs text-gray-400">
                  {channel.videoCount} videos • Last scraped: {channel.lastScraped || "Never"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-8">
          {selectedChannel ? (
            <>
              <h2 className="text-lg font-semibold mb-4">
                {selectedChannel.name} Insights
              </h2>

              {/* Color Palette */}
              {insights && insights.colorPalette.length > 0 && (
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                  <h3 className="font-medium mb-3">Color Palette</h3>
                  <div className="flex gap-3">
                    {insights.colorPalette.map((color, i) => (
                      <div key={i} className="text-center">
                        <div
                          className="w-16 h-16 rounded-lg shadow-inner mb-2"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs text-gray-600">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Design Tags */}
              {insights && insights.moodKeywords.length > 0 && (
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                  <h3 className="font-medium mb-3">Design Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {insights.moodKeywords.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <h3 className="font-medium p-4 border-b">Videos Analyzed</h3>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-gray-500">
                        Title
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-gray-500">
                        Colors
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-gray-500">
                        Tags
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map((video) => (
                      <tr key={video.id} className="border-t">
                        <td className="p-3 text-sm">{video.title}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            {video.colorPalette &&
                              JSON.parse(video.colorPalette || "[]")
                                .slice(0, 3)
                                .map((color: string, i: number) => (
                                  <div
                                    key={i}
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1 flex-wrap">
                            {video.designTags &&
                              JSON.parse(video.designTags || "[]")
                                .slice(0, 2)
                                .map((tag: string, i: number) => (
                                  <span
                                    key={i}
                                    className="bg-gray-100 px-2 py-0.5 rounded text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
              Select a channel to view insights
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
