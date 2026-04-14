import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AbTestWizardChrome from "../components/AbTestWizardChrome";
import Toggle from "../components/Toggle";
import { useDRR } from "../context/DRRContext";
import { equalTrafficSplit } from "../types/abTest";
import { AB_TEST_EXPERIMENT_VARIANT_LABELS, type AbTestVariationId } from "../types/abTest";

function rebalanceSplits(prev: number[], index: number, value: number, n: number): number[] {
  if (n <= 1) return [100];
  const next = [...prev];
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  next[index] = clamped;
  const headSum = next.slice(0, n - 1).reduce((a, b) => a + b, 0);
  if (headSum > 100) {
    const overflow = headSum - 100;
    next[index] = Math.max(0, next[index] - overflow);
  }
  const newHeadSum = next.slice(0, n - 1).reduce((a, b) => a + b, 0);
  next[n - 1] = Math.max(0, 100 - newHeadSum);
  return next;
}

const METRICS = [
  "Click-through rate",
  "Conversion rate",
  "Add-to-cart rate",
  "Revenue per search",
] as const;

const BAR_COLORS = ["bg-[#3730a3]", "bg-[#2563eb]", "bg-[#ea580c]", "bg-[#7c3aed]"];

function splitBadgeClass(id: AbTestVariationId, i: number): string {
  if (id === "control") return "bg-[#3730a3]";
  if (id === "variant-b") return "bg-[#2563eb]";
  if (id === "variant-a") return "bg-[#ea580c]";
  return BAR_COLORS[i % BAR_COLORS.length] ?? "bg-primary";
}

