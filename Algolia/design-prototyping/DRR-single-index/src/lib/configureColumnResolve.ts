import type { ComparisonPaneMode, DRRSettingsSnapshot } from "../types/drrSettings";
import type { VariantBuildStatus } from "../context/DRRContext";

export type ColumnResolved =
  | { kind: "form"; config: DRRSettingsSnapshot; editable: boolean }
  | { kind: "drr-off" }
  | { kind: "empty-variant"; slot: "A" | "B" }
  | { kind: "building-variant"; slot: "A" | "B" };

export function resolveConfigureColumn(
  mode: ComparisonPaneMode,
  ctx: {
    productionConfig: DRRSettingsSnapshot;
    localConfig: DRRSettingsSnapshot;
    variantAConfig: DRRSettingsSnapshot;
    variantBConfig: DRRSettingsSnapshot;
    hasVariantA: boolean;
    hasVariantB: boolean;
    variantABuildStatus: VariantBuildStatus;
    variantBBuildStatus: VariantBuildStatus;
  },
): ColumnResolved {
  if (mode === "drr-off") {
    return { kind: "drr-off" };
  }
  if (mode === "control") {
    return { kind: "form", config: ctx.localConfig, editable: true };
  }
  if (mode === "variant-a") {
    if (ctx.variantABuildStatus === "building") return { kind: "building-variant", slot: "A" };
    if (!ctx.hasVariantA) return { kind: "empty-variant", slot: "A" };
    return { kind: "form", config: ctx.variantAConfig, editable: true };
  }
  if (mode === "variant-b") {
    if (ctx.variantBBuildStatus === "building") return { kind: "building-variant", slot: "B" };
    if (!ctx.hasVariantB) return { kind: "empty-variant", slot: "B" };
    return { kind: "form", config: ctx.variantBConfig, editable: true };
  }
  return { kind: "form", config: ctx.localConfig, editable: true };
}

/** Labels aligned with Configure segmented control (Draft 1 / Draft 2). */
export function configureCompareColumnTitle(mode: ComparisonPaneMode): string {
  if (mode === "drr-off") return "DRR off";
  if (mode === "control") return "Control";
  if (mode === "variant-a") return "Draft 1";
  if (mode === "variant-b") return "Draft 2";
  return "DRR off";
}

export type CompareColumnMode = "interactive" | "readonly" | "inactive";

export function toCompareColumn(
  resolved: ColumnResolved,
  localConfig: DRRSettingsSnapshot,
): { config: DRRSettingsSnapshot; mode: CompareColumnMode } {
  switch (resolved.kind) {
    case "drr-off":
      return { config: localConfig, mode: "inactive" };
    case "form":
      return {
        config: resolved.config,
        mode: resolved.editable ? "interactive" : "readonly",
      };
    case "empty-variant":
    case "building-variant":
      return { config: localConfig, mode: "readonly" };
  }
}
