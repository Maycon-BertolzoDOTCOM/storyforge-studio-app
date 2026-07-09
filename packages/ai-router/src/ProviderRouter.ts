import type { ProviderConfig, RouteResult } from "./types";
import { CreditTracker } from "./CreditTracker";
import { TaskMetrics } from "./TaskMetrics";
import {
  estimateDifficulty,
  getMinCostTierForDifficulty,
} from "./DifficultyEstimator";

/**
 * Cascade AI router — tries providers from cheapest to most expensive.
 * Falls back to local/textual if all providers fail.
 * Extracted from MaterialView-Pro ProviderRouter.
 */
export class ProviderRouter {
  private providers: ProviderConfig[];
  private tracker: CreditTracker;
  private metrics: TaskMetrics;
  private timeoutMs: number;

  constructor(
    providers: ProviderConfig[],
    options: {
      tracker?: CreditTracker;
      metrics?: TaskMetrics;
      timeoutMs?: number;
    } = {},
  ) {
    this.providers = [...providers].sort(
      (a, b) => a.costTier - b.costTier,
    );
    this.tracker = options.tracker ?? new CreditTracker();
    this.metrics = options.metrics ?? new TaskMetrics();
    this.timeoutMs = options.timeoutMs ?? 45_000;
  }

  async route(
    input: string,
    context?: Record<string, unknown>,
  ): Promise<RouteResult> {
    const inputSize = typeof input === "string" ? input.length : 0;
    const { difficulty, score: diffScore, reasons } = estimateDifficulty(inputSize, {
      complexity: context?.complexity as number,
      objects: (context?.objects as unknown[])?.length,
    });
    const minCostTier = getMinCostTierForDifficulty(difficulty);

    const eligible = this.selectProviders(difficulty, minCostTier);

    for (const provider of eligible) {
      if (provider.envKey && !process.env[provider.envKey]) {
        continue;
      }
      if (this.tracker.isExhausted(provider)) {
        continue;
      }
      const startTime = Date.now();
      try {
        const result = await this.callWithTimeout(provider, input, context);
        const latencyMs = Date.now() - startTime;
        if (result.success) {
          this.tracker.increment(provider.id);
          this.metrics.record(provider.id, difficulty, {
            success: true,
            latencyMs,
            fidelity: result.fidelity ?? 0,
          });
          return {
            success: true,
            provider: provider.id,
            difficulty,
            output: result.output,
            fidelity: result.fidelity,
          };
        }
      } catch (err) {
        const latencyMs = Date.now() - startTime;
        this.metrics.record(provider.id, difficulty, {
          success: false,
          latencyMs,
        });
      }
    }

    return {
      success: false,
      fallback: true,
      provider: "local-fallback",
      difficulty,
      fallbackDescription: `All providers failed for difficulty=${difficulty} score=${diffScore} reasons=${reasons.join(",")}`,
    };
  }

  private selectProviders(
    difficulty: string,
    minCostTier: number,
  ): ProviderConfig[] {
    const ranking = this.metrics.getRanking(difficulty, this.providers);
    const rankMap = new Map(ranking.map((r, i) => [r.id, i]));

    const sorted = [...this.providers]
      .filter((p) => p.costTier >= minCostTier)
      .sort((a, b) => {
        if (a.costTier !== b.costTier) return a.costTier - b.costTier;
        const rankA = rankMap.has(a.id) ? rankMap.get(a.id)! : 999;
        const rankB = rankMap.has(b.id) ? rankMap.get(b.id)! : 999;
        return rankA - rankB;
      });

    const bestByHistory = this.metrics.getBestForBudget(
      difficulty,
      99,
      this.providers,
    );
    if (bestByHistory && rankMap.has(bestByHistory.id)) {
      const bestScore = this.metrics.getScore(
        bestByHistory.id,
        difficulty,
        bestByHistory.costTier,
      );
      if (bestScore !== null && bestScore > 0.7 && bestByHistory.costTier >= minCostTier) {
        const idx = sorted.findIndex((p) => p.id === bestByHistory.id);
        if (idx > 0) {
          sorted.splice(idx, 1);
          sorted.unshift(bestByHistory);
        }
      }
    }
    return sorted;
  }

  private async callWithTimeout(
    provider: ProviderConfig,
    input: string,
    context?: Record<string, unknown>,
  ) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      return await provider.call(input, context ?? {}, controller.signal);
    } finally {
      clearTimeout(timer);
    }
  }

  resetCredits(providerId?: string): void {
    this.tracker.reset(providerId);
  }

  getMetrics(): Record<string, Record<string, { calls: number; successes: number; totalLatencyMs: number; totalFidelity: number }>> {
    return this.metrics.getAll();
  }
}
