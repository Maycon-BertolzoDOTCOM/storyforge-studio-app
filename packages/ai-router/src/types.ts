export interface ProviderConfig {
  id: string;
  costTier: number;
  freeCreditLimit: number;
  envKey?: string;
  call: (input: string, options: Record<string, unknown>, signal?: AbortSignal) => Promise<ProviderResult>;
}

export interface ProviderResult {
  success: boolean;
  output?: string;
  fidelity?: number;
  error?: string;
}

export interface DifficultyResult {
  difficulty: "low" | "medium" | "high";
  score: number;
  reasons: string[];
}

export interface RouteResult {
  success: boolean;
  provider: string;
  difficulty: string;
  output?: string;
  fidelity?: number;
  fallback?: boolean;
  fallbackDescription?: string;
}

export interface CreditState {
  used: number;
  remaining: number | null;
}

export interface ProviderMetrics {
  calls: number;
  successes: number;
  totalLatencyMs: number;
  totalFidelity: number;
}

export interface Job<T = unknown> {
  id: string;
  clientId: string;
  cacheKey: string;
  webhookUrl?: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  createdAt: number;
  result: T | null;
  error: string | null;
}
