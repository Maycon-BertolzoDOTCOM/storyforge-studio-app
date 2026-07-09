/**
 * MaterialView Pro — StoryForge Plugin
 * Simulates materials on surfaces using AI.
 */

export interface MaterialViewConfig {
  apiUrl: string;
  apiKey?: string;
  timeout?: number;
}

export interface SimulateRequest {
  imageBase64: string;
  material: {
    type: string;
    color: string;
    dimensions: string;
  };
  context?: {
    surfaceType?: string;
    objects?: string[];
    lighting?: { direction: string };
  };
}

export interface SimulateResponse {
  success: boolean;
  editedImageBase64?: string;
  fidelity?: number;
  provider?: string;
  jobId?: string;
  invariantResult?: {
    violated: boolean;
    scores: {
      shadows: number;
      geometry: number;
      objects: number;
      perspective: number;
    };
    overallScore: number;
  };
}

export interface AnalyzeResponse {
  surfaceType: string;
  objects: string[];
  lighting: { direction: string; intensity: number };
  complexity: number;
}

export class MaterialViewClient {
  private config: MaterialViewConfig;

  constructor(config: MaterialViewConfig) {
    this.config = {
      timeout: 60000,
      ...config,
    };
  }

  async simulate(request: SimulateRequest): Promise<SimulateResponse> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.config.apiKey) {
      headers["X-API-Key"] = this.config.apiKey;
    }

    const resp = await fetch(`${this.config.apiUrl}/api/simulate`, {
      method: "POST",
      headers,
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(this.config.timeout!),
    });

    if (resp.status === 202) {
      const data = await resp.json();
      return this.pollJob(data.jobId);
    }

    if (!resp.ok) {
      const body = await resp.text();
      throw new Error(`MaterialView API error ${resp.status}: ${body}`);
    }

    return resp.json();
  }

  private async pollJob(jobId: string, maxAttempts = 60): Promise<SimulateResponse> {
    for (let i = 0; i < maxAttempts; i++) {
      const resp = await fetch(`${this.config.apiUrl}/api/simulate/${jobId}/status`);
      if (resp.ok) {
        const data = await resp.json();
        if (data.status === "completed") {
          return data.result || { success: true, fidelity: 0.8 };
        }
        if (data.status === "failed") {
          return { success: false, invariantResult: undefined };
        }
      }
      await new Promise((r) => setTimeout(r, 3000));
    }
    return { success: false };
  }

  async analyze(imageBase64: string): Promise<AnalyzeResponse> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.config.apiKey) {
      headers["X-API-Key"] = this.config.apiKey;
    }

    const resp = await fetch(`${this.config.apiUrl}/api/analyze`, {
      method: "POST",
      headers,
      body: JSON.stringify({ imageBase64 }),
    });

    if (!resp.ok) {
      throw new Error(`MaterialView analyze error ${resp.status}`);
    }

    return resp.json();
  }

  async healthCheck(): Promise<boolean> {
    try {
      const resp = await fetch(`${this.config.apiUrl}/health`);
      return resp.ok;
    } catch {
      return false;
    }
  }
}

export function createMaterialViewPlugin(config: MaterialViewConfig) {
  const client = new MaterialViewClient(config);

  return {
    name: "materialview-pro",
    version: "1.0.0",

    async simulate(input: {
      image: string;
      materialType: string;
      materialColor: string;
      surfaceType?: string;
      dimensions?: string;
    }) {
      return client.simulate({
        imageBase64: input.image,
        material: {
          type: input.materialType,
          color: input.materialColor,
          dimensions: input.dimensions || "60x60cm",
        },
        context: {
          surfaceType: input.surfaceType || "floor",
        },
      });
    },

    async analyze(image: string) {
      return client.analyze(image);
    },

    async isAvailable() {
      return client.healthCheck();
    },
  };
}
