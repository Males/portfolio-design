import { useState, useMemo, useLayoutEffect } from "react";
import RankingBadges, { type RankingFilters } from "./RankingBadges";
import SearchResultsGrid from "./SearchResultsGrid";
import DotMatrix from "./DotMatrix";
import {
  getOrderedProducts,
  type MockProduct,
  rankingIdsForPane,
  computeRankMovementsBetween,
} from "../data/mockData";
import type { DRRSettingsSnapshot } from "../types/drrSettings";
import { useDRR } from "../context/DRRContext";
import PaneSegmentControl from "./PaneSegmentControl";

function applyFilters(
  products: MockProduct[],
  filters: RankingFilters,
  isDrrPane: boolean,
): MockProduct[] {
  const sorted = [...products];
  if (!filters.showRules) {
    sorted.sort((a, b) => {
      if (a.hasRules && !b.hasRules) return 1;
      if (!a.hasRules && b.hasRules) return -1;
      return 0;
    });
  }
  if (isDrrPane && !filters.showAI) {
    sorted.reverse();
  }
  return sorted;
}

function rankDeltaMap(baselineIds: string[], viewIds: string[]): Map<string, number> {
  const m = new Map<string, number>();
  viewIds.forEach((id, viewIdx) => {
    const baseIdx = baselineIds.indexOf(id);
    if (baseIdx !== -1) m.set(id, baseIdx - viewIdx);
  });
  return m;
}

interface ComparisonViewProps {
  /** Tighter layout when embedded next to settings. */
  embedded?: boolean;
  /**
   * When set, **Control** uses this snapshot for rankings (unsaved form state).
   * Saved live Control on Explore still uses context `productionConfig`.
   */
  controlPreviewSnapshot?: DRRSettingsSnapshot;
}

