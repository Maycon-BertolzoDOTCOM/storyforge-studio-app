'use client';

import { useState, useEffect, useCallback } from 'react';

const ENGINE_URL = process.env.NEXT_PUBLIC_ENGINE_URL || 'http://localhost:8000';

export interface OptimizationStats {
  rtk: {
    commands_processed: number;
    tokens_saved: number;
    savings_percent: number;
  };
  compact: {
    auto_compacts: number;
    estimated_tokens_saved: number;
  };
  sessions: {
    clears: number;
    active_sessions: number;
  };
  subagents: {
    speedup: number;
  };
  total: {
    tokens_saved: number;
    cost_savings_usd: number;
  };
}

export interface BudgetStatus {
  total_cost_usd: number;
  monthly_budget_usd: number;
  within_budget: boolean;
  remaining_budget_usd: number;
  cost_by_provider: Record<string, number>;
}

export interface CompactResult {
  original_tokens: number;
  compressed_tokens: number;
  savings_percent: number;
}

export function useTokenOptimizer() {
  const [stats, setStats] = useState<OptimizationStats | null>(null);
  const [budget, setBudget] = useState<BudgetStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const [statsRes, budgetRes] = await Promise.allSettled([
        fetch(`${ENGINE_URL}/api/optimization/stats`),
        fetch(`${ENGINE_URL}/api/optimization/budget`),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        const statsData = await statsRes.value.json();
        setStats(statsData);
      }

      if (budgetRes.status === 'fulfilled' && budgetRes.value.ok) {
        const budgetData = await budgetRes.value.json();
        setBudget(budgetData);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch optimization stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [fetchStats]);

  const compactContext = useCallback(async (taskType: string = 'default', strategy: string = 'auto'): Promise<CompactResult | null> => {
    try {
      const response = await fetch(`${ENGINE_URL}/api/optimization/compact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_type: taskType, strategy }),
      });

      if (!response.ok) {
        throw new Error('Failed to compact context');
      }

      const result = await response.json();
      await fetchStats(); // Refresh stats
      return result;
    } catch (err) {
      console.error('Compact failed:', err);
      return null;
    }
  }, [fetchStats]);

  const clearContext = useCallback(async (taskType: string = 'default'): Promise<boolean> => {
    try {
      const response = await fetch(`${ENGINE_URL}/api/optimization/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_type: taskType }),
      });

      if (!response.ok) {
        throw new Error('Failed to clear context');
      }

      await fetchStats(); // Refresh stats
      return true;
    } catch (err) {
      console.error('Clear failed:', err);
      return false;
    }
  }, [fetchStats]);

  return {
    stats,
    budget,
    loading,
    error,
    compactContext,
    clearContext,
    refresh: fetchStats,
  };
}
