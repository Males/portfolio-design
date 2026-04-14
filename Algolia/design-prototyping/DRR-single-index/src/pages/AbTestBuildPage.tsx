import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import AbTestWizardChrome from "../components/AbTestWizardChrome";
import { useDRR } from "../context/DRRContext";
import { diffSettings } from "../lib/configDiff";
import type { DRRSettingsSnapshot } from "../types/drrSettings";
import type { AbTestVariationId } from "../types/abTest";
import { AB_TEST_EXPERIMENT_VARIANT_LABELS, AB_TEST_VARIATION_LABELS } from "../types/abTest";

const INDEX_OPTIONS = ["prod_products", "Adam_Test_2000", "staging_catalog"] as const;

const CONFIG_OPTIONS: AbTestVariationId[] = ["drr-off", "control", "variant-a", "variant-b"];

const ADD_POOL: AbTestVariationId[] = ["variant-b", "variant-a", "drr-off"];

function badgeColor(id: AbTestVariationId): string {
  if (id === "control") return "bg-purple-500";
  if (id === "variant-b") return "bg-[#457aff]";
  if (id === "variant-a") return "bg-[#2563eb]";
  return "bg-[#64748b]";
}

function letterFor(index: number): string {
  return ["A", "B", "C", "D"][index] ?? "?";
}

function configForVariationId(
  id: AbTestVariationId,
  productionConfig: DRRSettingsSnapshot,
  variantAConfig: DRRSettingsSnapshot,
  variantBConfig: DRRSettingsSnapshot,
) {
  if (id === "variant-a") return variantAConfig;
  if (id === "variant-b") return variantBConfig;
  return productionConfig;
}

function builtForVariationId(
  id: AbTestVariationId,
  hasVariantA: boolean,
  hasVariantB: boolean,
): boolean {
  if (id === "variant-a") return hasVariantA;
  if (id === "variant-b") return hasVariantB;
  return true;
}

/** Replace draft slots that aren’t built yet; fix duplicate IDs so each arm stays unique. */
function normalizeAbTestSlots(
  ids: AbTestVariationId[],
  hasVariantA: boolean,
  hasVariantB: boolean,
): AbTestVariationId[] {
  const next = ids.map((id) => {
    if (id === "variant-a" && !hasVariantA) return "drr-off";
    if (id === "variant-b" && !hasVariantB) return "drr-off";
    return id;
  });
  if (new Set(next).size === next.length) return next;

  const used = new Set<AbTestVariationId>();
  const result: AbTestVariationId[] = [];
  for (const id of next) {
    if (!used.has(id)) {
      used.add(id);
      result.push(id);
      continue;
    }
    const pick = (["variant-b", "variant-a", "drr-off", "control"] as const).find(
      (c) =>
        !used.has(c) &&
        (c !== "variant-a" || hasVariantA) &&
        (c !== "variant-b" || hasVariantB),
    );
    if (pick) {
      used.add(pick);
      result.push(pick);
    }
  }
  return result.length >= 2 ? result : ["control", "drr-off"];
}

