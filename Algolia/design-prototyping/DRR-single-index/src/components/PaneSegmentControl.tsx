import type { ComparisonPaneMode } from "../types/drrSettings";

const PANE_SEGMENTS: {
  value: ComparisonPaneMode;
  label: string;
  labelCompact: string;
  title: string;
}[] = [
  {
    value: "drr-off",
    label: "DRR off",
    labelCompact: "DRR off",
    title: "Dynamic re-ranking off — static relevance",
  },
  { value: "control", label: "Control", labelCompact: "Control", title: "Live Control ranking" },
  { value: "variant-a", label: "Variation A", labelCompact: "Var A", title: "Variation A" },
  { value: "variant-b", label: "Variation B", labelCompact: "Var B", title: "Variation B" },
];

export default function PaneSegmentControl({
  value,
  onChange,
  compact,
  ariaLabel,
  showVariantA,
  showVariantB,
  /** Configure page: always show A/B tabs even before a preview exists. */
  alwaysShowVariants,
  /** Configure page: hide DRR off (no DRR settings to edit). */
  hideDrrOff,
  /** Match design-system segmented control (Figma): track fill, 4px radius, raised selected segment. */
  visualVariant = "default",
  /** Stretch segments to fill the row (configure columns). */
  fullWidth,
  /** Override labels for variant-a / variant-b (Configure: "Draft 1" / "Draft 2"). */
  variantSlotLabels,
}: {
  value: ComparisonPaneMode;
  onChange: (v: ComparisonPaneMode) => void;
  compact?: boolean;
  ariaLabel: string;
  showVariantA: boolean;
  showVariantB: boolean;
  alwaysShowVariants?: boolean;
  hideDrrOff?: boolean;
  visualVariant?: "default" | "ds";
  fullWidth?: boolean;
  variantSlotLabels?: { a: string; b: string };
}) {
  const padDefault = compact ? "px-2 py-1" : "px-2.5 sm:px-3 py-1.5";
  const padDs = "px-3 py-0 h-8";
  const pad = visualVariant === "ds" ? padDs : padDefault;
  const textDefault = compact ? "text-[11px]" : "text-xs sm:text-sm";
  const textDs = "text-sm font-normal";
  const text = visualVariant === "ds" ? textDs : textDefault;

  const allowA = alwaysShowVariants || showVariantA;
  const allowB = alwaysShowVariants || showVariantB;

  const segments = PANE_SEGMENTS.filter((seg) => {
    if (seg.value === "drr-off") return !hideDrrOff;
    if (seg.value === "variant-a") return allowA;
    if (seg.value === "variant-b") return allowB;
    return true;
  });

  const labelFor = (seg: (typeof PANE_SEGMENTS)[0]) => {
    if (seg.value === "variant-a" && variantSlotLabels) return variantSlotLabels.a;
    if (seg.value === "variant-b" && variantSlotLabels) return variantSlotLabels.b;
    return compact ? seg.labelCompact : seg.label;
  };

  const titleFor = (seg: (typeof PANE_SEGMENTS)[0]) => {
    if (seg.value === "variant-a" && variantSlotLabels) {
      return `${variantSlotLabels.a} — alternative ranking configuration`;
    }
    if (seg.value === "variant-b" && variantSlotLabels) {
      return `${variantSlotLabels.b} — alternative ranking configuration`;
    }
    return seg.title;
  };

  const outer =
    visualVariant === "ds"
      ? `rounded p-1 gap-1 bg-bg-sidebar ${fullWidth ? "w-full flex" : "inline-flex max-w-full"} border-0`
      : `inline-flex w-fit max-w-full p-0.5 rounded-lg bg-bg-sidebar border border-border-subtle gap-0.5 overflow-x-auto [scrollbar-width:thin]`;

  return (
    <div role="radiogroup" aria-label={ariaLabel} className={outer}>
      {segments.map((seg) => {
        const selected = value === seg.value;
        const selectedClass =
          visualVariant === "ds"
            ? selected
              ? "bg-gradient-to-b from-white to-bg-default text-ink border border-border-segment shadow-sm"
              : "text-subdued hover:text-ink border border-transparent bg-transparent"
            : selected
              ? "bg-bg-surface text-ink shadow-sm ring-1 ring-border-subtle"
              : "text-subdued hover:text-ink hover:bg-bg-surface/60";

        return (
          <button
            key={seg.value}
            type="button"
            role="radio"
            aria-checked={selected}
            title={titleFor(seg)}
            onClick={() => onChange(seg.value)}
            className={`shrink-0 flex items-center justify-center rounded ${pad} ${text} transition-colors cursor-pointer whitespace-nowrap ${selectedClass} ${
              visualVariant === "ds" && fullWidth ? "flex-1 min-w-0" : ""
            }`}
          >
            {labelFor(seg)}
          </button>
        );
      })}
    </div>
  );
}
