import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Check, X } from "lucide-react";
import { useDRR, defaultVariant } from "../context/DRRContext";
import RangeSlider from "../components/RangeSlider";

export default function SetParametersPage() {
  const navigate = useNavigate();
  const { activeFlow, testConfig, setTestConfig, setActiveFlow, startTest } = useDRR();

  const isFirstTime = activeFlow === "first-time";
  const isABC = activeFlow === "abc";
  const totalSteps = isFirstTime ? 3 : isABC ? 2 : 3;
  const currentStep = totalSteps;

  const variantCount = testConfig.variants.length;

  const [localName, setLocalName] = useState(testConfig.name);
  const [localDuration, setLocalDuration] = useState(testConfig.duration);
  const [localSplits, setLocalSplits] = useState<number[]>(testConfig.trafficSplit);
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);
  const [editingVariantName, setEditingVariantName] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingVariantIndex !== null) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [editingVariantIndex]);

  const startEditingVariant = (index: number) => {
    setEditingVariantName(testConfig.variants[index].name);
    setEditingVariantIndex(index);
  };

  const confirmEditVariant = () => {
    if (editingVariantIndex === null) return;
    const trimmed = editingVariantName.trim();
    if (trimmed) {
      const newVariants = [...testConfig.variants];
      newVariants[editingVariantIndex] = {
        ...newVariants[editingVariantIndex],
        name: trimmed,
        config: { ...newVariants[editingVariantIndex].config, name: trimmed },
      };
      setTestConfig({ ...testConfig, variants: newVariants });
    }
    setEditingVariantIndex(null);
  };

  const cancelEditVariant = () => {
    setEditingVariantIndex(null);
  };


  const handleAddVariant = () => {
    const newVariants = [
      ...testConfig.variants,
      { name: "Variant_C", config: { ...defaultVariant, name: "Variant_C" } },
    ];
    const evenSplit = Math.floor(100 / (newVariants.length + 1));
    const remainder = 100 - evenSplit * (newVariants.length + 1);
    const splits = Array(newVariants.length + 1).fill(evenSplit);
    splits[0] += remainder;
    setLocalSplits(splits);
    setTestConfig({ ...testConfig, variants: newVariants, trafficSplit: splits });
    setActiveFlow("abc");
    navigate("/create-variant");
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = testConfig.variants.filter((_, i) => i !== index);
    const evenSplit = Math.floor(100 / (newVariants.length + 1));
    const remainder = 100 - evenSplit * (newVariants.length + 1);
    const splits = Array(newVariants.length + 1).fill(evenSplit);
    splits[0] += remainder;
    setLocalSplits(splits);
    setTestConfig({ ...testConfig, variants: newVariants, trafficSplit: splits });
    if (newVariants.length <= 1) {
      setActiveFlow(isFirstTime ? "first-time" : "ab");
    }
  };

  const handleStart = () => {
    setTestConfig({
      ...testConfig,
      name: localName,
      duration: localDuration,
      trafficSplit: localSplits,
    });
    startTest();
    navigate("/test-running");
  };

  return (
    <div className="p-8" style={{ animation: "fadeSlideIn 0.3s ease-out" }}>
      <button
        onClick={() => navigate("/preview-variant")}
        className="flex items-center gap-2 text-sm text-primary hover:underline mb-4 cursor-pointer"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-ink leading-tight">
          Set test parameters
          <span className="text-subdued ml-2">
            - Step {currentStep} of {totalSteps}
          </span>
        </h1>
        <p className="text-sm text-subdued mt-1">
          Set traffic allocation and duration, then start the test.
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-[540px]">
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-ink">Test name</label>
              <input
                type="text"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                placeholder="e.g. DRR on, Conversion goal"
                className="w-full px-3 py-2.5 text-sm text-ink bg-bg-surface border border-border-subtle rounded-lg placeholder:text-subdued/60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-ink">Control</label>
              <div className="px-3 py-2.5 text-sm text-ink bg-bg-sidebar rounded-lg">
                {testConfig.controlIndex}
              </div>
            </div>

            {testConfig.variants.map((variant, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-ink">
                  Variant {String.fromCharCode(66 + i)}
                </label>
                <div className="flex items-center gap-2">
                  {editingVariantIndex === i ? (
                    <>
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editingVariantName}
                        onChange={(e) => setEditingVariantName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") confirmEditVariant();
                          if (e.key === "Escape") cancelEditVariant();
                        }}
                        className="flex-1 px-3 py-2.5 text-sm text-ink bg-bg-surface border border-primary rounded-lg outline-none"
                      />
                      <button
                        onClick={confirmEditVariant}
                        className="w-9 h-9 flex items-center justify-center border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
                      >
                        <Check size={14} className="text-green-600" />
                      </button>
                      <button
                        onClick={cancelEditVariant}
                        className="w-9 h-9 flex items-center justify-center border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
                      >
                        <X size={14} className="text-subdued" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 px-3 py-2.5 text-sm text-ink bg-bg-sidebar rounded-lg">
                        {variant.name || `Variant_B`}
                      </div>
                      <button
                        onClick={() => startEditingVariant(i)}
                        className="w-9 h-9 flex items-center justify-center border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
                      >
                        <Pencil size={14} className="text-subdued" />
                      </button>
                      {variantCount > 1 && (
                        <button
                          onClick={() => handleRemoveVariant(i)}
                          className="w-9 h-9 flex items-center justify-center border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
                        >
                          <Trash2 size={14} className="text-subdued" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}

            {variantCount < 2 && (
              <button
                onClick={handleAddVariant}
                className="w-fit px-4 py-2 text-sm text-ink border border-dashed border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
              >
                + Add another variant
              </button>
            )}
          </div>
        </div>

        <div className="bg-bg-surface border border-border-subtle rounded-xl p-6">
          <h3 className="text-sm font-semibold text-ink mb-4">Traffic percentage</h3>

          <RangeSlider
            value={localSplits[0]}
            min={1}
            max={99}
            onChange={(controlPct) => {
              const variantCount = localSplits.length - 1;
              const remainder = 100 - controlPct;
              const each = Math.floor(remainder / variantCount);
              const extra = remainder - each * variantCount;
              const newSplits = [controlPct];
              for (let v = 0; v < variantCount; v++) {
                newSplits.push(each + (v < extra ? 1 : 0));
              }
              setLocalSplits(newSplits);
            }}
          />

          <div className="flex items-center justify-between mt-4">
            {localSplits.map((split, i) => {
              const labels = [
                "Control",
                ...testConfig.variants.map((_, vi) => `Variant ${String.fromCharCode(66 + vi)}`),
              ];
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={split}
                      onChange={(e) => {
                        const val = Math.min(99, Math.max(1, Number(e.target.value)));
                        const newSplits = [...localSplits];
                        newSplits[i] = val;
                        const otherTotal = 100 - val;
                        const otherCount = newSplits.length - 1;
                        const otherEach = Math.floor(otherTotal / otherCount);
                        const otherRemainder = otherTotal - otherEach * otherCount;
                        let rIdx = 0;
                        for (let j = 0; j < newSplits.length; j++) {
                          if (j !== i) {
                            newSplits[j] = otherEach + (rIdx < otherRemainder ? 1 : 0);
                            rIdx++;
                          }
                        }
                        setLocalSplits(newSplits);
                      }}
                      className="w-14 px-2 py-1 text-sm text-center text-ink border border-border-subtle rounded-lg"
                    />
                    <span className="text-sm text-ink">%</span>
                  </div>
                  <span className="text-xs text-subdued">{labels[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-bg-surface border border-border-subtle rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink">Duration</h3>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={localDuration}
                onChange={(e) => setLocalDuration(Math.min(90, Math.max(7, Number(e.target.value))))}
                className="w-14 px-2 py-1 text-sm text-center text-ink border border-border-subtle rounded-lg"
              />
              <span className="text-sm text-ink">Days</span>
            </div>
          </div>

          <RangeSlider
            value={localDuration}
            min={7}
            max={90}
            onChange={setLocalDuration}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pb-8">
          <button
            onClick={() => navigate("/preview-variant")}
            className="px-4 py-2.5 text-sm font-medium text-ink border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={handleStart}
            className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover cursor-pointer"
          >
            Start test
          </button>
        </div>
      </div>
    </div>
  );
}
