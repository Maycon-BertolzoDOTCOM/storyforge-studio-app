import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { beginFirstLoop, recordFirstLoopStep } from '../src/onboarding/first-loop';

function createStorageStub() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => { store.set(key, value); },
    removeItem: (key: string) => { store.delete(key); },
    clear: () => { store.clear(); },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size; },
  };
}

const ENTRY = {
  source: 'home_recommendation' as const,
  productType: 'marketing' as const,
  recommendationId: 'marketing_landing',
};

describe('first-loop ledger', () => {
  beforeEach(() => {
    (globalThis as unknown as { window: unknown }).window = {
      sessionStorage: createStorageStub(),
    };
  });
  afterEach(() => {
    delete (globalThis as unknown as { window?: unknown }).window;
  });

  it('fires onboarding_completed once, on delivery, with the steps in order', () => {
    const track = vi.fn();
    beginFirstLoop(ENTRY);
    recordFirstLoopStep(track, 'prompt_sent');
    recordFirstLoopStep(track, 'generated');
    recordFirstLoopStep(track, 'artifact_viewed');
    expect(track).not.toHaveBeenCalled();
    recordFirstLoopStep(track, 'delivered');
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith('onboarding_completed', {
      entry_source: 'home_recommendation',
      product_type: 'marketing',
      recommendation_id: 'marketing_landing',
      completed_steps: ['prompt_sent', 'generated', 'artifact_viewed', 'delivered'],
    });
    // A second delivery does not re-fire.
    recordFirstLoopStep(track, 'delivered');
    expect(track).toHaveBeenCalledTimes(1);
  });

  it('dedupes repeated steps but keeps first-reached order', () => {
    const track = vi.fn();
    beginFirstLoop(ENTRY);
    recordFirstLoopStep(track, 'generated');
    recordFirstLoopStep(track, 'prompt_sent');
    recordFirstLoopStep(track, 'generated');
    recordFirstLoopStep(track, 'delivered');
    expect(track.mock.calls[0]?.[1]).toMatchObject({
      completed_steps: ['generated', 'prompt_sent', 'delivered'],
    });
  });

  it('is a no-op when no first loop is active (ordinary projects)', () => {
    const track = vi.fn();
    recordFirstLoopStep(track, 'delivered');
    expect(track).not.toHaveBeenCalled();
  });

  it('beginFirstLoop pins the first entry and ignores later ones', () => {
    const track = vi.fn();
    beginFirstLoop(ENTRY);
    beginFirstLoop({ ...ENTRY, recommendationId: 'other_starter' });
    recordFirstLoopStep(track, 'delivered');
    expect(track.mock.calls[0]?.[1]).toMatchObject({
      recommendation_id: 'marketing_landing',
    });
  });

  it('never throws when storage is denied', () => {
    (globalThis as unknown as { window: unknown }).window = {
      get sessionStorage(): Storage {
        throw new Error('denied');
      },
    };
    const track = vi.fn();
    expect(() => beginFirstLoop(ENTRY)).not.toThrow();
    expect(() => recordFirstLoopStep(track, 'delivered')).not.toThrow();
    expect(track).not.toHaveBeenCalled();
  });
});
