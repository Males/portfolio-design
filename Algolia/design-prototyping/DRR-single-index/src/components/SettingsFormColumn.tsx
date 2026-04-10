import { ExternalLink, Info } from "lucide-react";
import type { DRRSettingsSnapshot } from "../types/drrSettings";
import Toggle from "./Toggle";

export function SelectInput({
  value,
  options,
  onChange,
  disabled,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 pl-4 pr-9 text-sm text-ink bg-bg-surface border border-border-strong rounded appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-subdued"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="currentColor"
      >
        <path d="M3 4.5l3 3 3-3" />
      </svg>
    </div>
  );
}

export interface SettingsFormColumnProps {
  paneId: string;
  config: DRRSettingsSnapshot;
  editable: boolean;
  onPatch: (patch: Partial<DRRSettingsSnapshot>) => void;
}

export default function SettingsFormColumn({ paneId, config, editable, onPatch }: SettingsFormColumnProps) {
  const d = !editable;

  const update = (patch: Partial<DRRSettingsSnapshot>) => {
    if (editable) onPatch(patch);
  };

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <div className="bg-bg-surface border border-border-subtle rounded-xl px-4 pt-6 pb-10 sm:px-4">
        <h3 className="text-xl font-semibold text-ink leading-7 mb-4 [font-family:var(--font-family-display)]">
          General
        </h3>

        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-sm font-medium text-ink">Goal</label>
          <SelectInput
            value={config.goal}
            options={["Conversion rate", "Revenue"]}
            onChange={(v) => update({ goal: v })}
            disabled={d}
          />
          <p className="text-xs text-subdued">
            Define what Re-Ranking is optimising for.{" "}
            <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
              Learn more <ExternalLink size={10} />
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-sm font-medium text-ink">Event source index</label>
          <SelectInput
            value={config.eventSourceIndex}
            options={["Adam_Test_2000", "prod_index_main", "staging_index"]}
            onChange={(v) => update({ eventSourceIndex: v })}
            disabled={d}
          />
          <p className="text-xs text-subdued">
            You can use another index as the source for the events.{" "}
            <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
              Learn more <ExternalLink size={10} />
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3 min-h-[28px]">
            <label className="text-sm font-medium text-ink pr-2">Hourly refresh</label>
            <Toggle checked={config.hourlyRefresh} onChange={(v) => update({ hourlyRefresh: v })} disabled={d} />
          </div>
          <p className="text-xs text-subdued">
            Turn on to refresh your re-ranked queries and browsing facets hourly.{" "}
            <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
              Learn more <ExternalLink size={10} />
            </a>
          </p>
        </div>
      </div>

      <div className="bg-bg-surface border border-border-subtle rounded-xl px-4 pt-6 pb-10 sm:px-4">
        <h3 className="text-xl font-semibold text-ink leading-7 mb-4 [font-family:var(--font-family-display)]">
          Coverage
        </h3>

        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-sm font-medium text-ink">Multi-signal ranking</label>
          <div className="flex flex-col gap-3">
            {(
              [
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
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className={`flex items-start gap-3 ${d ? "cursor-default" : "cursor-pointer"}`}
              >
                <input
                  type="radio"
                  name={`${paneId}-prodMultiSignal`}
                  checked={config.multiSignalRanking === opt.value}
                  onChange={() => update({ multiSignalRanking: opt.value })}
                  disabled={d}
                  className="mt-1 accent-primary disabled:opacity-50"
                />
                <div>
                  <span className="text-sm font-medium text-ink">{opt.label}</span>
                  <p className="text-xs text-subdued leading-relaxed">
                    {opt.desc}{" "}
                    <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
                      Learn more <ExternalLink size={10} />
                    </a>
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-sm font-medium text-ink">Browsing facets</label>
          <button
            type="button"
            disabled={d}
            className="w-full py-2.5 text-sm text-ink border border-dashed border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Add new browsing facet
          </button>
          <p className="text-xs text-subdued leading-relaxed">
            If Algolia powers your navigation, pick a browsing facet to dynamically re-rank empty queries.{" "}
            <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
              Learn more <ExternalLink size={10} />
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-1.5 mb-5">
          <div className="flex items-center justify-between gap-3 min-h-[28px]">
            <label className="text-sm font-medium text-ink pr-2">Re-ranked empty queries</label>
            <Toggle
              checked={config.rerankedEmptyQueries}
              onChange={(v) => update({ rerankedEmptyQueries: v })}
              disabled={d}
            />
          </div>
          <p className="text-xs text-subdued">
            Turn on to re-rank all the empty queries.{" "}
            <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
              Learn more <ExternalLink size={10} />
            </a>
          </p>
        </div>

        {config.rerankedEmptyQueries && (
          <div className="flex items-start gap-2 p-3 bg-blue-100 rounded mb-5">
            <Info size={14} className="text-cyan-800 mt-0.5 shrink-0" />
            <p className="text-xs text-ink leading-relaxed">
              Re-ranked empty queries is temporarily unavailable if you have at least one browsing facet set. Your empty
              query will not be re-ranked.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-ink">Number of re-ranked hits</label>
          <input
            type="number"
            value={config.browsingFacetsCount}
            disabled={d}
            onChange={(e) => update({ browsingFacetsCount: Number(e.target.value) })}
            className="w-full max-w-[336px] h-10 px-4 text-sm text-ink bg-bg-surface border border-border-strong rounded disabled:opacity-60"
          />
          <p className="text-xs text-subdued leading-relaxed">
            Maximum number of hits affected by re-ranking (up to 100).{" "}
            <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
              Learn more <ExternalLink size={10} />
            </a>
          </p>
        </div>
      </div>

      <div className="bg-bg-surface border border-border-subtle rounded-xl px-4 pt-6 pb-10 sm:px-4">
        <h3 className="text-xl font-semibold text-ink leading-7 mb-4 [font-family:var(--font-family-display)]">
          Ordering
        </h3>

        <div className="flex flex-col gap-1.5 mb-5">
          <div className="flex items-center justify-between gap-3 min-h-[28px]">
            <label className="text-sm font-medium text-ink pr-2">Event freshness</label>
            <Toggle checked={config.eventFreshness} onChange={(v) => update({ eventFreshness: v })} disabled={d} />
          </div>
          <p className="text-xs text-subdued">
            Turn on to take seasonality into account.{" "}
            <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
              Learn more <ExternalLink size={10} />
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-1.5 mb-5">
          <div className="flex items-center justify-between gap-3 min-h-[28px]">
            <label className="text-sm font-medium text-ink pr-2">Group similar queries</label>
            <Toggle
              checked={config.groupSimilarQueries}
              onChange={(v) => update({ groupSimilarQueries: v })}
              disabled={d}
            />
          </div>
          {config.groupSimilarQueries && (
            <SelectInput
              value={config.groupSimilarQueriesLang}
              options={["English", "French", "German", "Spanish"]}
              onChange={(v) => update({ groupSimilarQueriesLang: v })}
              disabled={d}
            />
          )}
          <p className="text-xs text-subdued leading-relaxed">
            Apply the same ordering to similar queries when clustering is enabled.{" "}
            <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
              Learn more <ExternalLink size={10} />
            </a>
          </p>
        </div>

        {config.rerankedEmptyQueries && (
          <div className="flex items-start gap-2 p-3 bg-blue-100 rounded mb-5">
            <Info size={14} className="text-cyan-800 mt-0.5 shrink-0" />
            <p className="text-xs text-ink leading-relaxed">
              Re-ranked empty queries is temporarily unavailable if you have at least one browsing facet set. Your empty
              query will not be re-ranked.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Re-ranking filter</label>
          <p className="text-xs text-subdued mb-1">Only re-rank items that match this condition.</p>
          <div className="flex flex-col gap-2 min-w-0 w-full">
            <input
              type="text"
              placeholder="e.g. InStock"
              value={config.reRankingFilter.attribute}
              disabled={d}
              onChange={(e) =>
                update({
                  reRankingFilter: { ...config.reRankingFilter, attribute: e.target.value },
                })
              }
              className="w-full min-w-0 px-3 py-2.5 text-sm text-ink bg-bg-surface border border-border-subtle rounded-lg placeholder:text-subdued/60 disabled:opacity-60"
            />
            <div className="w-full min-w-0">
              <SelectInput
                value={config.reRankingFilter.operator}
                options={["is", "is not", "contains"]}
                onChange={(v) =>
                  update({
                    reRankingFilter: { ...config.reRankingFilter, operator: v },
                  })
                }
                disabled={d}
              />
            </div>
            <input
              type="text"
              placeholder="e.g. True"
              value={config.reRankingFilter.value}
              disabled={d}
              onChange={(e) =>
                update({
                  reRankingFilter: { ...config.reRankingFilter, value: e.target.value },
                })
              }
              className="w-full min-w-0 px-3 py-2.5 text-sm text-ink bg-bg-surface border border-border-subtle rounded-lg placeholder:text-subdued/60 disabled:opacity-60"
            />
          </div>
          <p className="text-xs text-subdued">
            Only items matching the configured filter will be promoted.{" "}
            <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
              Learn more <ExternalLink size={10} />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
