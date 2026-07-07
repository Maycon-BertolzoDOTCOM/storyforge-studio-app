'use client';

import React, { useState, useEffect } from 'react';

interface McpServer {
  name: string;
  url: string;
  description: string;
  connected: boolean;
  tools: McpTool[];
  resources: McpResource[];
}

interface McpTool {
  name: string;
  description: string;
  inputSchema: any;
  serverName: string;
}

interface McpResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
  serverName: string;
}

const mockServers: McpServer[] = [
  {
    name: 'StoryForge MCP',
    url: 'http://localhost:8003',
    description: 'Core StoryForge tools for content generation',
    connected: true,
    tools: [
      {
        name: 'scrape',
        description: 'Scrape data from a URL',
        inputSchema: { type: 'object', properties: { url: { type: 'string' } } },
        serverName: 'StoryForge MCP',
      },
      {
        name: 'simulate',
        description: 'Run material simulation',
        inputSchema: { type: 'object', properties: { product: { type: 'string' } } },
        serverName: 'StoryForge MCP',
      },
      {
        name: 'generate',
        description: 'Generate content using cascade LLM',
        inputSchema: { type: 'object', properties: { prompt: { type: 'string' } } },
        serverName: 'StoryForge MCP',
      },
    ],
    resources: [
      { uri: 'storyforge://skills', name: 'Skills Registry', serverName: 'StoryForge MCP' },
      { uri: 'storyforge://workflows', name: 'Workflows', serverName: 'StoryForge MCP' },
    ],
  },
  {
    name: 'Figma MCP',
    url: 'http://localhost:3001/mcp',
    description: 'Figma integration for design-to-code',
    connected: true,
    tools: [
      {
        name: 'get_figma_data',
        description: 'Get Figma file data',
        inputSchema: {
          type: 'object',
          properties: { file_key: { type: 'string' }, node_id: { type: 'string' } },
        },
        serverName: 'Figma MCP',
      },
      {
        name: 'download_figma_images',
        description: 'Download images from Figma',
        inputSchema: {
          type: 'object',
          properties: { file_key: { type: 'string' }, ids: { type: 'array' } },
        },
        serverName: 'Figma MCP',
      },
    ],
    resources: [],
  },
  {
    name: 'BrightData MCP',
    url: 'http://localhost:3002/mcp',
    description: 'Web scraping and data extraction',
    connected: false,
    tools: [],
    resources: [],
  },
];

export default function McpInspectorPage() {
  const [servers, setServers] = useState<McpServer[]>(mockServers);
  const [selectedServer, setSelectedServer] = useState<McpServer | null>(null);
  const [selectedTool, setSelectedTool] = useState<McpTool | null>(null);
  const [activeTab, setActiveTab] = useState<'tools' | 'resources'>('tools');

  const totalTools = servers.reduce((acc, s) => acc + s.tools.length, 0);
  const totalResources = servers.reduce((acc, s) => acc + s.resources.length, 0);
  const connectedServers = servers.filter((s) => s.connected).length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 MCP Tool Inspector</h1>
        <p className="text-gray-600">
          Inspect tools and resources from all MCP servers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{servers.length}</div>
          <div className="text-sm text-gray-500">Servers</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{connectedServers}</div>
          <div className="text-sm text-gray-500">Connected</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalTools}</div>
          <div className="text-sm text-gray-500">Tools</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{totalResources}</div>
          <div className="text-sm text-gray-500">Resources</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Servers List */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900 mb-4">MCP Servers</h2>
          <div className="space-y-2">
            {servers.map((server) => (
              <button
                key={server.name}
                onClick={() => {
                  setSelectedServer(server);
                  setSelectedTool(null);
                }}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedServer?.name === server.name
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{server.name}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      server.connected ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                </div>
                <p className="text-sm text-gray-500">{server.description}</p>
                <div className="flex gap-2 mt-2 text-xs text-gray-400">
                  <span>{server.tools.length} tools</span>
                  <span>•</span>
                  <span>{server.resources.length} resources</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tools/Resources Panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedServer ? (
            <>
              {/* Tabs */}
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('tools')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'tools'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tools ({selectedServer.tools.length})
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'resources'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Resources ({selectedServer.resources.length})
                </button>
              </div>

              {activeTab === 'tools' ? (
                <div className="space-y-4">
                  {selectedServer.tools.length > 0 ? (
                    selectedServer.tools.map((tool) => (
                      <div
                        key={tool.name}
                        onClick={() => setSelectedTool(tool)}
                        className={`bg-white rounded-xl border p-4 cursor-pointer transition-colors ${
                          selectedTool?.name === tool.name
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            {tool.name}
                          </code>
                          <span className="text-xs text-gray-400">from {tool.serverName}</span>
                        </div>
                        <p className="text-sm text-gray-600">{tool.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
                      No tools available (server may be disconnected)
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedServer.resources.length > 0 ? (
                    selectedServer.resources.map((resource) => (
                      <div
                        key={resource.uri}
                        className="bg-white rounded-xl border border-gray-200 p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            {resource.uri}
                          </code>
                        </div>
                        <div className="font-medium text-gray-900">{resource.name}</div>
                        {resource.description && (
                          <p className="text-sm text-gray-500">{resource.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
                      No resources available
                    </div>
                  )}
                </div>
              )}

              {/* Tool Detail */}
              {selectedTool && activeTab === 'tools' && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Tool Schema</h3>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-64 text-sm font-mono">
                    {JSON.stringify(selectedTool.inputSchema, null, 2)}
                  </pre>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              Select a server to view its tools and resources
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
