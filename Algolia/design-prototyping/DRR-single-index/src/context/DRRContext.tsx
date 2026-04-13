import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import type { ComparisonPaneMode, DRRSettingsSnapshot } from "../types/drrSettings";
import type { AbTestVariationId, ActiveAbTest } from "../types/abTest";

export type { ComparisonPaneMode, DRRSettingsSnapshot };

export type VariantBuildStatus = "idle" | "building" | "ready";

interface DRRState {
  isFirstTimeUser: boolean;
  isDRRActivated: boolean;
  productionConfig: DRRSettingsSnapshot;
  variantAConfig: DRRSettingsSnapshot;
  variantBConfig: DRRSettingsSnapshot;
  hasVariantA: boolean;
  hasVariantB: boolean;
  variantABuildStatus: VariantBuildStatus;
  variantBBuildStatus: VariantBuildStatus;
  toastMessage: string | null;
  comparisonLeftMode: ComparisonPaneMode;
  comparisonRightMode: ComparisonPaneMode;
  /** When set, Configure opens with this build target selected (consumed once). */
  settingsPreferredBuildTarget: "A" | "B" | null;

  setIsFirstTimeUser: (v: boolean) => void;
  setIsDRRActivated: (v: boolean) => void;
  updateProductionConfig: (c: Partial<DRRSettingsSnapshot>) => void;
  /** Replaces live Control entirely (use when saving the full form). */
  replaceProductionConfig: (c: DRRSettingsSnapshot) => void;
  showToast: (message: string) => void;
  setVariantAConfig: (c: DRRSettingsSnapshot) => void;
  setVariantBConfig: (c: DRRSettingsSnapshot) => void;
  setComparisonLeftMode: (m: ComparisonPaneMode) => void;
  setComparisonRightMode: (m: ComparisonPaneMode) => void;
  startPreviewBuild: (target: "A" | "B", snapshot: DRRSettingsSnapshot) => void;
  dismissToast: () => void;
  deleteVariantDraft: (target: "A" | "B") => void;
  applyVariantToLive: (target: "A" | "B") => void;
  setSettingsPreferredBuildTarget: (target: "A" | "B" | null) => void;

  abTestSelectedVariations: AbTestVariationId[];
  setAbTestSelectedVariations: (ids: AbTestVariationId[]) => void;
  abTestTrafficSplit: number[];
  setAbTestTrafficSplit: (pct: number[]) => void;
  abTestDurationDays: number;
  setAbTestDurationDays: (d: number) => void;
  beginAbTestWizard: () => void;

  activeAbTest: ActiveAbTest | null;
  setActiveAbTest: (t: ActiveAbTest | null) => void;
  dismissActiveAbTest: () => void;
  /** Mark the current test ended (prototype) so results / apply are available without waiting. */
  completeActiveAbTest: () => void;
  /** Copy the selected test arm’s settings to live Control (and DRR on/off where relevant). */
  applyAbTestVariationToLive: (id: AbTestVariationId) => void;
}

const defaultProductionConfig: DRRSettingsSnapshot = {
  goal: "Conversion rate",
  eventSourceIndex: "Adam_Test_2000",
  hourlyRefresh: true,
  multiSignalRanking: "head-only",
  rerankedEmptyQueries: true,
  browsingFacetsCount: 20,
  eventFreshness: false,
  groupSimilarQueries: false,
  groupSimilarQueriesLang: "English",
  reRankingFilter: { attribute: "", operator: "is", value: "" },
};

const DRRContext = createContext<DRRState | null>(null);

const BUILD_MS = 2800;

