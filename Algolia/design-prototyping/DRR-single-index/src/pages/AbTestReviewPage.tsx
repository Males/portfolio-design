import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AbTestWizardChrome from "../components/AbTestWizardChrome";
import { useDRR } from "../context/DRRContext";
import { diffSettings } from "../lib/configDiff";
import {
  abTestVariationToPaneMode,
  AB_TEST_EXPERIMENT_VARIANT_LABELS,
  type AbTestVariationId,
} from "../types/abTest";

function letterAt(i: number): string {
  return ["A", "B", "C", "D"][i] ?? "?";
}

function circleClass(id: AbTestVariationId): string {
  if (id === "control") return "bg-[#94a3b8]";
  if (id === "variant-b") return "bg-[#2563eb]";
  if (id === "variant-a") return "bg-[#ea580c]";
  return "bg-subdued";
}

export default function AbTestReviewPage() {
  const navigate = useNavigate();
  const skipIncompleteRedirectRef = useRef(false);
  const {
    productionConfig,
    variantAConfig,
    variantBConfig,
    hasVariantA,
    hasVariantB,
    abTestSelectedVariations,
    abTestTrafficSplit,
    abTestDurationDays,
    abTestFlowIndexId,
    abTestArmIndexIds,
    abTestTargetMetric,
    setAbTestTrafficSplit,
    setAbTestDurationDays,
    beginAbTestWizard,
    setActiveAbTest,
    setComparisonLeftMode,
    setComparisonRightMode,
    abTestNameDraft,
    setAbTestNameDraft,
    abTestDescriptionDraft,
    setAbTestDescriptionDraft,
  } = useDRR();

  const n = abTestSelectedVariations.length;

  const indexSummary = useMemo(() => {
    if (abTestArmIndexIds.length === 0) return abTestFlowIndexId;
    const uniq = [...new Set(abTestArmIndexIds)];
    return uniq.length === 1 ? uniq[0]! : uniq.join(", ");
  }, [abTestArmIndexIds, abTestFlowIndexId]);

  useEffect(() => {
    if (n >= 2) return;
    if (skipIncompleteRedirectRef.current) {
      skipIncompleteRedirectRef.current = false;
      return;
    }
    navigate("/ab-test/build", { replace: true });
  }, [n, navigate]);

  const handleLaunch = () => {
    const name = abTestNameDraft.trim() || `Dynamic Re-ranking test — ${abTestFlowIndexId}`;
    setAbTestTrafficSplit(abTestTrafficSplit);
    setAbTestDurationDays(abTestDurationDays);
    setActiveAbTest({
      id: `#${12400 + Math.floor(Math.random() * 999)}`,
      name,
      description: abTestDescriptionDraft.trim() || undefined,
      targetMetric: abTestTargetMetric,
      startedAtMs: Date.now(),
      variationIds: [...abTestSelectedVariations],
      trafficSplit: [...abTestTrafficSplit],
      durationDays: abTestDurationDays,
    });
    const [first, second] = abTestSelectedVariations;
    if (first && second) {
      setComparisonLeftMode(abTestVariationToPaneMode(first));
      setComparisonRightMode(abTestVariationToPaneMode(second));
    }
    skipIncompleteRedirectRef.current = true;
    beginAbTestWizard();
    navigate("/", { replace: true, state: { focusAbTestPreview: true } });
  };

  if (n < 2) return null;

  return (
    <AbTestWizardChrome currentStepIndex={2}>
      <div className="border-b border-border-subtler pb-6">
        <h2 className="text-lg font-semibold text-ink">Review &amp; launch</h2>
        <p className="mt-1 text-sm text-subdued leading-5">
          Confirm your setup, then name the experiment before going live.
        </p>
      </div>

      <div className="space-y-5 pt-6">
        <label className="block">
          <span className="text-sm font-medium text-ink">
            Test name <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            value={abTestNameDraft}
            onChange={(e) => setAbTestNameDraft(e.target.value)}
            autoComplete="off"
            className="mt-1.5 w-full rounded-lg border border-border-subtle px-3 py-2.5 text-sm text-ink outline-none focus:border-primary"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Description</span>
          <textarea
            value={abTestDescriptionDraft}
            onChange={(e) => setAbTestDescriptionDraft(e.target.value)}
            rows={3}
            className="mt-1.5 w-full resize-y rounded-lg border border-border-subtle px-3 py-2.5 text-sm text-ink outline-none focus:border-primary"
          />
        </label>
      </div>

      <div className="mt-8 rounded-xl border border-border-subtle bg-bg-sidebar/40 p-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-subdued">Feature</p>
            <p className="mt-1 text-sm font-medium text-ink">Dynamic Re-ranking</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-subdued">Index</p>
            <p className="mt-1 text-sm font-medium text-ink">{indexSummary}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-subdued">Metric</p>
            <p className="mt-1 text-sm font-medium text-ink">{abTestTargetMetric}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-subdued">Duration</p>
            <p className="mt-1 text-sm font-medium text-ink">{abTestDurationDays} days (est.)</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-subdued">Configuration comparison</h3>
        <div className="mt-4 flex flex-col gap-4">
          {abTestSelectedVariations.map((id, i) => {
            const pct = abTestTrafficSplit[i] ?? 0;
            const isControl = id === "control";
            const config = id === "variant-a" ? variantAConfig : id === "variant-b" ? variantBConfig : productionConfig;
            const built = id === "variant-a" ? hasVariantA : id === "variant-b" ? hasVariantB : true;
            const diffs =
              !isControl && id !== "drr-off" && built ? diffSettings(productionConfig, config) : [];
            const keyDiffs = diffs.filter((d) => d.label === "Strategy" || d.label === "Boost factor");
            const otherDiffs = diffs.filter((d) => d.label !== "Strategy" && d.label !== "Boost factor");

            return (
              <div key={`${id}-rev`} className="rounded-xl border border-border-subtle bg-bg-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex size-8 items-center justify-center rounded-full text-sm font-semibold text-white ${circleClass(id)}`}
                    >
                      {letterAt(i)}
                    </span>
                    <span className="text-sm font-semibold text-ink">{AB_TEST_EXPERIMENT_VARIANT_LABELS[id]}</span>
                    {!isControl && id !== "drr-off" && built && diffs.length > 0 ? (
                      <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-primary">
                        {diffs.length} {diffs.length === 1 ? "change" : "changes"}
                      </span>
                    ) : null}
                  </div>
                  <span className="text-sm text-subdued tabular-nums">{pct}% of traffic</span>
                </div>
                {isControl ? (
                  <div className="mt-3 rounded-lg border border-dashed border-primary/30 bg-blue-100/30 px-3 py-3 text-sm text-subdued">
                    Current Dynamic Re-ranking settings
                  </div>
                ) : id === "drr-off" ? (
                  <div className="mt-3 rounded-lg border border-border-subtle bg-bg-sidebar/50 px-3 py-3 text-sm text-subdued">
                    DRR off — standard ranking
                  </div>
                ) : !built ? (
                  <div className="mt-3 text-sm text-subdued">Draft not built yet.</div>
                ) : (
                  <div className="mt-3 space-y-3 rounded-lg border border-border-subtle bg-bg-sidebar/30 px-3 py-3">
                    {diffs.length > 0 ? (
                      <p className="text-sm text-subdued leading-5">
                        Versus Control, this variant updates{" "}
                        <span className="font-medium text-ink">
                          {diffs.length === 1 ? "one setting" : `${diffs.length} settings`}
                        </span>
                        {diffs.length <= 3
                          ? `: ${diffs.map((d) => d.label.toLowerCase()).join(", ")}.`
                          : ", including ranking strategy and related options."}
                      </p>
                    ) : (
                      <p className="text-sm text-subdued leading-5">
                        No differences detected versus Control for the fields we compare.
                      </p>
                    )}
                    {keyDiffs.length > 0 || otherDiffs.length > 0 ? (
                      <div className="space-y-3 border-t border-border-subtler pt-3">
                        {keyDiffs.map((d) => (
                          <div key={d.key} className="text-sm">
                            <span className="font-medium text-ink">{d.label}</span>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              <span className="text-subdued line-through">{d.before}</span>
                              <span aria-hidden className="text-subdued">
                                →
                              </span>
                              <span className="font-semibold text-ink">{d.after}</span>
                            </div>
                          </div>
                        ))}
                        {otherDiffs.length > 0 ? (
                          <ul className="list-disc space-y-1 pl-4 text-sm text-ink">
                            {otherDiffs.slice(0, 5).map((d) => (
                              <li key={d.key}>
                                <span className="font-medium">{d.label}:</span>{" "}
                                <span className="text-subdued">{d.before}</span>
                                <span className="text-subdued"> → </span>
                                <span>{d.after}</span>
                              </li>
                            ))}
                            {otherDiffs.length > 5 ? (
                              <li className="list-none text-subdued">…and {otherDiffs.length - 5} more.</li>
                            ) : null}
                          </ul>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate("/ab-test/configure")}
          className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-4 py-2.5 text-sm font-medium text-ink hover:bg-bg-sidebar cursor-pointer"
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back
        </button>
        <button
          type="button"
          onClick={handleLaunch}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover cursor-pointer"
        >
          Launch test
        </button>
      </div>
    </AbTestWizardChrome>
  );
}
