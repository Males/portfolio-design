import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleConfirmModal from "./SimpleConfirmModal";
import { useDRR } from "../context/DRRContext";

type Target = "A" | "B";

export default function PostPreviewActionBar() {
  const navigate = useNavigate();
  const {
    hasVariantA,
    hasVariantB,
    deleteVariantDraft,
    applyVariantToLive,
    setActiveFlow,
    setSettingsPreferredBuildTarget,
  } = useDRR();

  const [target, setTarget] = useState<Target>("A");
  const [showDelete, setShowDelete] = useState(false);
  const [showApplyLive, setShowApplyLive] = useState(false);

  useEffect(() => {
    if (hasVariantA && !hasVariantB) setTarget("A");
    else if (!hasVariantA && hasVariantB) setTarget("B");
  }, [hasVariantA, hasVariantB]);

  const visible = hasVariantA || hasVariantB;
  if (!visible) return null;

  const canPickA = hasVariantA;
  const canPickB = hasVariantB;

  const handleDelete = () => {
    deleteVariantDraft(target);
    setShowDelete(false);
  };

  const handleApplyLive = () => {
    applyVariantToLive(target);
    setShowApplyLive(false);
  };

  const handleTest = () => {
    setActiveFlow("ab");
    navigate("/create-variant");
  };

  const handleEdit = () => {
    setSettingsPreferredBuildTarget(target);
    navigate("/settings");
  };

  const linkBtn =
    "text-sm text-primary hover:underline cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline";

  return (
    <>
      <div className="flex flex-col gap-3 py-1 border-b border-border-subtle pb-4">
        {(canPickA && canPickB) && (
          <div className="flex gap-1 p-0.5 rounded-lg bg-bg-sidebar w-fit">
            <button
              type="button"
              onClick={() => setTarget("A")}
              className={`px-3 py-1 text-xs font-medium rounded-md cursor-pointer ${
                target === "A" ? "bg-bg-surface text-ink shadow-sm" : "text-subdued hover:text-ink"
              }`}
            >
              Variation A
            </button>
            <button
              type="button"
              onClick={() => setTarget("B")}
              className={`px-3 py-1 text-xs font-medium rounded-md cursor-pointer ${
                target === "B" ? "bg-bg-surface text-ink shadow-sm" : "text-subdued hover:text-ink"
              }`}
            >
              Variation B
            </button>
          </div>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            disabled={target === "A" ? !hasVariantA : !hasVariantB}
            className={linkBtn}
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => setShowApplyLive(true)}
            disabled={target === "A" ? !hasVariantA : !hasVariantB}
            className={linkBtn}
          >
            Apply to live
          </button>
          <button type="button" onClick={handleTest} className={linkBtn}>
            Run A/B test
          </button>
          <button type="button" onClick={handleEdit} className={linkBtn}>
            Open Configure
          </button>
        </div>
      </div>

      <SimpleConfirmModal
        open={showDelete}
        title={`Delete Variation ${target}?`}
        message={`This removes the saved preview for Variation ${target}.`}
        confirmLabel="Delete"
        destructive
        onCancel={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />

      <SimpleConfirmModal
        open={showApplyLive}
        title={`Apply Variation ${target} to live?`}
        message="Live ranking will match this variation immediately."
        secondaryMessage="Consider validating with an A/B test first."
        confirmLabel="Apply"
        onCancel={() => setShowApplyLive(false)}
        onConfirm={handleApplyLive}
      />
    </>
  );
}