export default function AbTestBuildPage() {
  const navigate = useNavigate();
  const {
    productionConfig,
    variantAConfig,
    variantBConfig,
    hasVariantA,
    hasVariantB,
    abTestSelectedVariations,
    setAbTestSelectedVariations,
    abTestFlowIndexId,
    setAbTestFlowIndexId,
    abTestArmIndexIds,
    setAbTestArmIndexIds,
    setSettingsPreferredBuildTarget,
  } = useDRR();

  const varKey = abTestSelectedVariations.join(",");

  useEffect(() => {
    const n = abTestSelectedVariations.length;
    setAbTestArmIndexIds((prev) => {
      if (prev.length === n) return prev;
      if (prev.length > n) return prev.slice(0, n);
      const fill = prev[prev.length - 1] ?? abTestFlowIndexId;
      return [...prev, ...Array.from({ length: n - prev.length }, () => fill)];
    });
  }, [varKey, abTestSelectedVariations.length, abTestFlowIndexId, setAbTestArmIndexIds]);

  useEffect(() => {
    setAbTestSelectedVariations((prev) => {
      const normalized = normalizeAbTestSlots(prev, hasVariantA, hasVariantB);
      if (normalized.join(",") === prev.join(",")) return prev;
      return normalized;
    });
  }, [hasVariantA, hasVariantB, setAbTestSelectedVariations]);

  const canContinue = useMemo(() => {
    const ids = abTestSelectedVariations;
    if (ids.length < 2) return false;
    if (ids.includes("variant-a") && !hasVariantA) return false;
    if (ids.includes("variant-b") && !hasVariantB) return false;
    return true;
  }, [abTestSelectedVariations, hasVariantA, hasVariantB]);

  const addableCount = useMemo(() => {
    const inUse = new Set(abTestSelectedVariations);
    return ADD_POOL.filter((id) => !inUse.has(id)).length;
  }, [abTestSelectedVariations]);

  const maxVariants = 4;

  const configurationChoicesAt = (slotIndex: number, currentId: AbTestVariationId): AbTestVariationId[] => {
    const usedOnOtherSlots = new Set(
      abTestSelectedVariations.filter((_, j) => j !== slotIndex),
    );
    return CONFIG_OPTIONS.filter((opt) => {
      if (usedOnOtherSlots.has(opt) && opt !== currentId) return false;
      if (opt === "variant-a" && !hasVariantA && opt !== currentId) return false;
      if (opt === "variant-b" && !hasVariantB && opt !== currentId) return false;
      return true;
    });
  };

  const removeAtIndex = (index: number) => {
    const id = abTestSelectedVariations[index];
    if (id === "control") return;
    setAbTestSelectedVariations(abTestSelectedVariations.filter((_, j) => j !== index));
    setAbTestArmIndexIds(abTestArmIndexIds.filter((_, j) => j !== index));
  };

  const addArm = () => {
    const next = ADD_POOL.find((id) => !abTestSelectedVariations.includes(id));
    if (!next || abTestSelectedVariations.length >= maxVariants) return;
    const fill = abTestArmIndexIds[abTestArmIndexIds.length - 1] ?? abTestFlowIndexId;
    setAbTestSelectedVariations([...abTestSelectedVariations, next]);
    setAbTestArmIndexIds([...abTestArmIndexIds, fill]);
  };

  const setConfigurationAt = (index: number, newId: AbTestVariationId) => {
    setAbTestSelectedVariations((prev) => {
      const next = [...prev];
      next[index] = newId;
      return next;
    });
  };

  const setArmIndexAt = (index: number, value: string) => {
    setAbTestArmIndexIds((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (index === 0) setAbTestFlowIndexId(value);
  };

  const openEdit = (id: AbTestVariationId) => {
    if (id === "variant-a") setSettingsPreferredBuildTarget("A");
    else if (id === "variant-b") setSettingsPreferredBuildTarget("B");
    else setSettingsPreferredBuildTarget(null);
    navigate("/settings");
  };

  const fieldLabel = "mb-1.5 block text-sm font-medium text-ink";
  const selectClass =
    "w-full rounded-lg border border-border-subtle bg-bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-primary";

  return (
    <AbTestWizardChrome currentStepIndex={0}>
      <p className="text-sm text-subdued leading-5">
        Define each variant in the experiment. Choose the index and ranking configuration (Control, DRR off, or a draft
        you’ve created on Configure).
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {abTestSelectedVariations.map((id, index) => {
          const letter = letterFor(index);
          const configForArm = configForVariationId(id, productionConfig, variantAConfig, variantBConfig);
          const built = builtForVariationId(id, hasVariantA, hasVariantB);
          const indexValue = abTestArmIndexIds[index] ?? abTestFlowIndexId;

          const helperBlock =
            id === "drr-off" ? (
              <p className="mt-2 text-xs text-subdued leading-4">
                Standard ranking — Dynamic Re-ranking is off for this variant.
              </p>
            ) : id === "control" ? (
              <button
                type="button"
                onClick={() => navigate("/settings")}
                className="mt-2 text-sm font-medium text-primary hover:text-primary-hover cursor-pointer"
              >
                View live settings on Configure
              </button>
            ) : (id === "variant-b" || id === "variant-a") && !built ? (
              <p className="mt-2 text-xs text-subdued">Build this draft on Configure to compare DRR settings.</p>
            ) : (id === "variant-b" || id === "variant-a") && built ? (
              <>
                <button
                  type="button"
                  onClick={() => openEdit(id)}
                  className="mt-2 text-sm font-medium text-primary hover:text-primary-hover cursor-pointer"
                >
                  Edit on Configure
                </button>
                <div className="mt-3 space-y-1.5 text-sm">
                  {diffSettings(productionConfig, configForArm)
                    .filter((d) => d.label === "Strategy" || d.label === "Boost factor")
                    .map((d) => (
                      <div key={d.key} className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                        <span className="font-medium text-ink">{d.label}:</span>
                        <span className="text-subdued line-through">{d.before}</span>
                        <span className="font-medium text-green-700" aria-label={`New ${d.label}`}>
                          → {d.after}
                        </span>
                      </div>
                    ))}
                </div>
              </>
            ) : null;

          return (
            <div
              key={`${index}-${id}`}
              className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-[0_1px_2px_rgba(33,36,61,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-md text-sm font-semibold text-white ${badgeColor(id)}`}
                  >
                    {letter}
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-ink">
                      {letter} {AB_TEST_EXPERIMENT_VARIANT_LABELS[id]}
                    </h2>
                  </div>
                </div>
                {id !== "control" ? (
                  <button
                    type="button"
                    onClick={() => removeAtIndex(index)}
                    className="rounded-md p-1 text-subdued hover:bg-bg-sidebar hover:text-ink cursor-pointer"
                    aria-label={`Remove ${AB_TEST_EXPERIMENT_VARIANT_LABELS[id]}`}
                  >
                    <X size={18} strokeWidth={2} />
                  </button>
                ) : null}
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className={fieldLabel} htmlFor={`ab-build-index-${index}`}>
                    Index
                  </label>
                  <select
                    id={`ab-build-index-${index}`}
                    value={indexValue}
                    onChange={(e) => setArmIndexAt(index, e.target.value)}
                    className={selectClass}
                  >
                    {INDEX_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={fieldLabel} htmlFor={`ab-build-config-${index}`}>
                    Configuration
                  </label>
                  <select
                    id={`ab-build-config-${index}`}
                    value={id}
                    onChange={(e) => setConfigurationAt(index, e.target.value as AbTestVariationId)}
                    className={selectClass}
                  >
                    {configurationChoicesAt(index, id).map((opt) => (
                      <option key={opt} value={opt}>
                        {AB_TEST_VARIATION_LABELS[opt]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {helperBlock}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addArm}
        disabled={addableCount === 0 || abTestSelectedVariations.length >= maxVariants}
        className="mt-4 flex w-full items-center justify-center rounded-xl border border-dashed border-border-strong py-3.5 text-sm font-medium text-subdued hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
      >
        + Add variant ({addableCount} more possible)
      </button>

      <div className="mt-10 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-4 py-2.5 text-sm font-medium text-ink hover:bg-bg-sidebar cursor-pointer"
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back
        </button>
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => navigate("/ab-test/configure")}
          className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium cursor-pointer ${
            canContinue
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
