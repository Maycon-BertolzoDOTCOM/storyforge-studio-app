/**
 * token-count — precise token counting via GhostStore's token-counter endpoint.
 * Falls back to byteLength/4 estimation when the service is unavailable.
 */
import { randomUUID } from 'node:crypto';

const GHOSTSTORE_URL = process.env.GHOSTSTORE_URL || 'http://localhost:3000';
const TIMEOUT_MS = Number(process.env.TOKEN_COUNT_TIMEOUT) || 500;

export interface TokenCountResult {
  tokens: number;
  method: 'bpe' | 'estimate';
  model?: string;
}

/**
 * Precise token count using BPE (js-tiktoken) via GhostStore.
 * Async — use when accuracy > latency.
 */
export async function countTokensPrecise(text: string, model?: string): Promise<TokenCountResult> {
  if (!text) return { tokens: 0, method: 'estimate' };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const resp = await fetch(`${GHOSTSTORE_URL}/api/v1/token-count`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, model }),
      signal: controller.signal,
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json() as TokenCountResult;
    return data;
  } catch {
    return { tokens: countTokensEstimated(text), method: 'estimate', model };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Fast local estimation (4 chars/token). Sync — use when latency > accuracy.
 * Matches OpenAI's rule-of-thumb for English text.
 */
export function countTokensEstimated(text: string): number {
  if (!text?.trim()) return 0;
  return Math.max(1, Math.ceil(text.length / 4));
}

// Re-export for convenience: default to estimated, swap to precise when needed
export default countTokensEstimated;
