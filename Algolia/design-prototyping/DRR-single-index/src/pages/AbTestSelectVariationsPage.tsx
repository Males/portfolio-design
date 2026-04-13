import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AbTestWizardChrome from "../components/AbTestWizardChrome";
import { useDRR } from "../context/DRRContext";
import {
  AB_TEST_VARIATION_LABELS,
  type AbTestVariationId,
  equalTrafficSplit,
} from "../types/abTest";

const ALL_IDS: AbTestVariationId[] = ["control", "drr-off", "variant-a", "variant-b"];

export default function AbTestSelectVariationsPage() {
  const navigate = useNavigate();
  const {
    hasVariantA,
    hasVariantB,
    abTestSelectedVariations,
    setAbTestSelectedVariations,
    setAbTestTrafficSplit,
  } = useDRR();

  const availability = useMemo(
    () => ({
      control: true,
      "drr-off": true,
      "variant-a": hasVariantA,
      "variant-b": hasVariantB,
    }),
    [hasVariantA, hasVariantB],
  );

  const toggle = (id: AbTestVariationId) => {
    if (!availability[id]) return;
    setAbTestSelectedVariations(
      abTestSelectedVariations.includes(id)
        ? abTestSelectedVariations.filter((x) => x !== id)
        : [...abTestSelectedVariations, id],
    );
  };

  const canContinue = abTestSelectedVariations.length >= 2;

  const handleContinue = () => {
    if (!canContinue) return;
    setAbTestTrafficSplit(equalTrafficSplit(abTestSelectedVariations.length));
    navigate("/ab-test/traffic");
  };

  return (
    <AbTestWizardChrome
      currentStepIndex={0}
      subtitle="Pick the ranking configurations you want to compare in this test."
    >
      <h2 className="text-lg font-semibold text-ink tracking-tight">Variations</h2>
      <p className="text-sm text-subdued mt-1 leading-5 max-w-lg">
        Select at least two arms. Variation A and B are only available after you build them on Configure.
      </p>

      <div className="mt-6 rounded-xl border border-border-subtle bg-bg-surface divide-y divide-border-subtler">
        {ALL_IDS.map((id) => {
          const enabled = availability[id];
          const checked = abTestSelectedVariations.includes(id);
          return (
            <label
              key={id}
              className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer ${
                enabled ? "hover:bg-bg-sidebar/60" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <input
                type="checkbox"
                className="size-4 rounded border-border-subtle text-primary focus:ring-primary"
                checked={checked}
                disabled={!enabled}
                onChange={() => toggle(id)}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink">{AB_TEST_VARIATION_LABELS[id]}</div>
                {!enabled && id.startsWith("variant") && (
                  <div className="text-xs text-subdued mt-0.5">Build this preview on Configure first</div>
                )}
              </div>
            </label>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-10 gap-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back
        </button>
        <button
          type="button"
          disabled={!canContinue}
          onClick={handleContinue}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg cursor-pointer ${
            canContinue
              ? "text-white bg-primary hover:bg-primary-hover"
              : "text-subdued bg-bg-sidebar border border-border-subtle cursor-not-allowed"
          }`}
        >
          Continue
          <ArrowRight size={16} strokeWidth={2} />
        </button>
      </div>
    </AbTestWizardChrome>
  );
}
