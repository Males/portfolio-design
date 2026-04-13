import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AbTestWizardChrome from "../components/AbTestWizardChrome";
import { useDRR } from "../context/DRRContext";
import {
  AB_TEST_VARIATION_LABELS,
  abTestVariationToPaneMode,
  equalTrafficSplit,
} from "../types/abTest";

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

export default function AbTestTrafficDurationPage() {
  const navigate = useNavigate();
  /** Skip the "incomplete selection" redirect when Start test clears the wizard (n becomes 0) before unmount. */
  const skipIncompleteRedirectRef = useRef(false);
  const {
    abTestSelectedVariations,
    setAbTestTrafficSplit,
    abTestDurationDays,
    setAbTestDurationDays,
    beginAbTestWizard,
    setActiveAbTest,
    setComparisonLeftMode,
    setComparisonRightMode,
  } = useDRR();

  const n = abTestSelectedVariations.length;
  const [localSplits, setLocalSplits] = useState<number[]>(() => (n >= 2 ? equalTrafficSplit(n) : []));
  const [localDuration, setLocalDuration] = useState(abTestDurationDays);
  const [testName, setTestName] = useState("");

  const selectionKey = abTestSelectedVariations.join(",");

  useEffect(() => {
    if (n < 2) {
      if (skipIncompleteRedirectRef.current) {
        skipIncompleteRedirectRef.current = false;
        return;
      }
      navigate("/ab-test/variations", { replace: true });
      return;
    }
    const eq = equalTrafficSplit(n);
    setLocalSplits(eq);
    setAbTestTrafficSplit(eq);
  }, [n, selectionKey, navigate, setAbTestTrafficSplit]);

  useEffect(() => {
    setLocalDuration(abTestDurationDays);
  }, [abTestDurationDays]);

  const handleSplitChange = (index: number, raw: string) => {
    const v = parseInt(raw, 10);
    if (Number.isNaN(v)) return;
    const next = rebalanceSplits(localSplits, index, v, n);
    setLocalSplits(next);
    setAbTestTrafficSplit(next);
  };

  const handleDurationChange = (raw: string) => {
    const v = parseInt(raw, 10);
    if (Number.isNaN(v)) return;
    const clamped = Math.max(1, Math.min(365, v));
    setLocalDuration(clamped);
    setAbTestDurationDays(clamped);
  };

  const handleSubmit = () => {
    setAbTestTrafficSplit(localSplits);
    setAbTestDurationDays(localDuration);
    setActiveAbTest({
      id: `#${12400 + Math.floor(Math.random() * 999)}`,
      name: testName.trim() || "Dynamic re-ranking test",
      startedAtMs: Date.now(),
      variationIds: [...abTestSelectedVariations],
      trafficSplit: [...localSplits],
      durationDays: localDuration,
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

  const totalHead = localSplits.slice(0, n - 1).reduce((a, b) => a + b, 0);
  const lastPct = localSplits[n - 1] ?? Math.max(0, 100 - totalHead);

  return (
    <AbTestWizardChrome
      currentStepIndex={1}
      subtitle="Set how traffic is allocated and how long the test should run."
    >
      <h2 className="text-lg font-semibold text-ink tracking-tight">Traffic & duration</h2>
      <p className="text-sm text-subdued mt-1 leading-5 max-w-lg">
        Allocate traffic across the selected variations. The last arm updates automatically so the total stays 100%.
      </p>

      <div className="mt-6 rounded-xl border border-border-subtle bg-bg-surface p-5 space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="ab-test-name" className="text-sm font-medium text-ink">
            Test name
          </label>
          <input
            id="ab-test-name"
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="e.g. Dynamic re-ranking test"
            autoComplete="off"
            className="w-full max-w-lg px-3 py-2 text-sm text-ink bg-bg-surface border border-border-subtle rounded-lg outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-4 pt-1 border-t border-border-subtler">
          {abTestSelectedVariations.map((id, i) => {
            const isLast = i === n - 1;
            const pct = isLast ? lastPct : localSplits[i] ?? 0;
            return (
              <div key={id} className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="text-sm font-medium text-ink shrink-0">{AB_TEST_VARIATION_LABELS[id]}</span>
                <div className="flex items-center gap-2 w-full sm:w-[200px]">
                  {isLast ? (
                    <span className="text-sm text-subdued tabular-nums w-full text-right">{pct}%</span>
                  ) : (
                    <>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={localSplits[i] ?? 0}
                        onChange={(e) => handleSplitChange(i, e.target.value)}
                        className="w-full min-w-0 px-3 py-2 text-sm text-ink bg-bg-surface border border-border-subtle rounded-lg outline-none focus:border-primary tabular-nums"
                      />
                      <span className="text-sm text-subdued shrink-0">%</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-border-subtler flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium text-ink">Test duration</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={365}
              value={localDuration}
              onChange={(e) => handleDurationChange(e.target.value)}
              className="w-24 px-3 py-2 text-sm text-ink bg-bg-surface border border-border-subtle rounded-lg outline-none focus:border-primary tabular-nums"
            />
            <span className="text-sm text-subdued">days</span>
          </div>
        </div>

        <p className="text-xs text-subdued">
          Total traffic: {localSplits.reduce((a, b) => a + b, 0)}% (must equal 100%)
        </p>
      </div>

      <div className="flex items-center justify-between mt-10 gap-3">
        <button
          type="button"
          onClick={() => navigate("/ab-test/variations")}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover cursor-pointer"
        >
          Start test
        </button>
      </div>
    </AbTestWizardChrome>
  );
}
