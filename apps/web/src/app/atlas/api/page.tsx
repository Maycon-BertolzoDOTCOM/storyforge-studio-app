'use client';

import React, { useState, useEffect } from 'react';

interface Endpoint {
  method: string;
  path: string;
  description: string;
  parameters?: any[];
}

const endpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/health',
    description: 'Health check endpoint',
  },
  {
    method: 'POST',
    path: '/api/scrape',
    description: 'Scrape data from a URL',
    parameters: [
      { name: 'url', type: 'string', required: true, description: 'URL to scrape' },
      { name: 'selectors', type: 'object', required: false, description: 'CSS selectors to extract' },
    ],
  },
  {
    method: 'POST',
    path: '/api/simulate',
    description: 'Run material simulation',
    parameters: [
      { name: 'product', type: 'string', required: true, description: 'Product name' },
      { name: 'material', type: 'string', required: false, description: 'Material type' },
      { name: 'parameters', type: 'object', required: false, description: 'Simulation parameters' },
    ],
  },
  {
    method: 'POST',
    path: '/api/generate',
    description: 'Generate content using cascade LLM',
    parameters: [
      { name: 'prompt', type: 'string', required: true, description: 'Generation prompt' },
      { name: 'type', type: 'string', required: false, description: 'Type: landing, video, presentation' },
      { name: 'context', type: 'object', required: false, description: 'Additional context' },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: 'bg-green-100 text-green-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-yellow-100 text-yellow-700',
  DELETE: 'bg-red-100 text-red-700',
};

export default function ApiPlaygroundPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [requestBody, setRequestBody] = useState('{}');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [engineUrl] = useState(process.env.NEXT_PUBLIC_ENGINE_URL || 'http://localhost:8000');

  const executeRequest = async () => {
    if (!selectedEndpoint) return;

    setLoading(true);
    setResponse(null);

    try {
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (selectedEndpoint.method !== 'GET') {
        options.body = requestBody;
      }

      const res = await fetch(`${engineUrl}${selectedEndpoint.path}`, options);
      const data = await res.json();

      setResponse({
        status: res.status,
        statusText: res.statusText,
        data,
      });
    } catch (error) {
      setResponse({
        status: 0,
        statusText: 'Error',
        data: { error: error instanceof Error ? error.message : 'Request failed' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔌 API Playground</h1>
        <p className="text-gray-600">
          Interactive documentation and testing for StoryForge Engine APIs
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Base URL: <code className="bg-gray-100 px-2 py-1 rounded">{engineUrl}</code>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoints List */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Endpoints</h2>
          <div className="space-y-2">
            {endpoints.map((endpoint, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedEndpoint(endpoint);
                  setRequestBody(
                    endpoint.parameters
                      ? JSON.stringify(
                          Object.fromEntries(
                            endpoint.parameters.map((p) => [p.name, p.type === 'string' ? '' : {}])
                          ),
                          null,
                          2
                        )
                      : '{}'
                  );
                }}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedEndpoint === endpoint
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded ${methodColors[endpoint.method]}`}
                  >
                    {endpoint.method}
                  </span>
                  <code className="text-sm text-gray-700">{endpoint.path}</code>
                </div>
                <p className="text-sm text-gray-500">{endpoint.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Request/Response Panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedEndpoint ? (
            <>
              {/* Request Panel */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Request</h2>
                  <button
                    onClick={executeRequest}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Executing...' : 'Execute'}
                  </button>
                </div>

                {/* Parameters */}
                {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Parameters</h3>
                    <div className="space-y-2">
                      {selectedEndpoint.parameters.map((param) => (
                        <div key={param.name} className="flex items-center gap-2 text-sm">
                          <code className="bg-gray-100 px-2 py-1 rounded">{param.name}</code>
                          <span className="text-gray-500">{param.type}</span>
                          {param.required && (
                            <span className="text-red-500 text-xs">required</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Request Body */}
                {selectedEndpoint.method !== 'GET' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Body
                    </label>
                    <textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      className="w-full h-48 p-3 font-mono text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      spellCheck={false}
                    />
                  </div>
                )}
              </div>

              {/* Response Panel */}
              {response && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="font-semibold text-gray-900">Response</h2>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${
                        response.status >= 200 && response.status < 300
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {response.status} {response.statusText}
                    </span>
                  </div>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              Select an endpoint to start testing
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
