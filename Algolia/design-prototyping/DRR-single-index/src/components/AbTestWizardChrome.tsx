import type { ReactNode } from "react";
import AbTestCompactStepper from "./AbTestCompactStepper";

export default function AbTestWizardChrome({
  currentStepIndex,
  subtitle,
  children,
}: {
  currentStepIndex: 0 | 1;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="p-8 max-w-[720px]" style={{ animation: "fadeSlideIn 0.3s ease-out" }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink tracking-tight [font-family:var(--font-family-display)]">
          Create A/B test
        </h1>
        <p className="text-sm text-subdued mt-1 leading-5 max-w-md">{subtitle}</p>
      </div>

      <div className="mb-10 pb-6 border-b border-border-subtler">
        <AbTestCompactStepper currentStepIndex={currentStepIndex} />
      </div>

      {children}
    </div>
  );
}
