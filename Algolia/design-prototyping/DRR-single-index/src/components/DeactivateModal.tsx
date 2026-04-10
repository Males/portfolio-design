import { X } from "lucide-react";

interface DeactivateModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeactivateModal({ open, onCancel, onConfirm }: DeactivateModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        style={{ animation: "fadeIn 0.15s ease-out" }}
        onClick={onCancel}
      />
      <div
        className="relative bg-white rounded-xl shadow-xl max-w-[440px] w-full mx-4 p-6"
        style={{ animation: "scaleIn 0.2s ease-out" }}
      >
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink">Deactivate dynamic re-ranking?</h2>
          <button type="button" onClick={onCancel} className="text-subdued hover:text-ink cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-ink leading-relaxed mb-6">
          Search will fall back to static relevance. You can turn dynamic re-ranking back on anytime from this page.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-ink border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 cursor-pointer"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}
