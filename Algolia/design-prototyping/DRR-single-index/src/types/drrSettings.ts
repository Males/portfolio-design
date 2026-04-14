/** Shared shape for Control, Variation A, and Variation B settings snapshots. */
export interface DRRSettingsSnapshot {
  goal: string;
  eventSourceIndex: string;
  hourlyRefresh: boolean;
  multiSignalRanking: "head-only" | "augmented" | "combined";
  rerankedEmptyQueries: boolean;
  browsingFacetsCount: number;
  eventFreshness: boolean;
  groupSimilarQueries: boolean;
  groupSimilarQueriesLang: string;
  reRankingFilter: { attribute: string; operator: string; value: string };
  /** Prototype: short label for A/B build & review cards (e.g. “Clicks + Conv.”). */
  abTestStrategyLabel?: string;
  /** Prototype: boost factor line (e.g. “1.2x”). */
  abTestBoostFactor?: string;
}

/** Left/right pane selection in the comparison UI. */
export type ComparisonPaneMode = "drr-off" | "control" | "variant-a" | "variant-b";
