import { X } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  secondaryMessage?: string;
  onCancel: () => void;
  onCreateTest: () => void;
  onSave: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  secondaryMessage,
  onCancel,
  onCreateTest,
  onSave,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        style={{ animation: "fadeIn 0.15s ease-out" }}
        onClick={onCancel}
      />
      <div
        className="relative bg-white rounded-xl shadow-xl max-w-[480px] w-full mx-4 p-6"
        style={{ animation: "scaleIn 0.2s ease-out" }}
      >
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <button onClick={onCancel} className="text-subdued hover:text-ink cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-ink leading-relaxed mb-2">{message}</p>
        {secondaryMessage && (
          <p className="text-sm text-ink leading-relaxed mb-6">{secondaryMessage}</p>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-ink border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onCreateTest}
              className="px-4 py-2 text-sm font-medium text-ink border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
            >
              Create A/B test
            </button>
            <button
              onClick={onSave}
              className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover cursor-pointer"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
