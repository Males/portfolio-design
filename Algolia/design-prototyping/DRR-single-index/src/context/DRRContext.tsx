import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import type { ComparisonPaneMode, DRRSettingsSnapshot } from "../types/drrSettings";

export type { ComparisonPaneMode, DRRSettingsSnapshot };

export type FlowType = "first-time" | "ab" | "abc" | null;
export type TestStatus = "idle" | "running" | "completed";
export type VariantBuildStatus = "idle" | "building" | "ready";

export interface VariantConfig {
  name: string;
  drrEnabled: boolean;
  goal: string;
  eventSourceIndex: string;
  hourlyRefresh: boolean;
  multiSignalRanking: "head-only" | "augmented" | "combined";
  rerankedEmptyQueries: boolean;
  browsingFacetsCount: number;
  eventFreshness: boolean;
  groupSimilarQueries: boolean;
  groupSimilarQueriesLang: string;
  reRankingFilter: { attribute: string; operator: string; value: string };
}

export interface TestConfig {
  name: string;
  controlIndex: string;
  variants: { name: string; config: VariantConfig }[];
  trafficSplit: number[];
  duration: number;
}

export interface TestResult {
  name: string;
  id: string;
  status: TestStatus;
  startDate: string;
  endDate: string;
  splits: { label: string; percentage: number }[];
  variants: {
    label: string;
    type: "control" | "variant";
    trackedSearches: number;
    trackedUsers: number;
    ctr: number;
    cvr: number | string;
  }[];
}

interface DRRState {
  isFirstTimeUser: boolean;
  isDRRActivated: boolean;
  activeFlow: FlowType;
  testStatus: TestStatus;
  testConfig: TestConfig;
  testResult: TestResult | null;
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
  setActiveFlow: (f: FlowType) => void;
  setTestStatus: (s: TestStatus) => void;
  setTestConfig: (c: TestConfig) => void;
  startTest: () => void;
  resetFlow: () => void;
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
}

const defaultVariant: VariantConfig = {
  name: "",
  drrEnabled: true,
  goal: "Conversion rate",
  eventSourceIndex: "Adam_Test_2000",
  hourlyRefresh: true,
  multiSignalRanking: "head-only",
  rerankedEmptyQueries: true,
  browsingFacetsCount: 20,
  eventFreshness: true,
  groupSimilarQueries: true,
  groupSimilarQueriesLang: "English",
  reRankingFilter: { attribute: "", operator: "is", value: "" },
};

const defaultTestConfig: TestConfig = {
  name: "",
  controlIndex: "Adam_test_2000",
  variants: [{ name: "Variant_B", config: { ...defaultVariant } }],
  trafficSplit: [50, 50],
  duration: 30,
};

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
  const [activeFlow, setActiveFlow] = useState<FlowType>(null);
  const [testStatus, setTestStatus] = useState<TestStatus>("idle");
  const [testConfig, setTestConfig] = useState<TestConfig>({ ...defaultTestConfig });
  const [testResult, setTestResult] = useState<TestResult | null>(null);
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

  const productionConfigRef = useRef(productionConfig);
  productionConfigRef.current = productionConfig;
  const variantAConfigRef = useRef(variantAConfig);
  variantAConfigRef.current = variantAConfig;
  const variantBConfigRef = useRef(variantBConfig);
  variantBConfigRef.current = variantBConfig;

  const startTest = () => {
    setTestStatus("completed");
    const splits = [
      { label: "A", percentage: testConfig.trafficSplit[0] },
      ...testConfig.variants.map((_v, i) => ({
        label: String.fromCharCode(66 + i),
        percentage: testConfig.trafficSplit[i + 1],
      })),
    ];
    const variants: TestResult["variants"] = [
      { label: "Control", type: "control" as const, trackedSearches: 139998, trackedUsers: 139998, ctr: 29.3, cvr: "Baseline" },
      ...testConfig.variants.map((v, i) => ({
        label: v.name || `Variant ${String.fromCharCode(66 + i)}`,
        type: "variant" as const,
        trackedSearches: 138287 - i * 1000,
        trackedUsers: 138287 - i * 1000,
        ctr: 29.0 - i * 0.2,
        cvr: -(0.98 + i * 0.5) as number | string,
      })),
    ];
    setTestResult({
      name: testConfig.name || "Test name goes here",
      id: `#${12345 + Math.floor(Math.random() * 1000)}`,
      status: "completed",
      startDate: "15 March 2026",
      endDate: "29 March 2026",
      splits,
      variants,
    });
    setActiveFlow(null);
  };

  const resetFlow = () => {
    setActiveFlow(null);
    setTestConfig({ ...defaultTestConfig, variants: [{ name: "Variant_B", config: { ...defaultVariant } }] });
  };

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
    const snapshot = {
      ...(target === "A" ? variantAConfigRef.current : variantBConfigRef.current),
    };
    setProductionConfig(snapshot);
    setToastMessage(`Control (live) now matches Variation ${target}.`);
  }, []);

  return (
    <DRRContext.Provider
      value={{
        isFirstTimeUser,
        isDRRActivated,
        activeFlow,
        testStatus,
        testConfig,
        testResult,
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
        setActiveFlow,
        setTestStatus,
        setTestConfig,
        startTest,
        resetFlow,
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

export { defaultVariant };
