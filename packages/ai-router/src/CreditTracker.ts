import type { CreditState, ProviderConfig } from "./types";

/**
 * Tracks monthly credit usage per provider.
 * Resets automatically on month change.
 * Extracted from MaterialView-Pro CreditTracker.
 */
export class CreditTracker {
  private month: string;
  private counters: Map<string, number>;
  private clock: () => Date;

  constructor(clock: () => Date = () => new Date()) {
    this.clock = clock;
    this.month = this.getCurrentMonth();
    this.counters = new Map();
  }

  private getCurrentMonth(): string {
    return this.clock().toISOString().slice(0, 7);
  }

  private ensureMonth(): void {
    const current = this.getCurrentMonth();
    if (this.month !== current) {
      this.month = current;
      this.counters.clear();
    }
  }

  isExhausted(provider: ProviderConfig): boolean {
    this.ensureMonth();
    if (!provider.freeCreditLimit) return false;
    const used = this.counters.get(provider.id) || 0;
    return used >= provider.freeCreditLimit;
  }

  increment(providerId: string): void {
    this.ensureMonth();
    const current = this.counters.get(providerId) || 0;
    this.counters.set(providerId, current + 1);
  }

  getState(providerId: string, freeCreditLimit: number): CreditState {
    this.ensureMonth();
    const used = this.counters.get(providerId) || 0;
    const remaining = freeCreditLimit
      ? Math.max(0, freeCreditLimit - used)
      : null;
    return { used, remaining };
  }

  reset(providerId?: string): void {
    this.ensureMonth();
    if (providerId) {
      this.counters.set(providerId, 0);
    } else {
      this.counters.clear();
    }
  }
}
