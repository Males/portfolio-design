import { useState } from "react";
import { ExternalLink, Info } from "lucide-react";
import type { VariantConfig } from "../context/DRRContext";
import Toggle from "./Toggle";

interface VariantFormProps {
  config: VariantConfig;
  onChange: (config: VariantConfig) => void;
  showGuidance?: boolean;
}

function FormSection({ title, children, disabled }: { title: string; children: React.ReactNode; disabled?: boolean }) {
  return (
    <div className={`bg-bg-surface border border-border-subtle rounded-xl p-6 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <h3 className="text-lg font-semibold text-ink mb-5">{title}</h3>
      {children}
    </div>
  );
}

function FormField({
  label,
  helpText,
  children,
  disabled,
  inlineControl,
}: {
  label: string;
  helpText?: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  /** Label and control on one row (e.g. toggles). */
  inlineControl?: boolean;
}) {
  return (
    <div className={`mb-5 last:mb-0 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      {inlineControl ? (
        <>
          <div className="flex items-center justify-between gap-4 min-h-[28px]">
            <label className="text-sm font-medium text-ink pr-2">{label}</label>
            <div className="shrink-0">{children}</div>
          </div>
          {helpText && <p className="text-xs text-subdued leading-relaxed mt-1.5">{helpText}</p>}
        </>
      ) : (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">{label}</label>
          {children}
          {helpText && <p className="text-xs text-subdued leading-relaxed">{helpText}</p>}
        </div>
      )}
    </div>
  );
}

function SelectInput({ value, options, onChange, disabled }: { value: string; options: string[]; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2.5 text-sm bg-bg-surface border border-border-subtle rounded-lg appearance-none pr-8 ${
          disabled ? "text-subdued cursor-not-allowed" : "text-ink cursor-pointer"
        }`}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-subdued" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
        <path d="M3 4.5l3 3 3-3" />
      </svg>
    </div>
  );
}

export default function VariantForm({ config, onChange, showGuidance }: VariantFormProps) {
  const [formState, setFormState] = useState(config);

  const update = (patch: Partial<VariantConfig>) => {
    const next = { ...formState, ...patch };
    setFormState(next);
    onChange(next);
  };

  const drrOff = !formState.drrEnabled;

  return (
    <div className="flex flex-col gap-6 max-w-[540px]">
      {showGuidance && (
        <div className="bg-blue-100/50 border border-primary/20 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Info size={16} className="text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-ink mb-2">Start simple for your first test</p>
              <p className="text-sm text-ink leading-relaxed">
                We recommend testing Dynamic re ranking on vs off first, and leaving the other settings as default.
                This gives you a clean baseline you can build on.
              </p>
              <p className="text-sm text-ink leading-relaxed mt-2">
                Choose a goal, Conversion rate or Revenue, then start the test. After that, you can follow up tests
                to tune settings for incremental improvements, one change at a time.
              </p>
            </div>
          </div>
        </div>
      )}

      <FormSection title="General">
        <FormField label="Variation name">
          <input
            type="text"
            value={formState.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="e.g. DRR on, Conversion goal"
            className="w-full px-3 py-2.5 text-sm text-ink bg-bg-surface border border-border-subtle rounded-lg placeholder:text-subdued/60"
          />
        </FormField>

        <FormField
          label="Dynamic re-ranking"
          inlineControl
          helpText="Use your events to re-order results to optimise the selected goal. Turning off uses standard ranking only, DRR settings below are inactive for this variation. Turn it off to create a clean baseline, validate impact, or troubleshoot when events are not reliable yet."
        >
          <Toggle checked={formState.drrEnabled} onChange={(v) => update({ drrEnabled: v })} />
        </FormField>

        <FormField
          label="Goal"
          disabled={drrOff}
          helpText={
            <span>
              Define what Re-Ranking is optimising for.{" "}
              <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
                Learn more <ExternalLink size={10} />
              </a>
            </span>
          }
        >
          <SelectInput
            value={formState.goal}
            options={["Conversion rate", "Revenue"]}
            onChange={(v) => update({ goal: v })}
            disabled={drrOff}
          />
        </FormField>

        <FormField
          label="Event source index"
          disabled={drrOff}
          helpText={
            <span>
              You can use another index as the source for the events. For example, if you created a replica that is not receiving any events, yet you want to re-rank it based on events from its primary index.{" "}
              <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
                Learn more <ExternalLink size={10} />
              </a>
            </span>
          }
        >
          <SelectInput
            value={formState.eventSourceIndex}
            options={["Adam_Test_2000", "prod_index_main", "staging_index"]}
            onChange={(v) => update({ eventSourceIndex: v })}
            disabled={drrOff}
          />
        </FormField>

        <FormField
          label="Hourly refresh"
          inlineControl
          disabled={drrOff}
          helpText={
            <span>
              Turn on to refresh your re-ranked queries and browsing facets hourly. When disabled, re-ranked queries and browsing facets are refreshed daily.{" "}
              <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
                Learn more <ExternalLink size={10} />
              </a>
            </span>
          }
        >
          <Toggle checked={formState.hourlyRefresh} onChange={(v) => update({ hourlyRefresh: v })} disabled={drrOff} />
        </FormField>
      </FormSection>

      <FormSection title="Coverage" disabled={drrOff}>
        <FormField label="Multi-signal ranking">
          <div className="flex flex-col gap-3">
            {[
              { value: "head-only" as const, label: "Head queries only", desc: "Use conversion and click events." },
              {
                value: "augmented" as const,
                label: "Head and long tail queries (Augmented)",
                desc: "Use conversion and click events on head queries, and smart predictions on long tail queries for broader coverage.",
              },
              {
                value: "combined" as const,
                label: "Head and long tail queries (Combined)",
                desc: "Use conversion and click events WITH smart predictions on head queries, and smart predictions on long tail queries for maximum reach. Increase the reach of Re-Ranking by using different signals.",
              },
            ].map((opt) => (
              <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="multiSignal"
                  checked={formState.multiSignalRanking === opt.value}
                  onChange={() => update({ multiSignalRanking: opt.value })}
                  className="mt-1 accent-primary"
                  disabled={drrOff}
                />
                <div>
                  <span className="text-sm font-medium text-ink">{opt.label}</span>
                  <p className="text-xs text-subdued leading-relaxed">
                    {opt.desc}{" "}
                    {opt.value !== "head-only" && (
                      <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
                        Learn more <ExternalLink size={10} />
                      </a>
                    )}
                  </p>
                </div>
                {opt.value !== "head-only" && (
                  <a href="#" className="ml-auto shrink-0 text-subdued hover:text-primary">
                    <ExternalLink size={12} />
                  </a>
                )}
              </label>
            ))}
          </div>
        </FormField>

        <FormField label="Browsing facets">
          <button className="w-full py-2.5 text-sm text-ink border border-dashed border-border-subtle rounded-lg hover:bg-bg-sidebar" disabled={drrOff}>
            + Add new browsing facet
          </button>
          <p className="text-xs text-subdued leading-relaxed mt-1">
            If Algolia powers your navigation (Adding Navigation and Filters to Category Pages), pick a browsing facet to
            dynamically re-rank empty queries that are filtered on the selected facet. At most, 5 browsing facets can be set.{" "}
            <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
              Learn more <ExternalLink size={10} />
            </a>
          </p>
        </FormField>

        <FormField
          label="Re-ranked empty queries"
          inlineControl
          helpText={
            <span>
              Turn on to re-rank all the empty queries. If the facets applied to an empty query match the ones set as Browsing facet
              in your configuration, the specific ordering computed for this browsing facet will be applied instead.{" "}
              <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
                Learn more <ExternalLink size={10} />
              </a>
            </span>
          }
        >
          <Toggle checked={formState.rerankedEmptyQueries} onChange={(v) => update({ rerankedEmptyQueries: v })} disabled={drrOff} />
        </FormField>

        {formState.rerankedEmptyQueries && !drrOff && (
          <div className="flex items-start gap-2 p-3 bg-bg-sidebar rounded-lg mb-5">
            <Info size={14} className="text-subdued mt-0.5 shrink-0" />
            <p className="text-xs text-subdued leading-relaxed">
              Re-ranked empty queries is temporarily unavailable if you have at least one browsing facet set.
              Your empty query will not be re-ranked.
            </p>
          </div>
        )}

        <FormField
          label="Browsing facets"
          helpText={
            <span>
              Maximum number of hits pushed by re-ranking to the top at most. At most, 100 hits can be re-ranked.{" "}
              <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
                Learn more <ExternalLink size={10} />
              </a>
            </span>
          }
        >
          <input
            type="number"
            value={formState.browsingFacetsCount}
            onChange={(e) => update({ browsingFacetsCount: Number(e.target.value) })}
            className="w-[120px] px-3 py-2.5 text-sm text-ink bg-bg-surface border border-border-subtle rounded-lg"
            disabled={drrOff}
          />
        </FormField>
      </FormSection>

      <FormSection title="Ordering" disabled={drrOff}>
        <FormField
          label="Event freshness"
          inlineControl
          helpText={
            <span>
              Turn on to take seasonality into account. When enabled, recent events will have more weight than older ones for the
              re-ranking computation. When disabled, all events are considered equal regardless of when they occurred.{" "}
              <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
                Learn more <ExternalLink size={10} />
              </a>
            </span>
          }
        >
          <Toggle checked={formState.eventFreshness} onChange={(v) => update({ eventFreshness: v })} disabled={drrOff} />
        </FormField>

        <FormField
          label="Group similar queries"
          inlineControl
          helpText={
            <span>
              Turn on to take seasonality into account. When enabled, recent events will have more weight than older ones for the
              re-ranking computation. When disabled, all events are considered equal regardless of when they occurred.{" "}
              <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
                Learn more <ExternalLink size={10} />
              </a>
            </span>
          }
        >
          <div className="flex flex-col items-end gap-2 min-w-[12rem]">
            <Toggle checked={formState.groupSimilarQueries} onChange={(v) => update({ groupSimilarQueries: v })} disabled={drrOff} />
            {formState.groupSimilarQueries && !drrOff && (
              <div className="w-full">
                <SelectInput
                  value={formState.groupSimilarQueriesLang}
                  options={["English", "French", "German", "Spanish"]}
                  onChange={(v) => update({ groupSimilarQueriesLang: v })}
                />
              </div>
            )}
          </div>
        </FormField>

        <FormField
          label="Re-ranking filter"
          helpText={
            <span>
              Only items matching the configured filter will be promoted.{" "}
              <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
                Learn more <ExternalLink size={10} />
              </a>
            </span>
          }
        >
          <div className="flex flex-col gap-2 w-full min-w-0">
            <input
              type="text"
              placeholder="e.g. InStock"
              value={formState.reRankingFilter.attribute}
              onChange={(e) =>
                update({ reRankingFilter: { ...formState.reRankingFilter, attribute: e.target.value } })
              }
              className="w-full min-w-0 px-3 py-2.5 text-sm text-ink bg-bg-surface border border-border-subtle rounded-lg placeholder:text-subdued/60"
              disabled={drrOff}
            />
            <div className="w-full min-w-0">
              <SelectInput
                value={formState.reRankingFilter.operator}
                options={["is", "is not", "contains"]}
                onChange={(v) =>
                  update({ reRankingFilter: { ...formState.reRankingFilter, operator: v } })
                }
                disabled={drrOff}
              />
            </div>
            <input
              type="text"
              placeholder="e.g. True"
              value={formState.reRankingFilter.value}
              onChange={(e) =>
                update({ reRankingFilter: { ...formState.reRankingFilter, value: e.target.value } })
              }
              className="w-full min-w-0 px-3 py-2.5 text-sm text-ink bg-bg-surface border border-border-subtle rounded-lg placeholder:text-subdued/60"
              disabled={drrOff}
            />
          </div>
        </FormField>
      </FormSection>
    </div>
  );
}
