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
}: {
  value: ComparisonPaneMode;
  onChange: (v: ComparisonPaneMode) => void;
  compact?: boolean;
  ariaLabel: string;
  showVariantA: boolean;
  showVariantB: boolean;
  alwaysShowVariants?: boolean;
  hideDrrOff?: boolean;
}) {
  const pad = compact ? "px-2 py-1" : "px-2.5 sm:px-3 py-1.5";
  const text = compact ? "text-[11px]" : "text-xs sm:text-sm";

  const allowA = alwaysShowVariants || showVariantA;
  const allowB = alwaysShowVariants || showVariantB;

  const segments = PANE_SEGMENTS.filter((seg) => {
    if (seg.value === "drr-off") return !hideDrrOff;
    if (seg.value === "variant-a") return allowA;
    if (seg.value === "variant-b") return allowB;
    return true;
  });

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex w-fit max-w-full p-0.5 rounded-lg bg-bg-sidebar border border-border-subtle gap-0.5 overflow-x-auto [scrollbar-width:thin]"
    >
      {segments.map((seg) => {
        const selected = value === seg.value;
        return (
          <button
            key={seg.value}
            type="button"
            role="radio"
            aria-checked={selected}
            title={seg.title}
            onClick={() => onChange(seg.value)}
            className={`shrink-0 ${pad} ${text} font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              selected
                ? "bg-bg-surface text-ink shadow-sm ring-1 ring-border-subtle"
                : "text-subdued hover:text-ink hover:bg-bg-surface/60"
            }`}
          >
            {compact ? seg.labelCompact : seg.label}
          </button>
        );
      })}
    </div>
  );
}
