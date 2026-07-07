/**
 * StoryForge Engine API Client
 * Handles communication with the Python FastAPI backend
 */

export interface EngineConfig {
  baseUrl: string;
  apiKey?: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  providers: string[];
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

export interface SimulateRequest {
  product: string;
  material?: string;
  parameters?: Record<string, any>;
}

export interface SimulateResponse {
  success: boolean;
  simulation_id?: string;
  results?: any;
  error?: string;
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

export class EngineClient {
  private config: EngineConfig;

  constructor(config: EngineConfig) {
    this.config = config;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.config.apiKey && { 'X-API-Key': this.config.apiKey }),
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Engine API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  async scrape(request: ScrapeRequest): Promise<ScrapeResponse> {
    return this.request<ScrapeResponse>('/api/scrape', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async simulate(request: SimulateRequest): Promise<SimulateResponse> {
    return this.request<SimulateResponse>('/api/simulate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    return this.request<GenerateResponse>('/api/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getOpenApiSpec(): Promise<any> {
    return this.request<any>('/openapi.json');
  }
}

export const createEngineClient = (config?: Partial<EngineConfig>): EngineClient => {
  return new EngineClient({
    baseUrl: process.env.NEXT_PUBLIC_ENGINE_URL || 'http://localhost:8000',
    ...config,
  });
};
