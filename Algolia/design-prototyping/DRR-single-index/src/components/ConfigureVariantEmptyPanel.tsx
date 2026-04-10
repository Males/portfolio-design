import { Loader2 } from "lucide-react";

interface ConfigureVariantEmptyPanelProps {
  slot: "A" | "B";
  onCreatePreview: () => void;
  building: boolean;
  disabled?: boolean;
}

export default function ConfigureVariantEmptyPanel({
  slot,
  onCreatePreview,
  building,
  disabled,
}: ConfigureVariantEmptyPanelProps) {
  if (building) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 min-h-[280px] rounded-xl border border-dashed border-border-subtle bg-bg-sidebar/40 px-6 py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        <p className="text-sm font-medium text-ink text-center">Building Variation {slot}…</p>
        <p className="text-xs text-subdued text-center max-w-sm">
          This copies your current Control draft into the preview slot. You can compare it on Explore when the build
          finishes.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 min-h-[280px] rounded-xl border border-dashed border-border-subtle bg-bg-surface px-6 py-8">
      <h3 className="text-base font-semibold text-ink">Create a new variation?</h3>
      <p className="text-sm text-subdued leading-relaxed">
        Preview variations let you try different DRR settings without changing live Control. We copy your{" "}
        <span className="text-ink font-medium">Control</span> draft into this slot, then you can open{" "}
        <span className="text-ink font-medium">Explore</span> to compare ranking output against Control, DRR off, or
        other variations.
      </p>
      <button
        type="button"
        onClick={onCreatePreview}
        disabled={disabled}
        className="self-start px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Create preview variation {slot}
      </button>
    </div>
  );
}
