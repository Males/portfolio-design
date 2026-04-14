import { Check } from "lucide-react";

const STEPS = ["Build test", "Configure", "Review"] as const;

export type AbTestStepIndex = 0 | 1 | 2;

function statusFor(step: number, current: AbTestStepIndex): "complete" | "active" | "upcoming" {
  if (step < current) return "complete";
  if (step === current) return "active";
  return "upcoming";
}

/** Three-step horizontal stepper (DRR-only prototype — no separate test-type step). */
export default function AbTestCompactStepper({ currentStepIndex }: { currentStepIndex: AbTestStepIndex }) {
  return (
    <nav className="w-full" aria-label="A/B test steps">
      <ol className="flex flex-wrap items-center gap-1 sm:gap-0 sm:justify-between">
        {STEPS.map((label, i) => {
          const st = statusFor(i, currentStepIndex);
          const isLast = i === STEPS.length - 1;
          return (
            <li key={label} className="flex min-w-0 flex-1 items-center gap-2 last:flex-none">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={[
                    "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold leading-none",
                    st === "complete" && "bg-primary text-white",
                    st === "active" && "bg-primary text-white ring-4 ring-primary/15",
                    st === "upcoming" && "border border-border-subtle bg-bg-sidebar text-subdued",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={st === "active" ? "step" : undefined}
                >
                  {st === "complete" ? <Check size={16} strokeWidth={2.5} className="text-white" /> : i + 1}
                </span>
                <span
                  className={`min-w-0 truncate text-sm font-medium leading-5 ${
                    st === "upcoming" ? "text-subdued" : "text-ink"
                  }`}
                >
                  {label}
                </span>
              </div>
              {!isLast ? (
                <div
                  className={`mx-1 hidden h-px min-w-[12px] flex-1 sm:block ${
                    i < currentStepIndex ? "bg-primary" : "bg-border-subtle"
                  }`}
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
