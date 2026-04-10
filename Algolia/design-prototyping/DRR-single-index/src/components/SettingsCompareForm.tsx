import { ExternalLink, Info } from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { diffSettings } from "../lib/configDiff";
import type { CompareColumnMode } from "../lib/configureColumnResolve";
import type { DRRSettingsSnapshot } from "../types/drrSettings";
import { CreateNewVariantCard } from "./GeneralColumnAside";
import { SelectInput } from "./SettingsFormColumn";
import Toggle from "./Toggle";

function CompareCell({ inactive, children }: { inactive: boolean; children: ReactNode }) {
  if (inactive) {
    return <span className="inline-flex min-h-10 items-center text-sm text-subdued">—</span>;
  }
  return <>{children}</>;
}

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
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(200px,26%)_minmax(0,1fr)_minmax(0,1fr)] gap-4 gap-y-3 items-start">
      <div className="min-w-0 max-w-[320px]">
        <div className="text-sm font-semibold text-ink leading-5">{label}</div>
        {hint != null && <div className="mt-0.5 text-xs text-subdued leading-4">{hint}</div>}
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
  leftColumnMode: CompareColumnMode;
  rightColumnMode: CompareColumnMode;
  onPatchLeft: (patch: Partial<DRRSettingsSnapshot>) => void;
  onPatchRight: (patch: Partial<DRRSettingsSnapshot>) => void;
  /** When set, replaces that column’s Goal/Event/Hourly cells in General (Figma: card beside fields). */
  leftGeneralAside?: ReactNode;
  rightGeneralAside?: ReactNode;
  /** Both columns empty variant: two create cards on top, then shared Goal/Event/Hourly rows. */
  generalTwinCreate?: {
    onCreateLeft: () => void;
    onCreateRight: () => void;
    createDisabled?: boolean;
  };
}

