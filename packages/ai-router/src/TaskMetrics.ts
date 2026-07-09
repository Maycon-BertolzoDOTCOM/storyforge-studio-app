import type { ProviderConfig, ProviderMetrics } from "./types";

/**
 * Stores performance metrics per provider per difficulty level.
 * Used for IRT-inspired routing decisions.
 * Extracted from MaterialView-Pro TaskMetrics.
 */
export class TaskMetrics {
  private metrics: Map<string, Map<string, ProviderMetrics>>;

  constructor() {
    this.metrics = new Map();
  }

  record(
    providerId: string,
    difficulty: string,
    { success, latencyMs, fidelity = 0 }: { success: boolean; latencyMs: number; fidelity?: number },
  ): void {
    if (!this.metrics.has(providerId)) {
      this.metrics.set(providerId, new Map());
    }
    const providerMetrics = this.metrics.get(providerId)!;
    if (!providerMetrics.has(difficulty)) {
      providerMetrics.set(difficulty, {
        calls: 0,
        successes: 0,
        totalLatencyMs: 0,
        totalFidelity: 0,
      });
    }
    const m = providerMetrics.get(difficulty)!;
    m.calls++;
    if (success) {
      m.successes++;
      m.totalLatencyMs += latencyMs;
      m.totalFidelity += fidelity;
    }
  }

  /**
   * Composite score: successRate × (α×fidelity + β×latencyScore + γ×costEfficiency)
   */
  getScore(providerId: string, difficulty: string, costTier = 1): number | null {
    const providerMetrics = this.metrics.get(providerId);
    if (!providerMetrics) return null;
    const m = providerMetrics.get(difficulty);
    if (!m || m.calls === 0) return null;

    const successRate = m.successes / m.calls;
    const avgFidelity = m.successes > 0 ? m.totalFidelity / m.successes : 0;
    const avgLatencyMs = m.successes > 0 ? m.totalLatencyMs / m.successes : 45000;
    const latencyScore = 1 / (1 + avgLatencyMs / 45000);
    const costEfficiency = Math.max(0.4, 1.0 - costTier * 0.2);

    return successRate * (0.5 * avgFidelity + 0.3 * latencyScore + 0.2 * costEfficiency);
  }

  getBestForBudget(
    difficulty: string,
    maxCostTier: number,
    providers: ProviderConfig[],
  ): ProviderConfig | null {
    const eligible = providers.filter((p) => p.costTier <= maxCostTier);
    if (eligible.length === 0) return null;

    let best: ProviderConfig | null = null;
    let bestScore = -1;

    for (const provider of eligible) {
      const score = this.getScore(provider.id, difficulty, provider.costTier);
      if (score !== null && score > bestScore) {
        bestScore = score;
        best = provider;
      }
    }
    return best;
  }

  getRanking(
    difficulty: string,
    providers: ProviderConfig[],
  ): { id: string; score: number }[] {
    const costMap = new Map(providers.map((p) => [p.id, p.costTier]));
    const entries: { id: string; score: number }[] = [];

    for (const [id] of this.metrics) {
      const score = this.getScore(id, difficulty, costMap.get(id) ?? 1);
      if (score !== null) {
        entries.push({ id, score });
      }
    }
    return entries.sort((a, b) => b.score - a.score);
  }

  getAll(): Record<string, Record<string, ProviderMetrics>> {
    const result: Record<string, Record<string, ProviderMetrics>> = {};
    for (const [providerId, diffMap] of this.metrics) {
      result[providerId] = {};
      for (const [difficulty, metrics] of diffMap) {
        result[providerId][difficulty] = { ...metrics };
      }
    }
    return result;
  }
}
