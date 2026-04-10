import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import VariantForm from "../components/VariantForm";
import { useDRR, defaultVariant } from "../context/DRRContext";

export default function CreateVariantPage() {
  const navigate = useNavigate();
  const { activeFlow, testConfig, setTestConfig } = useDRR();

  const isFirstTime = activeFlow === "first-time";
  const isABC = activeFlow === "abc";

  const variantIndex = isABC ? testConfig.variants.length - 1 : 0;
  const totalSteps = isFirstTime ? 3 : isABC ? 3 : 2;
  const currentStep = 1;

  const title = isABC
    ? "Create a second test variation"
    : "Create test variation";
  const subtitle =
    "Name each variation, then choose which settings are different from production. Nothing goes live yet.";

  const handleChange = (config: typeof defaultVariant) => {
    const newVariants = [...testConfig.variants];
    newVariants[variantIndex] = { ...newVariants[variantIndex], config };
    setTestConfig({ ...testConfig, variants: newVariants });
  };

  const handlePreview = () => {
    navigate("/preview-variant");
  };

  return (
    <div className="p-8" style={{ animation: "fadeSlideIn 0.3s ease-out" }}>
      <button
        onClick={() => {
          navigate("/");
        }}
        className="flex items-center gap-2 text-sm text-primary hover:underline mb-4 cursor-pointer"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-ink leading-tight">
          {title}
          <span className="text-subdued ml-2">
            - Step {currentStep} of {totalSteps}
          </span>
        </h1>
        <p className="text-sm text-subdued mt-1">{subtitle}</p>
      </div>

      <VariantForm
        config={testConfig.variants[variantIndex]?.config ?? defaultVariant}
        onChange={handleChange}
        showGuidance={isFirstTime}
      />

      <div className="flex items-center justify-end gap-3 mt-6 pb-8 max-w-[540px]">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2.5 text-sm font-medium text-ink border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handlePreview}
          className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover cursor-pointer"
        >
          Preview variant
        </button>
      </div>
    </div>
  );
}
