import { Check, ListChecks, SlidersHorizontal, type LucideIcon } from "lucide-react";

type StepStatus = "complete" | "active" | "upcoming";

/** Satellite 1.0 — Stepper / Horizontal / Compact (Figma node 17012:1724) */
const COLOR_SUCCESS = "#008b4a";
const COLOR_LINE_SUBTLE = "#d6d6e7";

const STEP_A = { id: "variations", label: "Choose variations", Icon: ListChecks };
const STEP_B = { id: "traffic", label: "Traffic & duration", Icon: SlidersHorizontal };

function StepIndicator({
  Icon,
  status,
}: {
  Icon: LucideIcon;
  status: StepStatus;
}) {
  if (status === "complete") {
    return (
      <div
        className="flex items-center justify-center size-5 rounded-full shrink-0"
        style={{ backgroundColor: COLOR_SUCCESS }}
        aria-hidden
      >
        <Check size={12} className="text-white" strokeWidth={2.5} />
      </div>
    );
  }
  if (status === "active") {
    return (
      <div
        className="flex items-center justify-center size-5 rounded-full bg-ink-light shrink-0"
        aria-hidden
      >
        <Icon size={12} className="text-white" strokeWidth={2} />
      </div>
    );
  }
  return (
    <div
      className="flex items-center justify-center size-5 rounded-full bg-bg-sidebar shrink-0"
      aria-hidden
    >
      <Icon size={12} className="text-subdued" strokeWidth={2} />
    </div>
  );
}

function StepLabel({ children, subdued }: { children: string; subdued: boolean }) {
  return (
    <span
      className={`text-xs leading-4 shrink min-w-0 max-w-[11rem] sm:max-w-none truncate ${
        subdued ? "text-subdued" : "text-ink"
      }`}
    >
      {children}
    </span>
  );
}

/**
 * Compact horizontal stepper per Satellite 1.0 components
 * (https://www.figma.com/design/YzDmKplBDkdJ3aeQunEKq8 — Stepper, Horizontal, Compact).
 */
export default function AbTestCompactStepper({ currentStepIndex }: { currentStepIndex: 0 | 1 }) {
  const statusA: StepStatus = currentStepIndex === 0 ? "active" : "complete";
  const statusB: StepStatus = currentStepIndex === 1 ? "active" : "upcoming";
  const lineBeforeBComplete = currentStepIndex >= 1;

  return (
    <div
      className="flex flex-wrap gap-2 items-center justify-center w-full min-w-0"
      aria-label="A/B test steps"
    >
      {/* Step 1 — no leading connector */}
      <div className="flex gap-2 items-center shrink-0 rounded">
        <StepIndicator Icon={STEP_A.Icon} status={statusA} />
        <StepLabel subdued={false}>{STEP_A.label}</StepLabel>
      </div>

      {/* Step 2 — 16px line (Figma) + 8px gap + indicator + label */}
      <div className="flex gap-2 items-center shrink-0">
        <div
          className="h-px w-4 shrink-0"
          style={{
            backgroundColor: lineBeforeBComplete ? COLOR_SUCCESS : COLOR_LINE_SUBTLE,
          }}
          role="presentation"
        />
        <div className="flex gap-2 items-center shrink-0 rounded min-w-0">
          <StepIndicator Icon={STEP_B.Icon} status={statusB} />
          <StepLabel subdued={statusB === "upcoming"}>{STEP_B.label}</StepLabel>
        </div>
      </div>
    </div>
  );
}
