import { X } from "lucide-react";

interface SimpleConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  secondaryMessage?: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  destructive?: boolean;
}

export default function SimpleConfirmModal({
  open,
  title,
  message,
  secondaryMessage,
  confirmLabel,
  onCancel,
  onConfirm,
  destructive,
}: SimpleConfirmModalProps) {
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
          <button type="button" onClick={onCancel} className="text-subdued hover:text-ink cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <p className={`text-sm text-ink leading-relaxed ${secondaryMessage ? "mb-2" : "mb-6"}`}>{message}</p>
        {secondaryMessage && (
          <p className="text-sm text-subdued leading-relaxed mb-6">{secondaryMessage}</p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
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
            className={`px-5 py-2 text-sm font-medium text-white rounded-lg cursor-pointer ${
              destructive ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary-hover"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
