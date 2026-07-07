/**
 * Token Optimization Metrics Dashboard
 * Shows savings from RTK, /compact, /clear, and Subagents
 */

import React, { useState, useEffect } from 'react';

interface OptimizationStats {
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

interface BudgetStatus {
  total_cost_usd: number;
  monthly_budget_usd: number;
  within_budget: boolean;
  remaining_budget_usd: number;
  cost_by_provider: Record<string, number>;
}

export default function MetricsPage() {
  const [stats, setStats] = useState<OptimizationStats | null>(null);
  const [budget, setBudget] = useState<BudgetStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      // In production, these would be API calls to the engine
      // For now, we show mock data
      setStats({
        rtk: {
          commands_processed: 127,
          tokens_saved: 89400,
          savings_percent: 78.5
        },
        compact: {
          auto_compacts: 23,
          estimated_tokens_saved: 45000
        },
        sessions: {
          clears: 45,
          active_sessions: 3
        },
        subagents: {
          speedup: 2.8
        },
        total: {
          tokens_saved: 134400,
          cost_savings_usd: 18.82
        }
      });

      setBudget({
        total_cost_usd: 2.18,
        monthly_budget_usd: 10.0,
        within_budget: true,
        remaining_budget_usd: 7.82,
        cost_by_provider: {
          Ollama: 0,
          'Google AI Studio': 0,
          'Antigravity Bridge': 0,
          DeepSeek: 2.18
        }
      });

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading metrics...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Token Optimization Metrics</h1>

      {/* Total Savings Card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 mb-8 text-white">
        <h2 className="text-2xl font-semibold mb-2">Total Savings</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-4xl font-bold">{stats?.total.tokens_saved.toLocaleString()}</p>
            <p className="text-green-100">Tokens Saved</p>
          </div>
          <div>
            <p className="text-4xl font-bold">${stats?.total.cost_savings_usd.toFixed(2)}</p>
            <p className="text-green-100">Cost Savings (USD)</p>
          </div>
        </div>
      </div>

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* RTK Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            RTK (CLI Compression)
          </h3>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-blue-600">
              {stats?.rtk.savings_percent.toFixed(1)}%
            </p>
            <p className="text-gray-600">Average Savings</p>
            <div className="text-sm text-gray-500">
              <p>{stats?.rtk.commands_processed} commands processed</p>
              <p>{stats?.rtk.tokens_saved.toLocaleString()} tokens saved</p>
            </div>
          </div>
        </div>

        {/* /compact Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">📦</span>
            /compact (Auto-Compress)
          </h3>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-purple-600">
              {stats?.compact.auto_compacts}
            </p>
            <p className="text-gray-600">Auto-Compacts Triggered</p>
            <div className="text-sm text-gray-500">
              <p>{stats?.compact.estimated_tokens_saved.toLocaleString()} tokens saved</p>
            </div>
          </div>
        </div>

        {/* /clear Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">🧹</span>
            /clear (Session Reset)
          </h3>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-orange-600">
              {stats?.sessions.clears}
            </p>
            <p className="text-gray-600">Sessions Cleared</p>
            <div className="text-sm text-gray-500">
              <p>{stats?.sessions.active_sessions} active sessions</p>
            </div>
          </div>
        </div>

        {/* Subagents Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-cyan-500">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">🚀</span>
            Subagents (Parallel)
          </h3>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-cyan-600">
              {stats?.subagents.speedup.toFixed(1)}x
            </p>
            <p className="text-gray-600">Execution Speedup</p>
            <div className="text-sm text-gray-500">
              <p>3x faster with parallel execution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Budget Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Monthly Budget</span>
                <span className="font-semibold">
                  ${budget?.total_cost_usd.toFixed(2)} / ${budget?.monthly_budget_usd.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{
                    width: `${((budget?.total_cost_usd || 0) / (budget?.monthly_budget_usd || 10)) * 100}%`
                  }}
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <p>Remaining: ${budget?.remaining_budget_usd.toFixed(2)}</p>
              <p className={budget?.within_budget ? 'text-green-600' : 'text-red-600'}>
                {budget?.within_budget ? '✓ Within budget' : '✗ Over budget'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Cost by Provider</h3>
            <div className="space-y-2">
              {Object.entries(budget?.cost_by_provider || {}).map(([provider, cost]) => (
                <div key={provider} className="flex justify-between">
                  <span className="text-gray-600">{provider}</span>
                  <span className="font-mono">${cost.toFixed(4)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Strategies */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Optimization Strategies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">How It Works</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span><strong>RTK:</strong> Compresses CLI output before it enters context (60-90% savings)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span><strong>/compact:</strong> Auto-summarizes long contexts when approaching limit</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span><strong>/clear:</strong> Isolates each task in clean session (no context pollution)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4.</span>
                <span><strong>Subagents:</strong> Parallel execution for 3x speedup on independent tasks</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Expected Savings</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Component</th>
                    <th className="text-right py-2">Before</th>
                    <th className="text-right py-2">After</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">CLI Output</td>
                    <td className="text-right">$5.00</td>
                    <td className="text-right text-green-600">$0.50-2.00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Context Management</td>
                    <td className="text-right">$8.00</td>
                    <td className="text-right text-green-600">$2.40-3.20</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Session Isolation</td>
                    <td className="text-right">$3.00</td>
                    <td className="text-right text-green-600">$0.00</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Total</td>
                    <td className="text-right font-semibold">$16.00</td>
                    <td className="text-right font-semibold text-green-600">$2.90-5.20</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-2 text-sm text-gray-500">
                Estimated savings: 65-75% (~$11-13/month)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Metrics refresh automatically every 30 seconds</p>
        <p className="mt-1">
          Powered by Cost-Zero Router • RTK Wrapper • Context Manager • SubAgent Manager
        </p>
      </div>
    </div>
  );
}
