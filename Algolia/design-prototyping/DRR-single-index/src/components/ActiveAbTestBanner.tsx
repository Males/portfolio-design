import { useState } from "react";
import { LayoutGrid, StopCircle } from "lucide-react";
import { useDRR } from "../context/DRRContext";
import ConfirmModal from "./ConfirmModal";
import {
  AB_TEST_VARIATION_LABELS,
  getIllustrativeAbTestTableData,
  isSuccessfulAbTestOutcome,
  type AbTestVariationId,
} from "../types/abTest";

const CARD_SHADOW =
  "shadow-[0px_1px_3px_0px_rgba(33,36,61,0.25),0px_0px_0px_1px_rgba(33,36,61,0.05)]";

function isValidTime(ms: number): boolean {
  return Number.isFinite(ms) && !Number.isNaN(ms);
}

function formatTimelineDate(d: Date): string {
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function tableBadge(id: AbTestVariationId): { letter: string; circleClass: string } {
  switch (id) {
    case "control":
      return { letter: "A", circleClass: "bg-[#484c7a]" };
    case "drr-off":
      return { letter: "D", circleClass: "bg-cyan-800" };
    case "variant-a":
      return { letter: "B", circleClass: "bg-[#457aff]" };
    case "variant-b":
      return { letter: "C", circleClass: "bg-purple-500" };
    default:
      return { letter: "?", circleClass: "bg-primary" };
  }
}

function splitRowStyle(index: number): { letter: string; circleClass: string } {
  const letters = ["A", "B", "C", "D"];
  const classes = [
    "bg-cyan-800",
    "bg-[#e8600a]",
    "bg-[#457aff]",
    "bg-purple-500",
  ];
  return {
    letter: letters[index] ?? "?",
    circleClass: classes[index % classes.length] ?? "bg-primary",
  };
}

export default function ActiveAbTestBanner() {
  const {
    activeAbTest,
    dismissActiveAbTest,
    completeActiveAbTest,
    applyAbTestVariationToLive,
  } = useDRR();
  const [showEndTestModal, setShowEndTestModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  if (!activeAbTest) return null;

  const { id, name, startedAtMs, variationIds, trafficSplit, durationDays, endedAtMs, appliedVariationId } =
    activeAbTest;
  const displayName = name.trim() || "Test name goes here";

  const safeStartMs = isValidTime(startedAtMs) ? startedAtMs : Date.now();
  const safeDuration = Math.max(1, Number.isFinite(durationDays) && durationDays > 0 ? durationDays : 14);

  const startDate = new Date(safeStartMs);
  const endDate = new Date(safeStartMs);
  endDate.setDate(endDate.getDate() + safeDuration);

  const calendarComplete = Date.now() >= endDate.getTime();
  const isComplete = endedAtMs != null || calendarComplete;

  const elapsedDays = isComplete
    ? safeDuration
    : Math.min(safeDuration, Math.max(0, Math.ceil((Date.now() - safeStartMs) / 86_400_000)));
  const timelinePct = isComplete ? 100 : Math.min(100, safeDuration > 0 ? (elapsedDays / safeDuration) * 100 : 0);

  const tableData = getIllustrativeAbTestTableData(variationIds);
  const { cvrRates, winnerIndex } = tableData;
  const successful = isSuccessfulAbTestOutcome(isComplete, winnerIndex, cvrRates);
  const winnerId = variationIds[winnerIndex];
  const winnerLabel = winnerId ? AB_TEST_VARIATION_LABELS[winnerId] : "";

  const handleConfirmApply = () => {
    if (winnerId) applyAbTestVariationToLive(winnerId);
    setShowApplyModal(false);
  };

  return (
    <section
      className={`overflow-hidden rounded bg-bg-surface ${CARD_SHADOW}`}
      aria-label="Active A/B test"
    >
      <div className="flex flex-col gap-4 bg-bg-sidebar px-4 pt-4 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-wrap items-center gap-3.5">
            <h2 className="min-w-0 max-w-full text-[20px] font-semibold leading-[28px] text-ink [font-family:var(--font-family-display)]">
              <span className="block truncate">{displayName}</span>
            </h2>
            <p className="text-sm text-subdued leading-5 tabular-nums">{id}</p>
            <span
              className={
                isComplete
                  ? "inline-flex items-center rounded-full border border-success-border bg-success-bg px-2 py-0.5 text-sm text-success-ink leading-5"
                  : "inline-flex items-center rounded-full border border-border-subtle bg-bg-surface px-2 py-0.5 text-sm text-ink leading-5"
              }
            >
              {isComplete ? "Completed" : "In progress"}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded border border-border-subtle bg-bg-surface text-ink hover:bg-bg-default cursor-pointer"
              aria-label="Column layout"
            >
              <LayoutGrid size={16} strokeWidth={2} aria-hidden />
            </button>
            {!isComplete ? (
              <button
                type="button"
                onClick={() => setShowEndTestModal(true)}
                className="inline-flex size-8 items-center justify-center rounded border border-border-subtle bg-bg-surface text-ink hover:bg-bg-default cursor-pointer"
                aria-label="End test"
              >
                <StopCircle size={16} strokeWidth={2} aria-hidden />
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
          <div className="flex w-full min-w-[min(100%,280px)] max-w-[400px] flex-col gap-1">
            <div className="flex w-full items-center gap-2 text-xs leading-4 text-ink">
              <span className="min-w-0 flex-1">{formatTimelineDate(startDate)}</span>
              <span className="min-w-0 flex-1 text-right">{formatTimelineDate(endDate)}</span>
            </div>
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-border-subtle">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-primary"
                style={{ width: `${timelinePct}%` }}
              />
              <div
                className="pointer-events-none absolute top-1/2 z-[1] h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-bg-surface shadow-[0_0_0_1px_var(--color-primary)]"
                style={{ left: `${timelinePct}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {variationIds.map((vid, i) => {
              const { letter, circleClass } = splitRowStyle(i);
              const pct = trafficSplit[i] ?? 0;
              return (
                <div key={`${vid}-split`} className="flex items-center gap-2">
                  <div
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full ${circleClass} text-sm text-white leading-5`}
                  >
                    {letter}
                  </div>
                  <p className="text-sm leading-5">
                    <span className="text-subdued">Split:</span>{" "}
                    <span className="text-ink tabular-nums">{pct}%</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {isComplete ? (
          <div className="flex flex-col gap-3 rounded border border-border-subtle bg-bg-surface px-4 py-3">
            {appliedVariationId ? (
              <p className="text-sm text-success-ink leading-5">
                Live ranking has been updated to match{" "}
                <span className="font-medium">{AB_TEST_VARIATION_LABELS[appliedVariationId]}</span>.
              </p>
            ) : successful && winnerId ? (
              <>
                <p className="text-sm text-ink leading-5">
                  <span className="font-medium text-ink">{winnerLabel}</span> beat Control on illustrative CVR. You
                  can apply those settings to live ranking.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(true)}
                    className="h-9 px-4 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover cursor-pointer"
                  >
                    Apply {winnerLabel} to live
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-subdued leading-5">
                This test did not beat Control on illustrative CVR. There is no alternate configuration to apply.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="border-t border-border-subtler bg-bg-surface">
        <AbTestMetricsTable variationIds={variationIds} tableData={tableData} winnerIndex={winnerIndex} />
      </div>

      <div className="border-t border-border-subtler bg-bg-sidebar px-4 py-2">
        <button
          type="button"
          onClick={dismissActiveAbTest}
          className="text-xs text-subdued underline hover:text-ink cursor-pointer"
        >
          Remove test from Explore
        </button>
      </div>

      <ConfirmModal
        open={showEndTestModal}
        title="End test?"
        message="The test will be marked completed using prototype results. You can then apply a winning configuration to live ranking if the test succeeded."
        primaryActionLabel="End test"
        onCancel={() => setShowEndTestModal(false)}
        onSave={() => {
          completeActiveAbTest();
          setShowEndTestModal(false);
        }}
      />

      <ConfirmModal
        open={showApplyModal}
        title="Apply to live ranking?"
        message={`This will update Control (live) to use the same DRR settings as ${winnerLabel}. DRR activation will be turned on or off to match that arm.`}
        secondaryMessage="This is a prototype: no real index changes are made."
        primaryActionLabel="Apply to live"
        onCancel={() => setShowApplyModal(false)}
        onSave={handleConfirmApply}
      />
    </section>
  );
}

function AbTestMetricsTable({
  variationIds,
  tableData,
  winnerIndex,
}: {
  variationIds: AbTestVariationId[];
  tableData: ReturnType<typeof getIllustrativeAbTestTableData>;
  winnerIndex: number;
}) {
  const { searches, users, ctr, cvr } = tableData;

  const thClass =
    "h-12 px-4 text-left text-sm font-normal text-ink leading-5 border-b border-border-subtler bg-bg-default";
  const thNumClass = `${thClass} text-right`;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            <th className={thClass}>Variant</th>
            <th className={thNumClass}>Tracked searches</th>
            <th className={thNumClass}>Tracked users</th>
            <th className={thNumClass}>CTR</th>
            <th className={thNumClass}>CVR</th>
          </tr>
        </thead>
        <tbody>
          {variationIds.map((vid, i) => {
            const { letter, circleClass } = tableBadge(vid);
            const cvrCell = cvr[i] ?? { kind: "baseline" as const, text: "Baseline" };
            const isWinnerRow = i === winnerIndex && i !== 0;
            return (
              <tr key={vid}>
                <td className="h-14 border-b border-border-subtler bg-bg-surface px-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex size-4 shrink-0 items-center justify-center rounded-full ${circleClass} text-[10px] font-normal text-white leading-4`}
                    >
                      {letter}
                    </div>
                    <span className="truncate text-ink leading-5">{AB_TEST_VARIATION_LABELS[vid]}</span>
                    {isWinnerRow ? (
                      <span className="shrink-0 rounded-full border border-success-border bg-success-bg px-1.5 py-0 text-xs text-success-ink">
                        Winner
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="h-14 border-b border-border-subtler bg-bg-surface px-4 text-right tabular-nums text-ink/80 leading-5">
                  {searches[i]?.toLocaleString() ?? "—"}
                </td>
                <td className="h-14 border-b border-border-subtler bg-bg-surface px-4 text-right tabular-nums text-ink/80 leading-5">
                  {users[i]?.toLocaleString() ?? "—"}
                </td>
                <td className="h-14 border-b border-border-subtler bg-bg-surface px-4 text-right text-ink leading-5">
                  {ctr[i] ?? "—"}
                </td>
                <td className="h-14 border-b border-border-subtler bg-bg-surface px-4 text-right leading-5">
                  {cvrCell.kind === "baseline" ? (
                    <span className="text-ink">{cvrCell.text}</span>
                  ) : (
                    <span
                      className={
                        cvrCell.text.startsWith("-")
                          ? "text-[#d4142a]"
                          : "text-green-700"
                      }
                    >
                      {cvrCell.text}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
          <tr>
            <td className="h-14 border-b border-border-subtler bg-bg-surface px-4 text-ink leading-5">
              Confidence
            </td>
            <td className="h-14 border-b border-border-subtler bg-bg-surface px-4" />
            <td className="h-14 border-b border-border-subtler bg-bg-surface px-4" />
            <td className="h-14 border-b border-border-subtler bg-bg-surface px-4 text-right align-middle">
              <span className="inline-flex rounded-full border border-border-subtle bg-bg-sidebar px-2 py-0.5 text-sm text-ink leading-5">
                Status
              </span>
            </td>
            <td className="h-14 border-b border-border-subtler bg-bg-surface px-4 text-right align-middle">
              <span className="inline-flex rounded-full border border-border-subtle bg-bg-sidebar px-2 py-0.5 text-sm text-ink leading-5">
                Status
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
