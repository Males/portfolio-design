import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import AbTestCompactStepper, { type AbTestStepIndex } from "./AbTestCompactStepper";

export default function AbTestWizardChrome({
  currentStepIndex,
  children,
}: {
  currentStepIndex: AbTestStepIndex;
  children: ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[640px] p-8" style={{ animation: "fadeSlideIn 0.3s ease-out" }}>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="mb-4 text-sm font-medium text-primary hover:text-primary-hover cursor-pointer"
      >
        Back
      </button>

      <h1 className="text-2xl font-semibold tracking-tight text-ink [font-family:var(--font-family-display)]">
        Create A/B Test
      </h1>

      <div className="mt-8 pb-8">
        <AbTestCompactStepper currentStepIndex={currentStepIndex} />
      </div>

      {children}
    </div>
  );
}
