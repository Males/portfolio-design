import { ExternalLink, Info } from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { diffSettings } from "../lib/configDiff";
import type { DRRSettingsSnapshot } from "../types/drrSettings";
import { SelectInput } from "./SettingsFormColumn";
import Toggle from "./Toggle";

const MULTI_SIGNAL_OPTIONS = [
  { value: "head-only" as const, label: "Head queries only", desc: "Use conversion and click events." },
  {
    value: "augmented" as const,
    label: "Head and long tail queries (Augmented)",
    desc: "Use conversion and click events on head queries, and smart predictions on long tail queries for broader coverage.",
  },
  {
    value: "combined" as const,
    label: "Head and long tail queries (Combined)",
    desc: "Use conversion and click events WITH smart predictions on head queries, and smart predictions on long tail queries for maximum reach.",
  },
] as const;

function CompareRow({
  label,
  hint,
  highlightLeft,
  highlightRight,
  left,
  right,
}: {
  label: string;
  hint?: ReactNode;
  highlightLeft?: boolean;
  highlightRight?: boolean;
  left: ReactNode;
  right: ReactNode;
}) {
  const cell = (highlight: boolean | undefined, node: ReactNode) => (
    <div
      className={`min-w-0 rounded-lg p-1 -m-1 transition-colors ${
        highlight ? "bg-amber-500/8 ring-1 ring-amber-500/25" : ""
      }`}
    >
      {node}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(200px,26%)_minmax(0,1fr)_minmax(0,1fr)] gap-4 gap-y-3 items-start pb-6 border-b border-border-subtle/70 last:border-0 last:pb-0">
      <div className="min-w-0">
        <div className="text-sm font-medium text-ink">{label}</div>
        {hint != null && <div className="mt-1.5 text-xs text-subdued leading-relaxed">{hint}</div>}
      </div>
      {cell(highlightLeft, left)}
      {cell(highlightRight, right)}
    </div>
  );
}

export interface SettingsCompareFormProps {
  leftPaneId: string;
  rightPaneId: string;
  leftLabel: string;
  rightLabel: string;
  leftConfig: DRRSettingsSnapshot;
  rightConfig: DRRSettingsSnapshot;
  leftEditable: boolean;
  rightEditable: boolean;
  onPatchLeft: (patch: Partial<DRRSettingsSnapshot>) => void;
  onPatchRight: (patch: Partial<DRRSettingsSnapshot>) => void;
}

