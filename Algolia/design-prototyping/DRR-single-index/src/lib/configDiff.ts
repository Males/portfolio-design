import type { DRRSettingsSnapshot } from "../types/drrSettings";

export interface SettingsFieldDiff {
  key: string;
  label: string;
  before: string;
  after: string;
}

const LABELS: Record<string, string> = {
  abTestStrategyLabel: "Strategy",
  abTestBoostFactor: "Boost factor",
  goal: "Goal",
  eventSourceIndex: "Event source index",
  hourlyRefresh: "Hourly refresh",
  multiSignalRanking: "Multi-signal ranking",
  rerankedEmptyQueries: "Re-ranked empty queries",
  browsingFacetsCount: "Browsing facets count",
  eventFreshness: "Event freshness",
  groupSimilarQueries: "Group similar queries",
  groupSimilarQueriesLang: "Group similar queries language",
  "reRankingFilter.attribute": "Re-ranking filter attribute",
  "reRankingFilter.operator": "Re-ranking filter operator",
  "reRankingFilter.value": "Re-ranking filter value",
};

function serializeFilter(f: DRRSettingsSnapshot["reRankingFilter"]): string {
  if (!f.attribute && !f.value) return "—";
  return `${f.attribute} ${f.operator} ${f.value}`.trim();
}

export function stringifySettingValue(
  key: string,
  config: DRRSettingsSnapshot,
): string {
  if (key === "reRankingFilter") return serializeFilter(config.reRankingFilter);
  if (key === "abTestStrategyLabel") return config.abTestStrategyLabel ?? "—";
  if (key === "abTestBoostFactor") return config.abTestBoostFactor ?? "—";
  const v = config[key as keyof DRRSettingsSnapshot];
  if (typeof v === "boolean") return v ? "On" : "Off";
  if (v === undefined || v === null) return "—";
  return String(v);
}

export function diffSettings(
  baseline: DRRSettingsSnapshot,
  other: DRRSettingsSnapshot,
): SettingsFieldDiff[] {
  const keys: (keyof DRRSettingsSnapshot)[] = [
    "abTestStrategyLabel",
    "abTestBoostFactor",
    "goal",
    "eventSourceIndex",
    "hourlyRefresh",
    "multiSignalRanking",
    "rerankedEmptyQueries",
    "browsingFacetsCount",
    "eventFreshness",
    "groupSimilarQueries",
    "groupSimilarQueriesLang",
  ];
  const out: SettingsFieldDiff[] = [];
  for (const k of keys) {
    const before = stringifySettingValue(k as string, baseline);
    const after = stringifySettingValue(k as string, other);
    if (before !== after) {
      out.push({
        key: k as string,
        label: LABELS[k as string] ?? k,
        before,
        after,
      });
    }
  }
  const bf = serializeFilter(baseline.reRankingFilter);
  const af = serializeFilter(other.reRankingFilter);
  if (bf !== af) {
    out.push({
      key: "reRankingFilter",
      label: "Re-ranking filter",
      before: bf,
      after: af,
    });
  }
  return out;
}

export function allSnapshotsDifferFromControl(
  control: DRRSettingsSnapshot,
  snapshots: { label: string; config: DRRSettingsSnapshot }[],
): { label: string; diffs: SettingsFieldDiff[] }[] {
  return snapshots.map(({ label, config }) => ({
    label,
    diffs: diffSettings(control, config),
  }));
}