export function DRRProvider({ children }: { children: ReactNode }) {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
  const [isDRRActivated, setIsDRRActivated] = useState(true);
  const [productionConfig, setProductionConfig] = useState<DRRSettingsSnapshot>({
    ...defaultProductionConfig,
  });
  const [variantAConfig, setVariantAConfig] = useState<DRRSettingsSnapshot>({
    ...defaultProductionConfig,
  });
  const [variantBConfig, setVariantBConfig] = useState<DRRSettingsSnapshot>({
    ...defaultProductionConfig,
  });
  const [hasVariantA, setHasVariantA] = useState(false);
  const [hasVariantB, setHasVariantB] = useState(false);
  const [variantABuildStatus, setVariantABuildStatus] = useState<VariantBuildStatus>("idle");
  const [variantBBuildStatus, setVariantBBuildStatus] = useState<VariantBuildStatus>("idle");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [comparisonLeftMode, setComparisonLeftMode] = useState<ComparisonPaneMode>("drr-off");
  const [comparisonRightMode, setComparisonRightMode] = useState<ComparisonPaneMode>("control");
  const [settingsPreferredBuildTarget, setSettingsPreferredBuildTarget] = useState<"A" | "B" | null>(null);
  const [abTestSelectedVariations, setAbTestSelectedVariations] = useState<AbTestVariationId[]>([]);
  const [abTestTrafficSplit, setAbTestTrafficSplit] = useState<number[]>([]);
  const [abTestDurationDays, setAbTestDurationDays] = useState(14);
  const [activeAbTest, setActiveAbTest] = useState<ActiveAbTest | null>(null);

  const productionConfigRef = useRef(productionConfig);
  productionConfigRef.current = productionConfig;
  const variantAConfigRef = useRef(variantAConfig);
  variantAConfigRef.current = variantAConfig;
  const variantBConfigRef = useRef(variantBConfig);
  variantBConfigRef.current = variantBConfig;

  const updateProductionConfig = (c: Partial<DRRSettingsSnapshot>) => {
    setProductionConfig((prev) => ({ ...prev, ...c }));
  };

  const replaceProductionConfig = useCallback((c: DRRSettingsSnapshot) => {
    setProductionConfig({
      ...c,
      reRankingFilter: { ...c.reRankingFilter },
    });
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const dismissToast = useCallback(() => setToastMessage(null), []);

  const startPreviewBuild = useCallback((target: "A" | "B", snapshot: DRRSettingsSnapshot) => {
    if (target === "A") {
      setVariantABuildStatus("building");
    } else {
      setVariantBBuildStatus("building");
    }
    window.setTimeout(() => {
      if (target === "A") {
        setVariantAConfig({ ...snapshot });
        setHasVariantA(true);
        setVariantABuildStatus("ready");
        setToastMessage(
          "Preview ready — Variation A created. Compare DRR off, Control, and Variation A in the comparison view.",
        );
      } else {
        setVariantBConfig({ ...snapshot });
        setHasVariantB(true);
        setVariantBBuildStatus("ready");
        setToastMessage(
          "Preview ready — Variation B created. You can now compare all four: DRR off, Control, A, and B.",
        );
      }
    }, BUILD_MS);
  }, []);

  const deleteVariantDraft = useCallback((target: "A" | "B") => {
    const pc = { ...productionConfigRef.current };
    if (target === "A") {
      setVariantAConfig(pc);
      setHasVariantA(false);
      setVariantABuildStatus("idle");
    } else {
      setVariantBConfig(pc);
      setHasVariantB(false);
      setVariantBBuildStatus("idle");
    }
    setToastMessage(`Variation ${target} preview was deleted.`);
  }, []);

  const applyVariantToLive = useCallback((target: "A" | "B") => {
    const raw = target === "A" ? variantAConfigRef.current : variantBConfigRef.current;
    const snapshot = { ...raw, reRankingFilter: { ...raw.reRankingFilter } };
    setProductionConfig(snapshot);
    setIsDRRActivated(true);
    setToastMessage(`Control (live) now matches Variation ${target}.`);
  }, []);

  const completeActiveAbTest = useCallback(() => {
    setActiveAbTest((prev) => (prev ? { ...prev, endedAtMs: Date.now() } : null));
    showToast("Test marked as completed.");
  }, [showToast]);

  const applyAbTestVariationToLive = useCallback(
    (variationId: AbTestVariationId) => {
      const markApplied = () =>
        setActiveAbTest((prev) => (prev ? { ...prev, appliedVariationId: variationId } : null));

      switch (variationId) {
        case "control":
          setIsDRRActivated(true);
          showToast("Live ranking already matches Control.");
          markApplied();
          return;
        case "drr-off":
          setIsDRRActivated(false);
          showToast("Live ranking updated: DRR is off.");
          markApplied();
          return;
        case "variant-a": {
          if (!hasVariantA) {
            showToast("Variation A has no saved settings. Open Configure and build Variation A first.");
            return;
          }
          const raw = variantAConfigRef.current;
          setProductionConfig({ ...raw, reRankingFilter: { ...raw.reRankingFilter } });
          setIsDRRActivated(true);
          showToast("Live ranking now uses Variation A settings.");
          markApplied();
          return;
        }
        case "variant-b": {
          if (!hasVariantB) {
            showToast("Variation B has no saved settings. Open Configure and build Variation B first.");
            return;
          }
          const raw = variantBConfigRef.current;
          setProductionConfig({ ...raw, reRankingFilter: { ...raw.reRankingFilter } });
          setIsDRRActivated(true);
          showToast("Live ranking now uses Variation B settings.");
          markApplied();
          return;
        }
        default:
          return;
      }
    },
    [hasVariantA, hasVariantB, showToast],
  );

  const beginAbTestWizard = useCallback(() => {
    setAbTestSelectedVariations([]);
    setAbTestTrafficSplit([]);
    setAbTestDurationDays(14);
  }, []);

  const dismissActiveAbTest = useCallback(() => setActiveAbTest(null), []);

  return (
    <DRRContext.Provider
      value={{
        isFirstTimeUser,
        isDRRActivated,
        productionConfig,
        variantAConfig,
        variantBConfig,
        hasVariantA,
        hasVariantB,
        variantABuildStatus,
        variantBBuildStatus,
        toastMessage,
        comparisonLeftMode,
        comparisonRightMode,
        settingsPreferredBuildTarget,
        setIsFirstTimeUser,
        setIsDRRActivated,
        updateProductionConfig,
        replaceProductionConfig,
        showToast,
        setVariantAConfig,
        setVariantBConfig,
        setComparisonLeftMode,
        setComparisonRightMode,
        startPreviewBuild,
        dismissToast,
        deleteVariantDraft,
        applyVariantToLive,
        setSettingsPreferredBuildTarget,
        abTestSelectedVariations,
        setAbTestSelectedVariations,
        abTestTrafficSplit,
        setAbTestTrafficSplit,
        abTestDurationDays,
        setAbTestDurationDays,
        beginAbTestWizard,
        activeAbTest,
        setActiveAbTest,
        dismissActiveAbTest,
        completeActiveAbTest,
        applyAbTestVariationToLive,
      }}
    >
      {children}
    </DRRContext.Provider>
  );
}

export function useDRR() {
  const ctx = useContext(DRRContext);
  if (!ctx) throw new Error("useDRR must be used within DRRProvider");
  return ctx;
}
