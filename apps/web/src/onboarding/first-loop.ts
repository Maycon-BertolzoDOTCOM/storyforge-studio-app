// First-generation loop tracker (spec §8.3 loop: 写需求 → 生成 → 查看 → 修改
// → 导出/分享; §11.1 onboarding_completed).
//
// A recommendation-started project hands its entry context to Studio through
// the session slot in `onboarding-entry.ts`. This module keeps the loop's
// step ledger for the same session and fires `onboarding_completed` exactly
// once, when the loop actually CLOSES with a delivery (export / share) — the
// earlier steps ride along in `completed_steps` in the order they were first
// reached. Session-only, storage-denied-safe, and callable from anywhere
// (analytics helpers tap `delivered` without needing component wiring).

import type {
  OnboardingCompletedProps,
  TrackingOnboardingFirstLoopStep,
  TrackingOnboardingProductType,
} from '@open-design/contracts/analytics';
import type { OnboardingEntry } from './onboarding-entry';

type Track = (event: string, properties: Record<string, unknown>) => void;

const ENTRY_KEY = 'open-design:first-loop-entry';
const STEPS_KEY = 'open-design:first-loop-steps';
const DONE_KEY = 'open-design:first-loop-completed';

// Called once by the project view after it consumes the pending onboarding
// entry: pins the entry for the rest of the session so later taps (e.g. the
// share/export analytics helpers) can attribute the loop without re-plumbing
// component props.
export function beginFirstLoop(entry: OnboardingEntry): void {
  try {
    if (window.sessionStorage.getItem(ENTRY_KEY)) return;
    window.sessionStorage.setItem(ENTRY_KEY, JSON.stringify(entry));
  } catch {
    // Storage-denied contexts lose loop attribution — never throw.
  }
}

function readEntry(): OnboardingEntry | null {
  try {
    const raw = window.sessionStorage.getItem(ENTRY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OnboardingEntry>;
    if (
      parsed.source === 'home_recommendation' &&
      typeof parsed.productType === 'string' &&
      typeof parsed.recommendationId === 'string'
    ) {
      return parsed as OnboardingEntry;
    }
    return null;
  } catch {
    return null;
  }
}

function readSteps(): TrackingOnboardingFirstLoopStep[] {
  try {
    const raw = window.sessionStorage.getItem(STEPS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? (parsed.filter((s) => typeof s === 'string') as TrackingOnboardingFirstLoopStep[])
      : [];
  } catch {
    return [];
  }
}

/**
 * Record a loop step for the recommendation-started session. No-op when no
 * first loop is active (any ordinary project). Fires `onboarding_completed`
 * once — on the first `delivered` — with every step observed so far.
 */
export function recordFirstLoopStep(
  track: Track,
  step: TrackingOnboardingFirstLoopStep,
): void {
  const entry = readEntry();
  if (!entry) return;
  let steps: TrackingOnboardingFirstLoopStep[];
  try {
    steps = readSteps();
    if (!steps.includes(step)) {
      steps = [...steps, step];
      window.sessionStorage.setItem(STEPS_KEY, JSON.stringify(steps));
    }
    if (step !== 'delivered') return;
    if (window.sessionStorage.getItem(DONE_KEY) === '1') return;
    window.sessionStorage.setItem(DONE_KEY, '1');
  } catch {
    return;
  }
  const props: OnboardingCompletedProps = {
    entry_source: entry.source,
    product_type: entry.productType as TrackingOnboardingProductType,
    recommendation_id: entry.recommendationId,
    completed_steps: steps,
  };
  track('onboarding_completed', props as unknown as Record<string, unknown>);
}
