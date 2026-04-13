import type { ComparisonPaneMode } from "./drrSettings";

/** Variation arms available for an A/B test in this prototype. */
export type AbTestVariationId = "control" | "drr-off" | "variant-a" | "variant-b";

export function abTestVariationToPaneMode(id: AbTestVariationId): ComparisonPaneMode {
  const map: Record<AbTestVariationId, ComparisonPaneMode> = {
    control: "control",
    "drr-off": "drr-off",
    "variant-a": "variant-a",
    "variant-b": "variant-b",
  };
  return map[id];
}

export const AB_TEST_VARIATION_LABELS: Record<AbTestVariationId, string> = {
  control: "Control (live)",
  "drr-off": "DRR off",
  "variant-a": "Variation A",
  "variant-b": "Variation B",
};

/** Running test shown on Explore after the user completes the A/B flow (prototype only). */
export interface ActiveAbTest {
  id: string;
  /** Display title (Evolved A/B test header). */
  name: string;
  /** When the prototype “started” the test (for date range + progress). */
  startedAtMs: number;
  variationIds: AbTestVariationId[];
  trafficSplit: number[];
  durationDays: number;
  /** Set when the user ends the test early (Explore) — treated as completed for results / apply. */
  endedAtMs?: number;
  /** After a winning configuration is applied to live (prototype). */
  appliedVariationId?: AbTestVariationId;
}

export type IllustrativeCvrCell = { kind: "baseline" | "delta"; text: string };

/** Illustrative metrics + CVR rates for the prototype table and winner detection. */
export function getIllustrativeAbTestTableData(variationIds: AbTestVariationId[]): {
  searches: number[];
  users: number[];
  ctr: string[];
  cvr: IllustrativeCvrCell[];
  cvrRates: number[];
  winnerIndex: number;
} {
  const base = 139_998;
  const searches = variationIds.map((_, i) => Math.max(1, base - i * 1_711));
  const users = [...searches];
  const ctr = variationIds.map((_, i) => `${(29.3 - i * 0.3).toFixed(1)}%`);

  const defaults = [3.2, 3.34, 3.41, 3.15];
  const cvrRates = variationIds.map((_, i) => defaults[i] ?? 3.1 - i * 0.02);

  let winnerIndex = 0;
  for (let i = 1; i < cvrRates.length; i++) {
    if (cvrRates[i] > cvrRates[winnerIndex]) winnerIndex = i;
  }

  const baseline = cvrRates[0] ?? 3.2;
  const cvr: IllustrativeCvrCell[] = variationIds.map((_, i) => {
    if (i === 0) return { kind: "baseline", text: "Baseline" };
    const deltaPct = ((cvrRates[i] - baseline) / baseline) * 100;
    const sign = deltaPct >= 0 ? "+" : "";
    return { kind: "delta", text: `${sign}${deltaPct.toFixed(2)}%` };
  });

  return { searches, users, ctr, cvr, cvrRates, winnerIndex };
}

/** Completed test with a non-control arm that beats baseline on illustrative CVR. */
export function isSuccessfulAbTestOutcome(
  isComplete: boolean,
  winnerIndex: number,
  cvrRates: number[],
): boolean {
  if (!isComplete || cvrRates.length < 2) return false;
  if (winnerIndex === 0) return false;
  return cvrRates[winnerIndex] > cvrRates[0];
}

export function equalTrafficSplit(count: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [100];
  const base = Math.floor(100 / count);
  const splits = Array.from({ length: count }, () => base);
  let remainder = 100 - base * count;
  for (let i = 0; i < remainder; i++) {
    splits[i] += 1;
  }
  return splits;
}
