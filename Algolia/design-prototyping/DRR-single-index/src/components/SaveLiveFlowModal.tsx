import { X } from "lucide-react";

interface SaveLiveFlowModalProps {
  open: boolean;
  onCancel: () => void;
  onPreviewInComparison: () => void;
  onSaveLive: () => void;
}

export default function SaveLiveFlowModal({
  open,
  onCancel,
  onPreviewInComparison,
  onSaveLive,
}: SaveLiveFlowModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30"
        style={{ animation: "fadeIn 0.15s ease-out" }}
        onClick={onCancel}
      />
      <div
        className="relative bg-white rounded-xl shadow-xl max-w-[480px] w-full p-6"
        style={{ animation: "scaleIn 0.2s ease-out" }}
      >
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink pr-4">Publish Control to live ranking?</h2>
          <button type="button" onClick={onCancel} className="text-subdued hover:text-ink cursor-pointer shrink-0">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-ink leading-relaxed mb-6">
          You have unsaved edits in the <span className="font-medium">Control</span> column. Publishing replaces the
          current live configuration for everyone. Open Explore first if you want to compare rankings side by side.
        </p>

        <div className="flex flex-col-reverse sm:flex-row sm:flex-wrap sm:justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-medium text-ink border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onPreviewInComparison}
            className="px-4 py-2.5 text-sm font-medium text-ink border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
          >
            Open Explore
          </button>
          <button
            type="button"
            onClick={onSaveLive}
            className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover cursor-pointer"
          >
            Publish to live
          </button>
        </div>
      </div>
    </div>
  );
}
