import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ComparisonView from "../components/ComparisonView";
import { useDRR } from "../context/DRRContext";

export default function PreviewVariantPage() {
  const navigate = useNavigate();
  const { activeFlow } = useDRR();

  const isABC = activeFlow === "abc";
  const isFirstTime = activeFlow === "first-time";
  const totalSteps = isFirstTime ? 3 : isABC ? 3 : 3;
  const currentStep = 2;

  return (
    <div className="p-8" style={{ animation: "fadeSlideIn 0.3s ease-out" }}>
      <button
        onClick={() => navigate("/create-variant")}
        className="flex items-center gap-2 text-sm text-primary hover:underline mb-4 cursor-pointer"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-ink leading-tight">
          Preview variation
          <span className="text-subdued ml-2">
            - Step {currentStep} of {totalSteps}
          </span>
        </h1>
        <p className="text-sm text-subdued mt-1 max-w-[640px]">
          Check how this variation changes results for your key queries and category pages, nothing goes live yet.
          Use a few high traffic queries and top category pages to spot obvious issues
        </p>
      </div>

      <ComparisonView />

      <div className="flex items-center justify-end gap-3 mt-8 pb-8">
        <button
          onClick={() => navigate("/create-variant")}
          className="px-4 py-2.5 text-sm font-medium text-ink border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={() => navigate("/set-parameters")}
          className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover cursor-pointer"
        >
          Set parameters
        </button>
      </div>
    </div>
  );
}
