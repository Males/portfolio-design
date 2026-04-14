import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ExploreConfigureTabs from "../components/ExploreConfigureTabs";
import ConfirmModal from "../components/ConfirmModal";
import SaveLiveFlowModal from "../components/SaveLiveFlowModal";
import DeactivateModal from "../components/DeactivateModal";
import PaneSegmentControl from "../components/PaneSegmentControl";
import SettingsCompareForm from "../components/SettingsCompareForm";
import {
  BuildingColumnAside,
  CreateNewVariantCard,
  DrrOffColumnAside,
} from "../components/GeneralColumnAside";
import { useDRR } from "../context/DRRContext";
import type { ComparisonPaneMode, DRRSettingsSnapshot } from "../types/drrSettings";
import { diffSettings } from "../lib/configDiff";
import {
  configureCompareColumnTitle,
  resolveConfigureColumn,
  toCompareColumn,
  type ColumnResolved,
} from "../lib/configureColumnResolve";

function cloneSnapshot(c: DRRSettingsSnapshot): DRRSettingsSnapshot {
  return {
    ...c,
    reRankingFilter: { ...c.reRankingFilter },
  };
}

function generalAsideFor(
  resolved: ColumnResolved,
  onCreate: (slot: "A" | "B") => void,
  createDisabled: boolean,
): ReactNode | null {
  if (resolved.kind === "empty-variant") {
    return (
      <CreateNewVariantCard onCreate={() => onCreate(resolved.slot)} disabled={createDisabled} />
    );
  }
  if (resolved.kind === "building-variant") {
    return <BuildingColumnAside slot={resolved.slot} />;
  }
  if (resolved.kind === "drr-off") {
    return <DrrOffColumnAside />;
  }
  return null;
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
    beginAbTestWizard,
  } = useDRR();

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [localConfig, setLocalConfig] = useState({ ...productionConfig });
  const [savedBaseline, setSavedBaseline] = useState(() => ({
    control: cloneSnapshot(productionConfig),
    a: cloneSnapshot(variantAConfig),
    b: cloneSnapshot(variantBConfig),
  }));
  const [leftMode, setLeftMode] = useState<ComparisonPaneMode>("control");
  const [rightMode, setRightMode] = useState<ComparisonPaneMode>("variant-a");

  useEffect(() => {
    setLocalConfig({ ...productionConfig });
    setSavedBaseline((prev) => ({
      ...prev,
      control: cloneSnapshot(productionConfig),
    }));
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

  const controlDirty = useMemo(
    () => diffSettings(savedBaseline.control, localConfig).length > 0,
    [savedBaseline.control, localConfig],
  );

  const draftADirty = useMemo(
    () => diffSettings(savedBaseline.a, variantAConfig).length > 0,
    [savedBaseline.a, variantAConfig],
  );

  const draftBDirty = useMemo(
    () => diffSettings(savedBaseline.b, variantBConfig).length > 0,
    [savedBaseline.b, variantBConfig],
  );

  const hasUnsavedChanges = controlDirty || draftADirty || draftBDirty;

  const commitSavedBaseline = useCallback(() => {
    setSavedBaseline({
      control: cloneSnapshot(localConfig),
      a: cloneSnapshot(variantAConfig),
      b: cloneSnapshot(variantBConfig),
    });
  }, [localConfig, variantAConfig, variantBConfig]);

  const handleSave = () => {
    if (!hasUnsavedChanges) return;
    if (controlDirty) {
      setShowSaveModal(true);
      return;
    }
    commitSavedBaseline();
    showToast("Draft changes saved.");
  };

  const handleConfirmSave = () => {
    replaceProductionConfig({
      ...localConfig,
      reRankingFilter: { ...localConfig.reRankingFilter },
    });
    commitSavedBaseline();
    setShowSaveModal(false);
    showToast("Published to live; all changes saved.");
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

  const leftCompare = toCompareColumn(leftResolved, localConfig);
  const rightCompare = toCompareColumn(rightResolved, localConfig);

  const patchFor = (side: "left" | "right"): ((p: Partial<DRRSettingsSnapshot>) => void) => {
    const mode = side === "left" ? leftMode : rightMode;
    if (mode === "drr-off") return noop;
    if (mode === "control") return updateLocal;
    if (mode === "variant-a") return patchVariantA;
    if (mode === "variant-b") return patchVariantB;
    return noop;
  };

  const twinCreate =
    leftResolved.kind === "empty-variant" && rightResolved.kind === "empty-variant";

  const leftGeneralAside = twinCreate
    ? undefined
    : generalAsideFor(leftResolved, handleCreateSlotPreview, building);
  const rightGeneralAside = twinCreate
    ? undefined
    : generalAsideFor(rightResolved, handleCreateSlotPreview, building);

  const generalTwinCreate = twinCreate
    ? {
        onCreateLeft: () => handleCreateSlotPreview(leftResolved.slot),
        onCreateRight: () => handleCreateSlotPreview(rightResolved.slot),
        createDisabled: building,
      }
    : undefined;

  return (
    <div className="p-8" style={{ animation: "fadeSlideIn 0.3s ease-out" }}>
      <PageHeader
        onActivate={handleActivate}
        onDeactivate={() => setShowDeactivateModal(true)}
        onCreateTest={() => {
          beginAbTestWizard();
          navigate("/ab-test/build");
        }}
      />

      <ExploreConfigureTabs active="configure" />

      <div className="max-w-[1320px] flex flex-col gap-6">
        <div className="flex flex-col gap-6 min-w-0">
          {/* Same 3-col grid as SettingsCompareForm header so segments sit above the correct data columns */}
          <div className="hidden lg:grid grid-cols-[minmax(200px,26%)_minmax(0,1fr)_minmax(0,1fr)] gap-4 items-start px-1 pt-4">
            <div aria-hidden className="min-h-px" />
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-xs font-semibold uppercase leading-4 text-subdued">Left column</span>
              <PaneSegmentControl
                value={leftMode}
                onChange={setLeftMode}
                ariaLabel="Left configure column source"
                showVariantA={hasVariantA || variantABuildStatus === "building"}
                showVariantB={hasVariantB || variantBBuildStatus === "building"}
                alwaysShowVariants
                visualVariant="ds"
                fullWidth
                variantSlotLabels={{ a: "Draft 1", b: "Draft 2" }}
              />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-xs font-semibold uppercase leading-4 text-subdued">Right column</span>
              <PaneSegmentControl
                value={rightMode}
                onChange={setRightMode}
                ariaLabel="Right configure column source"
                showVariantA={hasVariantA || variantABuildStatus === "building"}
                showVariantB={hasVariantB || variantBBuildStatus === "building"}
                alwaysShowVariants
                visualVariant="ds"
                fullWidth
                variantSlotLabels={{ a: "Draft 1", b: "Draft 2" }}
              />
            </div>
          </div>
          <div className="lg:hidden flex flex-col gap-6">
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-xs font-semibold uppercase leading-4 text-subdued">Left column</span>
              <PaneSegmentControl
                value={leftMode}
                onChange={setLeftMode}
                ariaLabel="Left configure column source"
                showVariantA={hasVariantA || variantABuildStatus === "building"}
                showVariantB={hasVariantB || variantBBuildStatus === "building"}
                alwaysShowVariants
                visualVariant="ds"
                fullWidth
                variantSlotLabels={{ a: "Draft 1", b: "Draft 2" }}
              />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-xs font-semibold uppercase leading-4 text-subdued">Right column</span>
              <PaneSegmentControl
                value={rightMode}
                onChange={setRightMode}
                ariaLabel="Right configure column source"
                showVariantA={hasVariantA || variantABuildStatus === "building"}
                showVariantB={hasVariantB || variantBBuildStatus === "building"}
                alwaysShowVariants
                visualVariant="ds"
                fullWidth
                variantSlotLabels={{ a: "Draft 1", b: "Draft 2" }}
              />
            </div>
          </div>

          <SettingsCompareForm
            leftPaneId="configure-left"
            rightPaneId="configure-right"
            leftLabel={configureCompareColumnTitle(leftMode)}
            rightLabel={configureCompareColumnTitle(rightMode)}
            leftConfig={leftCompare.config}
            rightConfig={rightCompare.config}
            leftColumnMode={leftCompare.mode}
            rightColumnMode={rightCompare.mode}
            onPatchLeft={patchFor("left")}
            onPatchRight={patchFor("right")}
            leftGeneralAside={leftGeneralAside ?? undefined}
            rightGeneralAside={rightGeneralAside ?? undefined}
            generalTwinCreate={generalTwinCreate}
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pb-8">
          {!hasUnsavedChanges ? (
            <p className="mr-auto max-w-md text-sm text-subdued leading-5">
              No unsaved changes in Control, Draft 1, or Draft 2.
            </p>
          ) : !controlDirty ? (
            <p className="mr-auto max-w-md text-sm text-subdued leading-5">
              Draft edits aren’t marked saved yet. Save records them in this session (no live publish). Editing Control
              will prompt before publishing to live.
            </p>
          ) : null}
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
            disabled={!hasUnsavedChanges}
            title={
              !hasUnsavedChanges
                ? "No changes to save."
                : controlDirty
                  ? "Saving will ask you to confirm before publishing Control to live."
                  : "Save draft changes (Control unchanged)."
            }
            className={`px-5 py-2.5 text-sm font-medium rounded-lg cursor-pointer ${
              hasUnsavedChanges
                ? "text-white bg-primary hover:bg-primary-hover"
                : "text-subdued bg-bg-sidebar border border-border-subtle cursor-not-allowed"
            }`}
          >
            Save changes
          </button>
        </div>
      </div>

      <SaveLiveFlowModal
        open={showSaveModal}
        onCancel={() => setShowSaveModal(false)}
        onPreviewInComparison={handleOpenExplore}
        onSaveLive={handleConfirmSave}
      />

      <ConfirmModal
        open={showActivateModal}
        title="You are updating live ranking"
        message="Activating dynamic re-ranking will change your live results straight away."
        secondaryMessage="Review the comparison view on Explore to validate ranking changes before activating."
        onCancel={() => setShowActivateModal(false)}
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
