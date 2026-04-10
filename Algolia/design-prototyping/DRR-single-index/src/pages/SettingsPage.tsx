import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ConfirmModal from "../components/ConfirmModal";
import SaveLiveFlowModal from "../components/SaveLiveFlowModal";
import DeactivateModal from "../components/DeactivateModal";
import PostPreviewActionBar from "../components/PostPreviewActionBar";
import PaneSegmentControl from "../components/PaneSegmentControl";
import SettingsCompareForm from "../components/SettingsCompareForm";
import SettingsFormColumn from "../components/SettingsFormColumn";
import ConfigureColumnDiffBanner from "../components/ConfigureColumnDiffBanner";
import ConfigureVariantEmptyPanel from "../components/ConfigureVariantEmptyPanel";
import { useDRR } from "../context/DRRContext";
import type { ComparisonPaneMode, DRRSettingsSnapshot } from "../types/drrSettings";
import type { VariantBuildStatus } from "../context/DRRContext";

type ColumnResolved =
  | { kind: "form"; config: DRRSettingsSnapshot; editable: boolean }
  | { kind: "empty-variant"; slot: "A" | "B" }
  | { kind: "building-variant"; slot: "A" | "B" };

function resolveConfigureColumn(
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

function configureModeLabel(mode: ComparisonPaneMode): string {
  if (mode === "control") return "Control";
  if (mode === "variant-a") return "Variation A";
  if (mode === "variant-b") return "Variation B";
  return "DRR off";
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const {
    productionConfig,
    variantAConfig,
    variantBConfig,
    hasVariantA,
    hasVariantB,
    variantABuildStatus,
    variantBBuildStatus,
    replaceProductionConfig,
    showToast,
    setActiveFlow,
    setComparisonLeftMode,
    setComparisonRightMode,
    startPreviewBuild,
    isFirstTimeUser,
    setIsFirstTimeUser,
    setIsDRRActivated,
    settingsPreferredBuildTarget,
    setSettingsPreferredBuildTarget,
    setVariantAConfig,
    setVariantBConfig,
  } = useDRR();

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [localConfig, setLocalConfig] = useState({ ...productionConfig });
  const [leftMode, setLeftMode] = useState<ComparisonPaneMode>("control");
  const [rightMode, setRightMode] = useState<ComparisonPaneMode>("variant-a");

  useEffect(() => {
    setLocalConfig({ ...productionConfig });
  }, [productionConfig]);

  useEffect(() => {
    if (settingsPreferredBuildTarget === "A") {
      setRightMode("variant-a");
      setSettingsPreferredBuildTarget(null);
    } else if (settingsPreferredBuildTarget === "B") {
      setRightMode("variant-b");
      setSettingsPreferredBuildTarget(null);
    }
  }, [settingsPreferredBuildTarget, setSettingsPreferredBuildTarget]);

  useEffect(() => {
    if (leftMode === "drr-off") setLeftMode("control");
  }, [leftMode]);
  useEffect(() => {
    if (rightMode === "drr-off") setRightMode("control");
  }, [rightMode]);

  const updateLocal = useCallback((patch: Partial<DRRSettingsSnapshot>) => {
    setLocalConfig((prev) => ({
      ...prev,
      ...patch,
      reRankingFilter: { ...prev.reRankingFilter, ...(patch.reRankingFilter ?? {}) },
    }));
  }, []);

  const patchVariantA = useCallback(
    (patch: Partial<DRRSettingsSnapshot>) => {
      setVariantAConfig({
        ...variantAConfig,
        ...patch,
        reRankingFilter: { ...variantAConfig.reRankingFilter, ...(patch.reRankingFilter ?? {}) },
      });
    },
    [setVariantAConfig, variantAConfig],
  );

  const patchVariantB = useCallback(
    (patch: Partial<DRRSettingsSnapshot>) => {
      setVariantBConfig({
        ...variantBConfig,
        ...patch,
        reRankingFilter: { ...variantBConfig.reRankingFilter, ...(patch.reRankingFilter ?? {}) },
      });
    },
    [setVariantBConfig, variantBConfig],
  );

  const noop = useCallback(() => {}, []);

  const handleSave = () => {
    setShowSaveModal(true);
  };

  const handleConfirmSave = () => {
    replaceProductionConfig({
      ...localConfig,
      reRankingFilter: { ...localConfig.reRankingFilter },
    });
    setShowSaveModal(false);
    showToast("Changes saved.");
  };

  const handleCreateTestFromSave = () => {
    setShowSaveModal(false);
    setActiveFlow("ab");
    navigate("/create-variant");
  };

  const handleOpenExplore = () => {
    setShowSaveModal(false);
    setComparisonLeftMode("drr-off");
    setComparisonRightMode("control");
    navigate("/");
  };

  const building = variantABuildStatus === "building" || variantBBuildStatus === "building";

  const handleCreateSlotPreview = (slot: "A" | "B") => {
    if (building) return;
    startPreviewBuild(slot, { ...localConfig });
  };

  const handleActivate = () => {
    if (isFirstTimeUser) setShowActivateModal(true);
    else setIsDRRActivated(true);
  };

  const handleModalSave = () => {
    setShowActivateModal(false);
    setIsFirstTimeUser(false);
    setIsDRRActivated(true);
  };

  const ctx = {
    productionConfig,
    localConfig,
    variantAConfig,
    variantBConfig,
    hasVariantA,
    hasVariantB,
    variantABuildStatus,
    variantBBuildStatus,
  };

  const leftResolved = resolveConfigureColumn(leftMode, ctx);
  const rightResolved = resolveConfigureColumn(rightMode, ctx);

  const showExploreStyleDiff =
    leftResolved.kind === "form" && rightResolved.kind === "form";

  const patchFor = (side: "left" | "right"): ((p: Partial<DRRSettingsSnapshot>) => void) => {
    const mode = side === "left" ? leftMode : rightMode;
    if (mode === "drr-off") return noop;
    if (mode === "control") return updateLocal;
    if (mode === "variant-a") return patchVariantA;
    if (mode === "variant-b") return patchVariantB;
    return noop;
  };

  return (
    <div className="p-8" style={{ animation: "fadeSlideIn 0.3s ease-out" }}>
      <PageHeader
        onActivate={handleActivate}
        onDeactivate={() => setShowDeactivateModal(true)}
        onCreateTest={() => {
          setActiveFlow("ab");
          navigate("/create-variant");
        }}
      />

      <div className="flex gap-8 mt-6 mb-6 border-b border-border-subtle">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-sm font-medium text-subdued pb-3 hover:text-ink cursor-pointer"
        >
          Explore
        </button>
        <button
          type="button"
          className="text-sm font-medium text-primary border-b-2 border-primary -mb-px pb-3 cursor-pointer"
        >
          Configure
        </button>
      </div>

      <div className="max-w-[1320px] flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold text-ink tracking-tight">Configure dynamic re-ranking</h2>
          <p className="text-sm text-subdued mt-1 max-w-3xl leading-relaxed">
            Pick <span className="text-ink font-medium">Control</span> or a variation in each column (same choices as
            Explore, without DRR off — there are no DRR settings when re-ranking is off). Control is your live draft; Save
            updates production. Empty variations show a short setup — then use{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-primary font-medium hover:underline cursor-pointer"
            >
              Explore
            </button>{" "}
            to preview ranking output.
          </p>
        </div>

        {showExploreStyleDiff && (
          <ConfigureColumnDiffBanner left={leftResolved.config} right={rightResolved.config} />
        )}

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-subdued">Left column</span>
              <PaneSegmentControl
                value={leftMode}
                onChange={setLeftMode}
                ariaLabel="Left configure column source"
                showVariantA={hasVariantA || variantABuildStatus === "building"}
                showVariantB={hasVariantB || variantBBuildStatus === "building"}
                alwaysShowVariants
                hideDrrOff
              />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-subdued">Right column</span>
              <PaneSegmentControl
                value={rightMode}
                onChange={setRightMode}
                ariaLabel="Right configure column source"
                showVariantA={hasVariantA || variantABuildStatus === "building"}
                showVariantB={hasVariantB || variantBBuildStatus === "building"}
                alwaysShowVariants
                hideDrrOff
              />
            </div>
          </div>

          {showExploreStyleDiff ? (
            <SettingsCompareForm
              leftPaneId="configure-left"
              rightPaneId="configure-right"
              leftLabel={configureModeLabel(leftMode)}
              rightLabel={configureModeLabel(rightMode)}
              leftConfig={leftResolved.config}
              rightConfig={rightResolved.config}
              leftEditable={leftResolved.editable}
              rightEditable={rightResolved.editable}
              onPatchLeft={patchFor("left")}
              onPatchRight={patchFor("right")}
            />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
              <div className="flex flex-col gap-3 min-w-0">
                {leftResolved.kind === "form" && (
                  <SettingsFormColumn
                    paneId="configure-left"
                    config={leftResolved.config}
                    editable={leftResolved.editable}
                    onPatch={patchFor("left")}
                  />
                )}
                {leftResolved.kind === "empty-variant" && (
                  <ConfigureVariantEmptyPanel
                    slot={leftResolved.slot}
                    onCreatePreview={() => handleCreateSlotPreview(leftResolved.slot)}
                    building={false}
                    disabled={building}
                  />
                )}
                {leftResolved.kind === "building-variant" && (
                  <ConfigureVariantEmptyPanel
                    slot={leftResolved.slot}
                    onCreatePreview={() => {}}
                    building
                  />
                )}
              </div>
              <div className="flex flex-col gap-3 min-w-0">
                {rightResolved.kind === "form" && (
                  <SettingsFormColumn
                    paneId="configure-right"
                    config={rightResolved.config}
                    editable={rightResolved.editable}
                    onPatch={patchFor("right")}
                  />
                )}
                {rightResolved.kind === "empty-variant" && (
                  <ConfigureVariantEmptyPanel
                    slot={rightResolved.slot}
                    onCreatePreview={() => handleCreateSlotPreview(rightResolved.slot)}
                    building={false}
                    disabled={building}
                  />
                )}
                {rightResolved.kind === "building-variant" && (
                  <ConfigureVariantEmptyPanel
                    slot={rightResolved.slot}
                    onCreatePreview={() => {}}
                    building
                  />
                )}
              </div>
            </div>
          )}
        </div>

        <PostPreviewActionBar />

        <div className="flex items-center justify-end gap-3 pb-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2.5 text-sm font-medium text-ink border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover cursor-pointer"
          >
            Save changes
          </button>
        </div>
      </div>

      <SaveLiveFlowModal
        open={showSaveModal}
        onCancel={() => setShowSaveModal(false)}
        onPreviewInComparison={handleOpenExplore}
        onCreateTest={handleCreateTestFromSave}
        onSaveLive={handleConfirmSave}
      />

      <ConfirmModal
        open={showActivateModal}
        title="You are updating live ranking"
        message="Activating dynamic re-ranking will change your live results straight away."
        secondaryMessage="We recommend running an A/B test first, so you can confirm the impact on clicks and conversion before it goes live."
        onCancel={() => setShowActivateModal(false)}
        onCreateTest={() => {
          setShowActivateModal(false);
          setActiveFlow("first-time");
          navigate("/create-variant");
        }}
        onSave={handleModalSave}
      />

      <DeactivateModal
        open={showDeactivateModal}
        onCancel={() => setShowDeactivateModal(false)}
        onConfirm={() => {
          setShowDeactivateModal(false);
          setIsDRRActivated(false);
        }}
      />
    </div>
  );
}