export default function AbTestConfigurePage() {
  const navigate = useNavigate();
  const {
    abTestSelectedVariations,
    setAbTestTrafficSplit,
    abTestTrafficSplit,
    abTestDurationDays,
    setAbTestDurationDays,
    abTestTargetMetric,
    setAbTestTargetMetric,
    abTestMinChangePct,
    setAbTestMinChangePct,
    abTestEmailReport,
    setAbTestEmailReport,
  } = useDRR();

  const n = abTestSelectedVariations.length;
  const selectionKey = abTestSelectedVariations.join(",");
  const [localSplits, setLocalSplits] = useState<number[]>(() =>
    n >= 2 ? (abTestTrafficSplit.length === n ? [...abTestTrafficSplit] : equalTrafficSplit(n)) : [],
  );
  const [durationEditing, setDurationEditing] = useState(false);

  useEffect(() => {
    if (n < 2) {
      navigate("/ab-test/build", { replace: true });
      return;
    }
    const eq = equalTrafficSplit(n);
    setLocalSplits(eq);
    setAbTestTrafficSplit(eq);
  }, [n, selectionKey, navigate, setAbTestTrafficSplit]);

  const totalHead = localSplits.slice(0, n - 1).reduce((a, b) => a + b, 0);
  const lastPct = localSplits[n - 1] ?? Math.max(0, 100 - totalHead);
  const total = localSplits.reduce((a, b) => a + b, 0);

  const handleSplitChange = (index: number, raw: string) => {
    const v = parseInt(raw, 10);
    if (Number.isNaN(v)) return;
    const next = rebalanceSplits(localSplits, index, v, n);
    setLocalSplits(next);
    setAbTestTrafficSplit(next);
  };

  const equalSplit = () => {
    const eq = equalTrafficSplit(n);
    setLocalSplits(eq);
    setAbTestTrafficSplit(eq);
  };

  return (
    <AbTestWizardChrome currentStepIndex={1}>
      <section className="border-b border-border-subtler pb-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink">Traffic allocation</h2>
        <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-border-subtle">
          {abTestSelectedVariations.map((_, i) => {
            const pct = i === n - 1 ? lastPct : localSplits[i] ?? 0;
            return (
              <div
                key={i}
                className={`h-full min-w-0 transition-[width] duration-200 ${BAR_COLORS[i % BAR_COLORS.length]}`}
                style={{ width: `${pct}%` }}
              />
            );
          })}
        </div>
        <div className="mt-5 space-y-4">
          {abTestSelectedVariations.map((id, i) => {
            const isLast = i === n - 1;
            const pct = isLast ? lastPct : localSplits[i] ?? 0;
            return (
              <div key={id} className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded text-xs font-semibold text-white ${splitBadgeClass(id, i)}`}
                  >
                    {["A", "B", "C", "D"][i]}
                  </span>
                  <span className="truncate text-sm font-medium text-ink">{AB_TEST_EXPERIMENT_VARIANT_LABELS[id]}</span>
                </div>
                <div className="flex w-[88px] shrink-0 items-center gap-1">
                  {isLast ? (
                    <span className="w-full text-right text-sm tabular-nums text-ink">{pct}%</span>
                  ) : (
                    <>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={localSplits[i] ?? 0}
                        onChange={(e) => handleSplitChange(i, e.target.value)}
                        className="w-full min-w-0 rounded-lg border border-border-subtle px-2 py-1.5 text-sm tabular-nums text-ink outline-none focus:border-primary"
                      />
                      <span className="text-sm text-subdued">%</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={equalSplit}
            className="font-medium text-primary hover:text-primary-hover cursor-pointer"
          >
            = Equal split
          </button>
          <span className={`tabular-nums ${total === 100 ? "text-subdued" : "text-red-500"}`}>
            Total: {total}%
          </span>
        </div>
      </section>

      <section className="border-b border-border-subtler py-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink">Target metric</h2>
        <p className="mt-2 text-sm text-subdued leading-5">
          Choosing a primary metric helps us calculate the optimal test duration — the more specific the metric, the more
          accurate the duration estimate.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Target metric</span>
            <select
              value={abTestTargetMetric}
              onChange={(e) => setAbTestTargetMetric(e.target.value)}
              className="w-full rounded-lg border border-border-subtle bg-bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-primary"
            >
              {METRICS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-sm text-subdued whitespace-nowrap">Min. change</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={100}
                value={abTestMinChangePct}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!Number.isNaN(v)) setAbTestMinChangePct(Math.max(0, Math.min(100, v)));
                }}
                className="w-14 rounded-lg border border-border-subtle px-2 py-2 text-sm tabular-nums text-ink outline-none focus:border-primary"
              />
              <span className="text-sm text-subdued">%</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtler py-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink">Estimated duration</h2>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {durationEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={365}
                value={abTestDurationDays}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!Number.isNaN(v)) setAbTestDurationDays(Math.max(1, Math.min(365, v)));
                }}
                className="w-20 rounded-lg border border-border-subtle px-3 py-2 text-sm tabular-nums outline-none focus:border-primary"
              />
              <span className="text-sm text-subdued">days</span>
            </div>
          ) : (
            <p className="text-2xl font-semibold text-ink tabular-nums">{abTestDurationDays} days</p>
          )}
          <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-primary">suggested</span>
          <button
            type="button"
            onClick={() => setDurationEditing((e) => !e)}
            className="rounded-lg border border-border-subtle bg-bg-surface px-3 py-1.5 text-sm font-medium text-ink hover:bg-bg-sidebar cursor-pointer"
          >
            {durationEditing ? "Done" : "Override"}
          </button>
        </div>
        <p className="mt-2 text-xs text-subdued leading-4">
          Based on your historical traffic, {abTestDurationDays} days gives 95% statistical power.
        </p>
      </section>

      <section className="pt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink">Report</h2>
        <div className="mt-4 flex items-center gap-3">
          <Toggle checked={abTestEmailReport} onChange={setAbTestEmailReport} id="ab-email-report" />
          <label htmlFor="ab-email-report" className="text-sm text-ink cursor-pointer">
            Send email report
          </label>
        </div>
      </section>

      <div className="mt-10 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate("/ab-test/build")}
          className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-4 py-2.5 text-sm font-medium text-ink hover:bg-bg-sidebar cursor-pointer"
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back
        </button>
        <button
          type="button"
          disabled={total !== 100}
          onClick={() => navigate("/ab-test/review")}
          className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium cursor-pointer ${
            total === 100
              ? "bg-primary text-white hover:bg-primary-hover"
              : "cursor-not-allowed border border-border-subtle bg-bg-sidebar text-subdued"
          }`}
        >
          Continue
          <ArrowRight size={16} strokeWidth={2} />
        </button>
      </div>
    </AbTestWizardChrome>
  );
}
