'use client';

import { useState, useEffect, useCallback } from 'react';

const ENGINE_URL = process.env.NEXT_PUBLIC_ENGINE_URL || 'http://localhost:8000';
const MCP_URL = process.env.NEXT_PUBLIC_MCP_URL || 'http://localhost:8003';

export interface HealthStatus {
  engine: boolean;
  mcp: boolean;
  billing: boolean;
  ingestion: boolean;
}

export interface EngineHealth {
  status: string;
  version: string;
  providers: string[];
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema: any;
}

export interface GenerateRequest {
  prompt: string;
  type?: 'landing' | 'video' | 'presentation';
  context?: Record<string, any>;
}

export interface GenerateResponse {
  success: boolean;
  output?: any;
  provider_used?: string;
  credits_consumed?: number;
  error?: string;
}

export interface ScrapeRequest {
  url: string;
  selectors?: Record<string, string>;
}

export interface ScrapeResponse {
  success: boolean;
  data?: Record<string, any>;
  error?: string;
}

export function useEngineHealth() {
  const [health, setHealth] = useState<HealthStatus>({
    engine: false,
    mcp: false,
    billing: false,
    ingestion: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const [engineRes, mcpRes] = await Promise.allSettled([
          fetch(`${ENGINE_URL}/health`),
          fetch(`${MCP_URL}/mcp/health`),
        ]);

        setHealth({
          engine: engineRes.status === 'fulfilled' && engineRes.value.ok,
          mcp: mcpRes.status === 'fulfilled' && mcpRes.value.ok,
          billing: true, // Assume billing is available
          ingestion: true, // Assume ingestion is available
        });
      } catch {
        setHealth({
          engine: false,
          mcp: false,
          billing: false,
          ingestion: false,
        });
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, []);

  return { health, loading };
}

export function useEngineApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (request: GenerateRequest): Promise<GenerateResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${ENGINE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const scrape = useCallback(async (request: ScrapeRequest): Promise<ScrapeResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${ENGINE_URL}/api/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const simulate = useCallback(async (product: string, material?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${ENGINE_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, material }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { generate, scrape, simulate, loading, error };
}

export function useMcpTools() {
  const [tools, setTools] = useState<McpTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch(`${MCP_URL}/mcp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/list',
            params: {},
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch MCP tools');
        }

        const data = await response.json();
        setTools(data.result?.tools || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  return { tools, loading, error };
}