export default function SettingsCompareForm({
  leftPaneId,
  rightPaneId,
  leftLabel,
  rightLabel,
  leftConfig,
  rightConfig,
  leftColumnMode,
  rightColumnMode,
  onPatchLeft,
  onPatchRight,
  leftGeneralAside,
  rightGeneralAside,
  generalTwinCreate,
}: SettingsCompareFormProps) {
  const diffKeySet = useMemo(() => {
    const rows = diffSettings(leftConfig, rightConfig);
    return new Set(
      rows.map((r) => r.key).filter((key) => key !== "multiSignalRanking"),
    );
  }, [leftConfig, rightConfig]);

  const leftNA = leftColumnMode === "inactive";
  const rightNA = rightColumnMode === "inactive";
  const dl = leftColumnMode !== "interactive";
  const dr = rightColumnMode !== "interactive";

  const patchL = (patch: Partial<DRRSettingsSnapshot>) => {
    if (leftColumnMode === "interactive") onPatchLeft(patch);
  };
  const patchR = (patch: Partial<DRRSettingsSnapshot>) => {
    if (rightColumnMode === "interactive") onPatchRight(patch);
  };

  const learn = (
    <a href="#" className="text-primary hover:underline inline-flex items-center gap-0.5">
      Learn more <ExternalLink size={10} />
    </a>
  );

  const hasLeftAside = leftGeneralAside != null;
  const hasRightAside = rightGeneralAside != null;

  /** Coverage multi-signal: fixed column titles (configure pane names stay on other rows). */
  const coverageColumnHeaderLeft = "Left column";
  const coverageColumnHeaderRight = "Right column";

  /** Desktop + mobile blocks are both mounted (CSS-hidden); radios must not share `name` or the browser merges them into one broken group. */
  const multiSignalNameLeftLg = `${leftPaneId}-prodMultiSignal-lg`;
  const multiSignalNameRightLg = `${rightPaneId}-prodMultiSignal-lg`;
  const multiSignalNameLeftSm = `${leftPaneId}-prodMultiSignal-sm`;
  const multiSignalNameRightSm = `${rightPaneId}-prodMultiSignal-sm`;

  const diffWrap = (key: "goal" | "eventSourceIndex" | "hourlyRefresh", node: ReactNode) => (
    <div
      className={`min-w-0 rounded-lg p-1 -m-1 transition-colors ${
        diffKeySet.has(key) ? "bg-amber-500/8 ring-1 ring-amber-500/25" : ""
      }`}
    >
      {node}
    </div>
  );

  const goalHint = (
    <>
      Define what Re-Ranking is optimising for. {learn}
    </>
  );
  const eventHint = (
    <>
      You can use another index as the source for the events. {learn}
    </>
  );
  const hourlyHint = (
    <>
      Turn on to refresh your re-ranked queries and browsing facets hourly. {learn}
    </>
  );

  const generalGoalRow = (
    <CompareRow
      label="Goal"
      hint={goalHint}
      highlightLeft={diffKeySet.has("goal")}
      highlightRight={diffKeySet.has("goal")}
      left={
        <CompareCell inactive={leftNA}>
          <SelectInput
            value={leftConfig.goal}
            options={["Conversion rate", "Revenue"]}
            onChange={(v) => patchL({ goal: v })}
            disabled={dl}
          />
        </CompareCell>
      }
      right={
        <CompareCell inactive={rightNA}>
          <SelectInput
            value={rightConfig.goal}
            options={["Conversion rate", "Revenue"]}
            onChange={(v) => patchR({ goal: v })}
            disabled={dr}
          />
        </CompareCell>
      }
    />
  );

  const generalEventRow = (
    <CompareRow
      label="Event source index"
      hint={eventHint}
      highlightLeft={diffKeySet.has("eventSourceIndex")}
      highlightRight={diffKeySet.has("eventSourceIndex")}
      left={
        <CompareCell inactive={leftNA}>
          <SelectInput
            value={leftConfig.eventSourceIndex}
            options={["Adam_Test_2000", "prod_index_main", "staging_index"]}
            onChange={(v) => patchL({ eventSourceIndex: v })}
            disabled={dl}
          />
        </CompareCell>
      }
      right={
        <CompareCell inactive={rightNA}>
          <SelectInput
            value={rightConfig.eventSourceIndex}
            options={["Adam_Test_2000", "prod_index_main", "staging_index"]}
            onChange={(v) => patchR({ eventSourceIndex: v })}
            disabled={dr}
          />
        </CompareCell>
      }
    />
  );

  const generalHourlyRow = (
    <CompareRow
      label="Hourly refresh"
      hint={hourlyHint}
      highlightLeft={diffKeySet.has("hourlyRefresh")}
      highlightRight={diffKeySet.has("hourlyRefresh")}
      left={
        <CompareCell inactive={leftNA}>
          <div className="flex justify-end lg:justify-start pt-0.5">
            <Toggle
              checked={leftConfig.hourlyRefresh}
              onChange={(v) => patchL({ hourlyRefresh: v })}
              disabled={dl}
            />
          </div>
        </CompareCell>
      }
      right={
        <CompareCell inactive={rightNA}>
          <div className="flex justify-end lg:justify-start pt-0.5">
            <Toggle
              checked={rightConfig.hourlyRefresh}
              onChange={(v) => patchR({ hourlyRefresh: v })}
              disabled={dr}
            />
          </div>
        </CompareCell>
      }
    />
  );

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <div className="bg-bg-surface border border-border-subtle rounded-xl px-4 pt-6 pb-10 sm:px-4">
        <h3 className="text-xl font-semibold text-ink leading-7 mb-4 [font-family:var(--font-family-display)]">
          General
        </h3>
        <div className="flex flex-col gap-4">
          {generalTwinCreate && (
            <>
              <div className="hidden lg:grid lg:grid-cols-2 gap-4">
                <CreateNewVariantCard
                  onCreate={generalTwinCreate.onCreateLeft}
                  disabled={generalTwinCreate.createDisabled}
                />
                <CreateNewVariantCard
                  onCreate={generalTwinCreate.onCreateRight}
                  disabled={generalTwinCreate.createDisabled}
                />
              </div>
              <div className="lg:hidden flex flex-col gap-4">
                <CreateNewVariantCard
                  onCreate={generalTwinCreate.onCreateLeft}
                  disabled={generalTwinCreate.createDisabled}
                />
                <CreateNewVariantCard
                  onCreate={generalTwinCreate.onCreateRight}
                  disabled={generalTwinCreate.createDisabled}
                />
              </div>
            </>
          )}

          {generalTwinCreate || (!hasLeftAside && !hasRightAside) ? (
            <>
              {generalGoalRow}
              {generalEventRow}
              {generalHourlyRow}
            </>
          ) : (
            <>
              <div className="hidden lg:grid lg:grid-cols-[minmax(200px,26%)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-4 lg:gap-y-6 lg:items-start lg:pb-4">
                <div className="min-w-0 max-w-[320px] lg:row-start-1 lg:col-start-1">
                  <div className="text-sm font-semibold text-ink leading-5">Goal</div>
                  <div className="mt-0.5 text-xs text-subdued leading-4">{goalHint}</div>
                </div>
                {hasLeftAside ? (
                  <div className="min-w-0 lg:row-start-1 lg:row-span-3 lg:col-start-2 self-stretch">
                    {leftGeneralAside}
                  </div>
                ) : (
                  <div className="min-w-0 lg:row-start-1 lg:col-start-2">
                    {diffWrap(
                      "goal",
                      <CompareCell inactive={leftNA}>
                        <SelectInput
                          value={leftConfig.goal}
                          options={["Conversion rate", "Revenue"]}
                          onChange={(v) => patchL({ goal: v })}
                          disabled={dl}
                        />
                      </CompareCell>,
                    )}
                  </div>
                )}
                {hasRightAside ? (
                  <div className="min-w-0 lg:row-start-1 lg:row-span-3 lg:col-start-3 self-stretch">
                    {rightGeneralAside}
                  </div>
                ) : (
                  <div className="min-w-0 lg:row-start-1 lg:col-start-3">
                    {diffWrap(
                      "goal",
                      <CompareCell inactive={rightNA}>
                        <SelectInput
                          value={rightConfig.goal}
                          options={["Conversion rate", "Revenue"]}
                          onChange={(v) => patchR({ goal: v })}
                          disabled={dr}
                        />
                      </CompareCell>,
                    )}
                  </div>
                )}

                <div className="min-w-0 max-w-[320px] lg:row-start-2 lg:col-start-1">
                  <div className="text-sm font-semibold text-ink leading-5">Event source index</div>
                  <div className="mt-0.5 text-xs text-subdued leading-4">{eventHint}</div>
                </div>
                {!hasLeftAside && (
                  <div className="min-w-0 lg:row-start-2 lg:col-start-2">
                    {diffWrap(
                      "eventSourceIndex",
                      <CompareCell inactive={leftNA}>
                        <SelectInput
                          value={leftConfig.eventSourceIndex}
                          options={["Adam_Test_2000", "prod_index_main", "staging_index"]}
                          onChange={(v) => patchL({ eventSourceIndex: v })}
                          disabled={dl}
                        />
                      </CompareCell>,
                    )}
                  </div>
                )}
                {!hasRightAside && (
                  <div className="min-w-0 lg:row-start-2 lg:col-start-3">
                    {diffWrap(
                      "eventSourceIndex",
                      <CompareCell inactive={rightNA}>
                        <SelectInput
                          value={rightConfig.eventSourceIndex}
                          options={["Adam_Test_2000", "prod_index_main", "staging_index"]}
                          onChange={(v) => patchR({ eventSourceIndex: v })}
                          disabled={dr}
                        />
                      </CompareCell>,
                    )}
                  </div>
                )}

                <div className="min-w-0 max-w-[320px] lg:row-start-3 lg:col-start-1">
                  <div className="text-sm font-semibold text-ink leading-5">Hourly refresh</div>
                  <div className="mt-0.5 text-xs text-subdued leading-4">{hourlyHint}</div>
                </div>
                {!hasLeftAside && (
                  <div className="min-w-0 lg:row-start-3 lg:col-start-2">
                    {diffWrap(
                      "hourlyRefresh",
                      <CompareCell inactive={leftNA}>
                        <div className="flex justify-end lg:justify-start pt-0.5">
                          <Toggle
                            checked={leftConfig.hourlyRefresh}
                            onChange={(v) => patchL({ hourlyRefresh: v })}
                            disabled={dl}
                          />
                        </div>
                      </CompareCell>,
                    )}
                  </div>
                )}
                {!hasRightAside && (
                  <div className="min-w-0 lg:row-start-3 lg:col-start-3">
                    {diffWrap(
                      "hourlyRefresh",
                      <CompareCell inactive={rightNA}>
                        <div className="flex justify-end lg:justify-start pt-0.5">
                          <Toggle
                            checked={rightConfig.hourlyRefresh}
                            onChange={(v) => patchR({ hourlyRefresh: v })}
                            disabled={dr}
                          />
                        </div>
                      </CompareCell>,
                    )}
                  </div>
                )}
              </div>

              <div className="lg:hidden flex flex-col gap-6">
                <div>
                  <div className="text-sm font-semibold text-ink leading-5">Goal</div>
                  <div className="mt-0.5 text-xs text-subdued leading-4">{goalHint}</div>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold uppercase leading-4 text-subdued mb-2">{leftLabel}</div>
                      {hasLeftAside
                        ? leftGeneralAside
                        : diffWrap(
                            "goal",
                            <CompareCell inactive={leftNA}>
                              <SelectInput
                                value={leftConfig.goal}
                                options={["Conversion rate", "Revenue"]}
                                onChange={(v) => patchL({ goal: v })}
                                disabled={dl}
                              />
                            </CompareCell>,
                          )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold uppercase leading-4 text-subdued mb-2">{rightLabel}</div>
                      {hasRightAside
                        ? rightGeneralAside
                        : diffWrap(
                            "goal",
                            <CompareCell inactive={rightNA}>
                              <SelectInput
                                value={rightConfig.goal}
                                options={["Conversion rate", "Revenue"]}
                                onChange={(v) => patchR({ goal: v })}
                                disabled={dr}
                              />
                            </CompareCell>,
                          )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink leading-5">Event source index</div>
                  <div className="mt-0.5 text-xs text-subdued leading-4">{eventHint}</div>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold uppercase leading-4 text-subdued mb-2">{leftLabel}</div>
                      {!hasLeftAside &&
                        diffWrap(
                          "eventSourceIndex",
                          <CompareCell inactive={leftNA}>
                            <SelectInput
                              value={leftConfig.eventSourceIndex}
                              options={["Adam_Test_2000", "prod_index_main", "staging_index"]}
                              onChange={(v) => patchL({ eventSourceIndex: v })}
                              disabled={dl}
                            />
                          </CompareCell>,
                        )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold uppercase leading-4 text-subdued mb-2">{rightLabel}</div>
                      {!hasRightAside &&
                        diffWrap(
                          "eventSourceIndex",
                          <CompareCell inactive={rightNA}>
                            <SelectInput
                              value={rightConfig.eventSourceIndex}
                              options={["Adam_Test_2000", "prod_index_main", "staging_index"]}
                              onChange={(v) => patchR({ eventSourceIndex: v })}
                              disabled={dr}
                            />
                          </CompareCell>,
                        )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink leading-5">Hourly refresh</div>
                  <div className="mt-0.5 text-xs text-subdued leading-4">{hourlyHint}</div>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold uppercase leading-4 text-subdued mb-2">{leftLabel}</div>
                      {!hasLeftAside &&
                        diffWrap(
                          "hourlyRefresh",
                          <CompareCell inactive={leftNA}>
                            <div className="flex justify-end sm:justify-start pt-0.5">
                              <Toggle
                                checked={leftConfig.hourlyRefresh}
                                onChange={(v) => patchL({ hourlyRefresh: v })}
                                disabled={dl}
                              />
                            </div>
                          </CompareCell>,
                        )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold uppercase leading-4 text-subdued mb-2">{rightLabel}</div>
                      {!hasRightAside &&
                        diffWrap(
                          "hourlyRefresh",
                          <CompareCell inactive={rightNA}>
                            <div className="flex justify-end sm:justify-start pt-0.5">
                              <Toggle
                                checked={rightConfig.hourlyRefresh}
                                onChange={(v) => patchR({ hourlyRefresh: v })}
                                disabled={dr}
                              />
                            </div>
                          </CompareCell>,
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-bg-surface border border-border-subtle rounded-xl px-4 pt-6 pb-10 sm:px-4">
        <h3 className="text-xl font-semibold text-ink leading-7 mb-4 [font-family:var(--font-family-display)]">
          Coverage
        </h3>
        <div className="flex flex-col gap-4">
          <div className="pb-4">
            <div className="mb-4 lg:grid lg:grid-cols-[minmax(200px,26%)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-4 lg:items-start">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-ink">Multi-signal ranking</div>
                <p className="mt-1.5 text-xs text-subdued leading-relaxed">
                  Pick exactly one mode for <span className="font-medium text-ink">{coverageColumnHeaderLeft}</span> and
                  one for <span className="font-medium text-ink">{coverageColumnHeaderRight}</span>. The rows are the
                  choices — use the radio under each column header.
                </p>
              </div>
            </div>

            {/* Desktop: same 3-col template as CompareRow; radios left-aligned under headers */}
            <div className="hidden lg:flex lg:flex-col gap-4 rounded-lg p-2 -m-2">
              <div className="grid grid-cols-[minmax(200px,26%)_minmax(0,1fr)_minmax(0,1fr)] gap-x-4 items-end">
                <div aria-hidden className="min-h-[1.25rem]" />
                <div className="text-xs font-semibold uppercase leading-4 text-subdued text-left min-w-0">
                  {coverageColumnHeaderLeft}
                </div>
                <div className="text-xs font-semibold uppercase leading-4 text-subdued text-left min-w-0">
                  {coverageColumnHeaderRight}
                </div>
              </div>
              {MULTI_SIGNAL_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  className="grid grid-cols-[minmax(200px,26%)_minmax(0,1fr)_minmax(0,1fr)] gap-x-4 items-start"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-sm font-semibold text-ink">{opt.label}</div>
                    <p className="text-xs text-subdued leading-relaxed mt-1">
                      {opt.desc} {learn}
                    </p>
                  </div>
                  <div className="flex justify-start items-start pt-1 min-w-0">
                    {leftNA ? (
                      <span className="text-subdued text-sm pt-1">—</span>
                    ) : (
                      <label className={dl ? "cursor-default" : "cursor-pointer"}>
                        <span className="sr-only">
                          {coverageColumnHeaderLeft}: {opt.label}
                        </span>
                        <input
                          type="radio"
                          name={multiSignalNameLeftLg}
                          checked={leftConfig.multiSignalRanking === opt.value}
                          onChange={() => patchL({ multiSignalRanking: opt.value })}
                          disabled={dl}
                          className="accent-nebula-600 disabled:opacity-50 size-4"
                        />
                      </label>
                    )}
                  </div>
                  <div className="flex justify-start items-start pt-1 min-w-0">
                    {rightNA ? (
                      <span className="text-subdued text-sm pt-1">—</span>
                    ) : (
                      <label className={dr ? "cursor-default" : "cursor-pointer"}>
                        <span className="sr-only">
                          {coverageColumnHeaderRight}: {opt.label}
                        </span>
                        <input
                          type="radio"
                          name={multiSignalNameRightLg}
                          checked={rightConfig.multiSignalRanking === opt.value}
                          onChange={() => patchR({ multiSignalRanking: opt.value })}
                          disabled={dr}
                          className="accent-nebula-600 disabled:opacity-50 size-4"
                        />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile: shared copy per option; radios paired below */}
            <div className="lg:hidden flex flex-col gap-5 rounded-lg p-3 -m-1">
              {MULTI_SIGNAL_OPTIONS.map((opt) => (
                <div key={opt.value} className="min-w-0">
                  <div className="text-sm font-semibold text-ink">{opt.label}</div>
                  <p className="text-xs text-subdued leading-relaxed mt-1">
                    {opt.desc} {learn}
                  </p>
                  <div className="flex flex-wrap items-center gap-6 mt-3">
                    <label
                      className={`flex items-center gap-2 ${dl || leftNA ? "cursor-default" : "cursor-pointer"}`}
                    >
                      {leftNA ? (
                        <span className="size-4 flex items-center justify-center text-subdued text-sm" aria-hidden>
                          —
                        </span>
                      ) : (
                        <input
                          type="radio"
                          name={multiSignalNameLeftSm}
                          checked={leftConfig.multiSignalRanking === opt.value}
                          onChange={() => patchL({ multiSignalRanking: opt.value })}
                          disabled={dl}
                          className="accent-nebula-600 disabled:opacity-50 size-4"
                        />
                      )}
                      <span className="text-xs font-medium text-subdued">{coverageColumnHeaderLeft}</span>
                    </label>
                    <label
                      className={`flex items-center gap-2 ${dr || rightNA ? "cursor-default" : "cursor-pointer"}`}
                    >
                      {rightNA ? (
                        <span className="size-4 flex items-center justify-center text-subdued text-sm" aria-hidden>
                          —
                        </span>
                      ) : (
                        <input
                          type="radio"
                          name={multiSignalNameRightSm}
                          checked={rightConfig.multiSignalRanking === opt.value}
                          onChange={() => patchR({ multiSignalRanking: opt.value })}
                          disabled={dr}
                          className="accent-nebula-600 disabled:opacity-50 size-4"
                        />
                      )}
                      <span className="text-xs font-medium text-subdued">{coverageColumnHeaderRight}</span>
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
              <CompareCell inactive={leftNA}>
                <button
                  type="button"
                  disabled={dl}
                  className="w-full py-2.5 text-sm text-ink border border-dashed border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Add new browsing facet
                </button>
              </CompareCell>
            }
            right={
              <CompareCell inactive={rightNA}>
                <button
                  type="button"
                  disabled={dr}
                  className="w-full py-2.5 text-sm text-ink border border-dashed border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Add new browsing facet
                </button>
              </CompareCell>
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
              <CompareCell inactive={leftNA}>
                <div className="flex justify-end lg:justify-start pt-0.5">
                  <Toggle
                    checked={leftConfig.rerankedEmptyQueries}
                    onChange={(v) => patchL({ rerankedEmptyQueries: v })}
                    disabled={dl}
                  />
                </div>
              </CompareCell>
            }
            right={
              <CompareCell inactive={rightNA}>
                <div className="flex justify-end lg:justify-start pt-0.5">
                  <Toggle
                    checked={rightConfig.rerankedEmptyQueries}
                    onChange={(v) => patchR({ rerankedEmptyQueries: v })}
                    disabled={dr}
                  />
                </div>
              </CompareCell>
            }
          />

          {(leftConfig.rerankedEmptyQueries || rightConfig.rerankedEmptyQueries) && (
            <div className="flex items-start gap-2 p-3 bg-blue-100 rounded">
              <Info size={14} className="text-cyan-800 mt-0.5 shrink-0" />
              <p className="text-xs text-ink leading-relaxed">
                Re-ranked empty queries is temporarily unavailable if you have at least one browsing facet set. Your
                empty query will not be re-ranked.
              </p>
            </div>
          )}

          <CompareRow
            label="Number of re-ranked hits"
            hint={
              <>
                Maximum number of hits affected by re-ranking (up to 100). {learn}
              </>
            }
            highlightLeft={diffKeySet.has("browsingFacetsCount")}
            highlightRight={diffKeySet.has("browsingFacetsCount")}
            left={
              <CompareCell inactive={leftNA}>
                <input
                  type="number"
                  value={leftConfig.browsingFacetsCount}
                  disabled={dl}
                  onChange={(e) => patchL({ browsingFacetsCount: Number(e.target.value) })}
                  className="w-full max-w-[336px] h-10 px-4 text-sm text-ink bg-bg-surface border border-border-strong rounded disabled:opacity-60"
                />
              </CompareCell>
            }
            right={
              <CompareCell inactive={rightNA}>
                <input
                  type="number"
                  value={rightConfig.browsingFacetsCount}
                  disabled={dr}
                  onChange={(e) => patchR({ browsingFacetsCount: Number(e.target.value) })}
                  className="w-full max-w-[336px] h-10 px-4 text-sm text-ink bg-bg-surface border border-border-strong rounded disabled:opacity-60"
                />
              </CompareCell>
            }
          />
        </div>
      </div>

      <div className="bg-bg-surface border border-border-subtle rounded-xl px-4 pt-6 pb-10 sm:px-4">
        <h3 className="text-xl font-semibold text-ink leading-7 mb-4 [font-family:var(--font-family-display)]">
          Ordering
        </h3>
        <div className="flex flex-col gap-4">
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
              <CompareCell inactive={leftNA}>
                <div className="flex justify-end lg:justify-start pt-0.5">
                  <Toggle
                    checked={leftConfig.eventFreshness}
                    onChange={(v) => patchL({ eventFreshness: v })}
                    disabled={dl}
                  />
                </div>
              </CompareCell>
            }
            right={
              <CompareCell inactive={rightNA}>
                <div className="flex justify-end lg:justify-start pt-0.5">
                  <Toggle
                    checked={rightConfig.eventFreshness}
                    onChange={(v) => patchR({ eventFreshness: v })}
                    disabled={dr}
                  />
                </div>
              </CompareCell>
            }
          />

          <CompareRow
            label="Group similar queries"
            hint={
              <>
                Apply the same ordering to similar queries when clustering is enabled. {learn}
              </>
            }
            highlightLeft={diffKeySet.has("groupSimilarQueries") || diffKeySet.has("groupSimilarQueriesLang")}
            highlightRight={diffKeySet.has("groupSimilarQueries") || diffKeySet.has("groupSimilarQueriesLang")}
            left={
              <CompareCell inactive={leftNA}>
                <div className="flex flex-col gap-3">
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
              </CompareCell>
            }
            right={
              <CompareCell inactive={rightNA}>
                <div className="flex flex-col gap-3">
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
              </CompareCell>
            }
          />

          {(leftConfig.rerankedEmptyQueries || rightConfig.rerankedEmptyQueries) && (
            <div className="flex items-start gap-2 p-3 bg-blue-100 rounded">
              <Info size={14} className="text-cyan-800 mt-0.5 shrink-0" />
              <p className="text-xs text-ink leading-relaxed">
                Re-ranked empty queries is temporarily unavailable if you have at least one browsing facet set. Your empty
                query will not be re-ranked.
              </p>
            </div>
          )}

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
              <CompareCell inactive={leftNA}>
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
                    className="w-full min-w-0 h-10 px-4 text-sm text-ink bg-bg-surface border border-border-strong rounded placeholder:text-subdued/60 disabled:opacity-60"
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
                    className="w-full min-w-0 h-10 px-4 text-sm text-ink bg-bg-surface border border-border-strong rounded placeholder:text-subdued/60 disabled:opacity-60"
                  />
                </div>
              </CompareCell>
            }
            right={
              <CompareCell inactive={rightNA}>
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
                    className="w-full min-w-0 h-10 px-4 text-sm text-ink bg-bg-surface border border-border-strong rounded placeholder:text-subdued/60 disabled:opacity-60"
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
                    className="w-full min-w-0 h-10 px-4 text-sm text-ink bg-bg-surface border border-border-strong rounded placeholder:text-subdued/60 disabled:opacity-60"
                  />
                </div>
              </CompareCell>
            }
          />
        </div>
      </div>
    </div>
  );
}
