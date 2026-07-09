import type { DifficultyResult } from "./types";

/**
 * Estimates task difficulty based on input characteristics.
 * Low = simple → free provider. High = complex → premium provider.
 * Extracted from MaterialView-Pro DifficultyEstimator.
 */
export function estimateDifficulty(
  inputSize: number,
  context?: { complexity?: number; objects?: number },
): DifficultyResult {
  const reasons: string[] = [];
  let score = 0;

  if (inputSize > 800_000) {
    score += 2;
    reasons.push(`large_input(${Math.round(inputSize / 1000)}KB)`);
  } else if (inputSize > 200_000) {
    score += 1;
    reasons.push(`medium_input(${Math.round(inputSize / 1000)}KB)`);
  }

  const objectCount = context?.objects || 0;
  if (objectCount > 5) {
    score += 2;
    reasons.push(`complex_scene(${objectCount}_objects)`);
  } else if (objectCount > 2) {
    score += 1;
    reasons.push(`moderate_scene(${objectCount}_objects)`);
  }

  const complexity = context?.complexity || 0;
  if (complexity > 7) {
    score += 2;
    reasons.push(`high_complexity(${complexity})`);
  } else if (complexity > 4) {
    score += 1;
    reasons.push(`moderate_complexity(${complexity})`);
  }

  let difficulty: "low" | "medium" | "high";
  if (score <= 1) {
    difficulty = "low";
  } else if (score <= 3) {
    difficulty = "medium";
  } else {
    difficulty = "high";
  }

  return { difficulty, score, reasons };
}

export function getMinCostTierForDifficulty(
  difficulty: "low" | "medium" | "high",
): number {
  switch (difficulty) {
    case "high":
      return 1;
    case "medium":
      return 0;
    case "low":
    default:
      return 0;
  }
}