export default function SettingsCompareForm({
  leftPaneId,
  rightPaneId,
  leftLabel,
  rightLabel,
  leftConfig,
  rightConfig,
  leftEditable,
  rightEditable,
  onPatchLeft,
  onPatchRight,
}: SettingsCompareFormProps) {
  const diffKeySet = useMemo(() => {
    const rows = diffSettings(leftConfig, rightConfig);
    return new Set(rows.map((r) => r.key));
  }, [leftConfig, rightConfig]);

  const dl = !leftEditable;
  const dr = !rightEditable;

  const patchL = (patch: Partial<DRRSettingsSnapshot>) => {
    if (leftEditable) onPatchLeft(patch);
  };
  const patchR = (patch: Partial<DRRSettingsSnapshot>) => {
    if (rightEditable) onPatchRight(patch);
  };

  const learn = (
    <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
      Learn more <ExternalLink size={10} />
    </a>
  );

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <div className="hidden lg:grid grid-cols-[minmax(200px,26%)_minmax(0,1fr)_minmax(0,1fr)] gap-4 text-[11px] font-semibold uppercase tracking-wide text-subdued px-1">
        <span>Setting</span>
        <span className="truncate">{leftLabel}</span>
        <span className="truncate">{rightLabel}</span>
      </div>

      <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-ink mb-5">General</h3>
        <div className="flex flex-col gap-6">
          <CompareRow
            label="Goal"
            hint={
              <>
                Define what Re-Ranking is optimising for. {learn}
              </>
            }
            highlightLeft={diffKeySet.has("goal")}
            highlightRight={diffKeySet.has("goal")}
            left={
              <SelectInput
                value={leftConfig.goal}
                options={["Conversion rate", "Revenue"]}
                onChange={(v) => patchL({ goal: v })}
                disabled={dl}
              />
            }
            right={
              <SelectInput
                value={rightConfig.goal}
                options={["Conversion rate", "Revenue"]}
                onChange={(v) => patchR({ goal: v })}
                disabled={dr}
              />
            }
          />
          <CompareRow
            label="Event source index"
            hint={
              <>
                You can use another index as the source for the events. {learn}
              </>
            }
            highlightLeft={diffKeySet.has("eventSourceIndex")}
            highlightRight={diffKeySet.has("eventSourceIndex")}
            left={
              <SelectInput
                value={leftConfig.eventSourceIndex}
                options={["Adam_Test_2000", "prod_index_main", "staging_index"]}
                onChange={(v) => patchL({ eventSourceIndex: v })}
                disabled={dl}
              />
            }
            right={
              <SelectInput
                value={rightConfig.eventSourceIndex}
                options={["Adam_Test_2000", "prod_index_main", "staging_index"]}
                onChange={(v) => patchR({ eventSourceIndex: v })}
                disabled={dr}
              />
            }
          />
          <CompareRow
            label="Hourly refresh"
            hint={
              <>
                Turn on to refresh your re-ranked queries and browsing facets hourly. {learn}
              </>
            }
            highlightLeft={diffKeySet.has("hourlyRefresh")}
            highlightRight={diffKeySet.has("hourlyRefresh")}
            left={
              <div className="flex justify-end lg:justify-start pt-0.5">
                <Toggle
                  checked={leftConfig.hourlyRefresh}
                  onChange={(v) => patchL({ hourlyRefresh: v })}
                  disabled={dl}
                />
              </div>
            }
            right={
              <div className="flex justify-end lg:justify-start pt-0.5">
                <Toggle
                  checked={rightConfig.hourlyRefresh}
                  onChange={(v) => patchR({ hourlyRefresh: v })}
                  disabled={dr}
                />
              </div>
            }
          />
        </div>
      </div>

      <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-ink mb-5">Coverage</h3>
        <div className="flex flex-col gap-6">
          <div className="pb-6 border-b border-border-subtle/70">
            <div className="text-sm font-medium text-ink mb-4">Multi-signal ranking</div>

            {/* Desktop: one description column + compact radio columns */}
            <div
              className={`hidden lg:flex lg:flex-col gap-4 rounded-lg p-2 -m-2 ${
                diffKeySet.has("multiSignalRanking") ? "bg-amber-500/8 ring-1 ring-amber-500/25" : ""
              }`}
            >
              <div className="grid grid-cols-[minmax(220px,1fr)_minmax(88px,1fr)_minmax(88px,1fr)] gap-x-4 items-end">
                <div aria-hidden className="min-h-[1.25rem]" />
                <div className="text-[11px] font-semibold uppercase tracking-wide text-subdued text-center px-1">
                  {leftLabel}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-subdued text-center px-1">
                  {rightLabel}
                </div>
              </div>
              {MULTI_SIGNAL_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  className="grid grid-cols-[minmax(220px,1fr)_minmax(88px,1fr)_minmax(88px,1fr)] gap-x-4 items-start"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-sm font-medium text-ink">{opt.label}</div>
                    <p className="text-xs text-subdued leading-relaxed mt-1">
                      {opt.desc} {learn}
                    </p>
                  </div>
                  <div className="flex justify-center items-start pt-1">
                    <label className={dl ? "cursor-default" : "cursor-pointer"}>
                      <span className="sr-only">
                        {leftLabel}: {opt.label}
                      </span>
                      <input
                        type="radio"
                        name={`${leftPaneId}-prodMultiSignal`}
                        checked={leftConfig.multiSignalRanking === opt.value}
                        onChange={() => patchL({ multiSignalRanking: opt.value })}
                        disabled={dl}
                        className="accent-primary disabled:opacity-50 size-4"
                      />
                    </label>
                  </div>
                  <div className="flex justify-center items-start pt-1">
                    <label className={dr ? "cursor-default" : "cursor-pointer"}>
                      <span className="sr-only">
                        {rightLabel}: {opt.label}
                      </span>
                      <input
                        type="radio"
                        name={`${rightPaneId}-prodMultiSignal`}
                        checked={rightConfig.multiSignalRanking === opt.value}
                        onChange={() => patchR({ multiSignalRanking: opt.value })}
                        disabled={dr}
                        className="accent-primary disabled:opacity-50 size-4"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile: shared copy per option; radios paired below */}
            <div
              className={`lg:hidden flex flex-col gap-5 rounded-lg p-3 -m-1 ${
                diffKeySet.has("multiSignalRanking") ? "bg-amber-500/8 ring-1 ring-amber-500/25" : ""
              }`}
            >
              {MULTI_SIGNAL_OPTIONS.map((opt) => (
                <div key={opt.value} className="min-w-0">
                  <div className="text-sm font-medium text-ink">{opt.label}</div>
                  <p className="text-xs text-subdued leading-relaxed mt-1">
                    {opt.desc} {learn}
                  </p>
                  <div className="flex flex-wrap items-center gap-6 mt-3">
                    <label className={`flex items-center gap-2 ${dl ? "cursor-default" : "cursor-pointer"}`}>
                      <input
                        type="radio"
                        name={`${leftPaneId}-prodMultiSignal`}
                        checked={leftConfig.multiSignalRanking === opt.value}
                        onChange={() => patchL({ multiSignalRanking: opt.value })}
                        disabled={dl}
                        className="accent-primary disabled:opacity-50 size-4"
                      />
                      <span className="text-xs font-medium text-subdued">{leftLabel}</span>
                    </label>
                    <label className={`flex items-center gap-2 ${dr ? "cursor-default" : "cursor-pointer"}`}>
                      <input
                        type="radio"
                        name={`${rightPaneId}-prodMultiSignal`}
                        checked={rightConfig.multiSignalRanking === opt.value}
                        onChange={() => patchR({ multiSignalRanking: opt.value })}
                        disabled={dr}
                        className="accent-primary disabled:opacity-50 size-4"
                      />
                      <span className="text-xs font-medium text-subdued">{rightLabel}</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <CompareRow
            label="Browsing facets"
            hint={
              <>
                If Algolia powers your navigation, pick a browsing facet to dynamically re-rank empty queries. {learn}
              </>
            }
            left={
              <button
                type="button"
                disabled={dl}
                className="w-full py-2.5 text-sm text-ink border border-dashed border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add new browsing facet
              </button>
            }
            right={
              <button
                type="button"
                disabled={dr}
                className="w-full py-2.5 text-sm text-ink border border-dashed border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add new browsing facet
              </button>
            }
          />

          <CompareRow
            label="Re-ranked empty queries"
            hint={
              <>
                Turn on to re-rank all the empty queries. {learn}
              </>
            }
            highlightLeft={diffKeySet.has("rerankedEmptyQueries")}
            highlightRight={diffKeySet.has("rerankedEmptyQueries")}
            left={
              <div className="flex justify-end lg:justify-start pt-0.5">
                <Toggle
                  checked={leftConfig.rerankedEmptyQueries}
                  onChange={(v) => patchL({ rerankedEmptyQueries: v })}
                  disabled={dl}
                />
              </div>
            }
            right={
              <div className="flex justify-end lg:justify-start pt-0.5">
                <Toggle
                  checked={rightConfig.rerankedEmptyQueries}
                  onChange={(v) => patchR({ rerankedEmptyQueries: v })}
                  disabled={dr}
                />
              </div>
            }
          />

          {(leftConfig.rerankedEmptyQueries || rightConfig.rerankedEmptyQueries) && (
            <div className="flex items-start gap-2 p-3 bg-bg-sidebar rounded-lg">
              <Info size={14} className="text-subdued mt-0.5 shrink-0" />
              <p className="text-xs text-subdued leading-relaxed">
                Re-ranked empty queries is temporarily unavailable if you have at least one browsing facet set.
              </p>
            </div>
          )}

          <CompareRow
            label="Browsing facets count"
            hint={
              <>
                Maximum number of hits pushed by re-ranking to the top at most. {learn}
              </>
            }
            highlightLeft={diffKeySet.has("browsingFacetsCount")}
            highlightRight={diffKeySet.has("browsingFacetsCount")}
            left={
              <input
                type="number"
                value={leftConfig.browsingFacetsCount}
                disabled={dl}
                onChange={(e) => patchL({ browsingFacetsCount: Number(e.target.value) })}
                className="w-full max-w-[140px] px-3 py-2.5 text-sm text-ink bg-bg-surface border border-border-subtle rounded-lg disabled:opacity-60"
              />
            }
            right={
              <input
                type="number"
                value={rightConfig.browsingFacetsCount}
                disabled={dr}
                onChange={(e) => patchR({ browsingFacetsCount: Number(e.target.value) })}
                className="w-full max-w-[140px] px-3 py-2.5 text-sm text-ink bg-bg-surface border border-border-subtle rounded-lg disabled:opacity-60"
              />
            }
          />
        </div>
      </div>

      <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-ink mb-5">Ordering</h3>
        <div className="flex flex-col gap-6">
          <CompareRow
            label="Event freshness"
            hint={
              <>
                Turn on to take seasonality into account. {learn}
              </>
            }
            highlightLeft={diffKeySet.has("eventFreshness")}
            highlightRight={diffKeySet.has("eventFreshness")}
            left={
              <div className="flex justify-end lg:justify-start pt-0.5">
                <Toggle
                  checked={leftConfig.eventFreshness}
                  onChange={(v) => patchL({ eventFreshness: v })}
                  disabled={dl}
                />
              </div>
            }
            right={
              <div className="flex justify-end lg:justify-start pt-0.5">
                <Toggle
                  checked={rightConfig.eventFreshness}
                  onChange={(v) => patchR({ eventFreshness: v })}
                  disabled={dr}
                />
              </div>
            }
          />

          <CompareRow
            label="Group similar queries"
            hint={
              <>
                Turn on to cluster similar queries when re-ranking. {learn}
              </>
            }
            highlightLeft={diffKeySet.has("groupSimilarQueries") || diffKeySet.has("groupSimilarQueriesLang")}
            highlightRight={diffKeySet.has("groupSimilarQueries") || diffKeySet.has("groupSimilarQueriesLang")}
            left={
              <div className="flex flex-col gap-2">
                <div className="flex justify-end lg:justify-start">
                  <Toggle
                    checked={leftConfig.groupSimilarQueries}
                    onChange={(v) => patchL({ groupSimilarQueries: v })}
                    disabled={dl}
                  />
                </div>
                {leftConfig.groupSimilarQueries && (
                  <SelectInput
                    value={leftConfig.groupSimilarQueriesLang}
                    options={["English", "French", "German", "Spanish"]}
                    onChange={(v) => patchL({ groupSimilarQueriesLang: v })}
                    disabled={dl}
                  />
                )}
              </div>
            }
            right={
              <div className="flex flex-col gap-2">
                <div className="flex justify-end lg:justify-start">
                  <Toggle
                    checked={rightConfig.groupSimilarQueries}
                    onChange={(v) => patchR({ groupSimilarQueries: v })}
                    disabled={dr}
                  />
                </div>
                {rightConfig.groupSimilarQueries && (
                  <SelectInput
                    value={rightConfig.groupSimilarQueriesLang}
                    options={["English", "French", "German", "Spanish"]}
                    onChange={(v) => patchR({ groupSimilarQueriesLang: v })}
                    disabled={dr}
                  />
                )}
              </div>
            }
          />

          <CompareRow
            label="Re-ranking filter"
            hint={
              <>
                Only re-rank items that match this condition. Only items matching the configured filter will be promoted.{" "}
                {learn}
              </>
            }
            highlightLeft={diffKeySet.has("reRankingFilter")}
            highlightRight={diffKeySet.has("reRankingFilter")}
            left={
              <div className="flex flex-col gap-2 min-w-0 w-full">
                <input
                  type="text"
                  placeholder="e.g. InStock"
                  value={leftConfig.reRankingFilter.attribute}
                  disabled={dl}
                  onChange={(e) =>
                    patchL({
                      reRankingFilter: { ...leftConfig.reRankingFilter, attribute: e.target.value },
                    })
                  }
                  className="w-full min-w-0 px-3 py-2.5 text-sm text-ink bg-bg-surface border border-border-subtle rounded-lg placeholder:text-subdued/60 disabled:opacity-60"
                />
                <div className="w-full min-w-0">
                  <SelectInput
                    value={leftConfig.reRankingFilter.operator}
                    options={["is", "is not", "contains"]}
                    onChange={(v) =>
                      patchL({
                        reRankingFilter: { ...leftConfig.reRankingFilter, operator: v },
                      })
                    }
                    disabled={dl}
                  />
                </div>
                <input
                  type="text"
                  placeholder="e.g. True"
                  value={leftConfig.reRankingFilter.value}
                  disabled={dl}
                  onChange={(e) =>
                    patchL({
                      reRankingFilter: { ...leftConfig.reRankingFilter, value: e.target.value },
                    })
                  }
                  className="w-full min-w-0 px-3 py-2.5 text-sm text-ink bg-bg-surface border border-border-subtle rounded-lg placeholder:text-subdued/60 disabled:opacity-60"
                />
              </div>
            }
            right={
              <div className="flex flex-col gap-2 min-w-0 w-full">
                <input
                  type="text"
                  placeholder="e.g. InStock"
                  value={rightConfig.reRankingFilter.attribute}
                  disabled={dr}
                  onChange={(e) =>
                    patchR({
                      reRankingFilter: { ...rightConfig.reRankingFilter, attribute: e.target.value },
                    })
                  }
                  className="w-full min-w-0 px-3 py-2.5 text-sm text-ink bg-bg-surface border border-border-subtle rounded-lg placeholder:text-subdued/60 disabled:opacity-60"
                />
                <div className="w-full min-w-0">
                  <SelectInput
                    value={rightConfig.reRankingFilter.operator}
                    options={["is", "is not", "contains"]}
                    onChange={(v) =>
                      patchR({
                        reRankingFilter: { ...rightConfig.reRankingFilter, operator: v },
                      })
                    }
                    disabled={dr}
                  />
                </div>
                <input
                  type="text"
                  placeholder="e.g. True"
                  value={rightConfig.reRankingFilter.value}
                  disabled={dr}
                  onChange={(e) =>
                    patchR({
                      reRankingFilter: { ...rightConfig.reRankingFilter, value: e.target.value },
                    })
                  }
                  className="w-full min-w-0 px-3 py-2.5 text-sm text-ink bg-bg-surface border border-border-subtle rounded-lg placeholder:text-subdued/60 disabled:opacity-60"
                />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