export default function ComparisonView({ embedded = false, controlPreviewSnapshot }: ComparisonViewProps) {
  const {
    productionConfig,
    variantAConfig,
    variantBConfig,
    hasVariantA,
    hasVariantB,
    variantABuildStatus,
    variantBBuildStatus,
    comparisonLeftMode,
    comparisonRightMode,
    setComparisonLeftMode,
    setComparisonRightMode,
  } = useDRR();

  const rankingOpts = useMemo(
    () => ({
      productionConfig,
      controlPreviewSnapshot,
      variantAConfig,
      variantBConfig,
      hasVariantA,
      hasVariantB,
    }),
    [productionConfig, controlPreviewSnapshot, variantAConfig, variantBConfig, hasVariantA, hasVariantB],
  );

  const leftIds = useMemo(
    () => rankingIdsForPane(comparisonLeftMode, rankingOpts),
    [comparisonLeftMode, rankingOpts],
  );
  const rightIds = useMemo(
    () => rankingIdsForPane(comparisonRightMode, rankingOpts),
    [comparisonRightMode, rankingOpts],
  );

  const leftProductsBase = useMemo(() => getOrderedProducts(leftIds), [leftIds]);
  const rightProductsBase = useMemo(() => getOrderedProducts(rightIds), [rightIds]);

  const [leftFilters, setLeftFilters] = useState<RankingFilters>({ showRules: true, showAI: true });
  const [rightFilters, setRightFilters] = useState<RankingFilters>({ showRules: true, showAI: true });

  const movements = useMemo(
    () => computeRankMovementsBetween(leftIds, rightIds),
    [leftIds, rightIds],
  );

  const leftIsDrr = comparisonLeftMode !== "drr-off";
  const rightIsDrr = comparisonRightMode !== "drr-off";

  const leftProducts = applyFilters(leftProductsBase, leftFilters, leftIsDrr);
  const rightProducts = applyFilters(rightProductsBase, rightFilters, rightIsDrr);

  const leftRankChanges =
    comparisonLeftMode === "drr-off" ? undefined : rankDeltaMap(rightIds, leftIds);
  const rightRankChanges =
    comparisonRightMode === "drr-off" ? undefined : rankDeltaMap(leftIds, rightIds);

  const leftBuilding =
    comparisonLeftMode === "variant-a"
      ? variantABuildStatus === "building"
      : comparisonLeftMode === "variant-b"
        ? variantBBuildStatus === "building"
        : false;
  const rightBuilding =
    comparisonRightMode === "variant-a"
      ? variantABuildStatus === "building"
      : comparisonRightMode === "variant-b"
        ? variantBBuildStatus === "building"
        : false;

  const showVariantAOption = hasVariantA || variantABuildStatus === "building";
  const showVariantBOption = hasVariantB || variantBBuildStatus === "building";

  useLayoutEffect(() => {
    if (comparisonLeftMode === "variant-a" && !showVariantAOption) setComparisonLeftMode("control");
    else if (comparisonLeftMode === "variant-b" && !showVariantBOption) setComparisonLeftMode("control");
    if (comparisonRightMode === "variant-a" && !showVariantAOption) setComparisonRightMode("control");
    else if (comparisonRightMode === "variant-b" && !showVariantBOption) setComparisonRightMode("control");
  }, [
    comparisonLeftMode,
    comparisonRightMode,
    showVariantAOption,
    showVariantBOption,
    setComparisonLeftMode,
    setComparisonRightMode,
  ]);

  const leftUnset =
    (comparisonLeftMode === "variant-a" && !hasVariantA) ||
    (comparisonLeftMode === "variant-b" && !hasVariantB);
  const rightUnset =
    (comparisonRightMode === "variant-a" && !hasVariantA) ||
    (comparisonRightMode === "variant-b" && !hasVariantB);

  const setLeftFilter = (key: keyof RankingFilters, value: boolean) =>
    setLeftFilters((f) => ({ ...f, [key]: value }));
  const setRightFilter = (key: keyof RankingFilters, value: boolean) =>
    setRightFilters((f) => ({ ...f, [key]: value }));

  const gapClass = embedded ? "gap-4" : "gap-6";
  const matrixPx = embedded ? "px-2" : "px-4";

  return (
    <div className={`flex flex-col ${gapClass}`}>
      <div className="flex min-h-0">
        <div className="flex-1 min-w-0">
          <div className="mb-3">
            <PaneSegmentControl
              value={comparisonLeftMode}
              onChange={setComparisonLeftMode}
              compact={embedded}
              ariaLabel="Left comparison column source"
              showVariantA={showVariantAOption}
              showVariantB={showVariantBOption}
            />
          </div>
          {leftUnset && (
            <p className="text-xs text-subdued mb-2">No preview for this variation yet.</p>
          )}
          <RankingBadges
            variant={leftIsDrr ? "variant" : "control"}
            filters={leftFilters}
            onFilterChange={setLeftFilter}
          />
          <div className="mt-4 relative" id="comparison-left-grid">
            {leftBuilding && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 rounded-lg border border-border-subtle">
                <p className="text-sm font-medium text-ink">Building preview…</p>
              </div>
            )}
            <SearchResultsGrid products={leftProducts} rankChanges={leftRankChanges} />
          </div>
        </div>

        <div className={`flex flex-col shrink-0 ${matrixPx}`}>
          <div className="min-h-[36px] mb-3 sm:min-h-[40px]" aria-hidden />
          <div className="h-[20px]" />
          <div className="h-4" />
          <DotMatrix movements={movements} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-3">
            <PaneSegmentControl
              value={comparisonRightMode}
              onChange={setComparisonRightMode}
              compact={embedded}
              ariaLabel="Right comparison column source"
              showVariantA={showVariantAOption}
              showVariantB={showVariantBOption}
            />
          </div>
          {rightUnset && (
            <p className="text-xs text-subdued mb-2">No preview for this variation yet.</p>
          )}
          <RankingBadges
            variant={rightIsDrr ? "variant" : "control"}
            filters={rightFilters}
            onFilterChange={setRightFilter}
          />
          <div className="mt-4 relative">
            {rightBuilding && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 rounded-lg border border-border-subtle">
                <p className="text-sm font-medium text-ink">Building preview…</p>
              </div>
            )}
            <SearchResultsGrid products={rightProducts} rankChanges={rightRankChanges} />
          </div>
        </div>
      </div>
    </div>
  );
}
