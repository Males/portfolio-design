import { useEffect } from "react";
import { X } from "lucide-react";
import { useDRR } from "../context/DRRContext";

export default function ToastHost() {
  const { toastMessage, dismissToast } = useDRR();

  useEffect(() => {
    if (!toastMessage) return;
    const t = window.setTimeout(() => dismissToast(), 6000);
    return () => window.clearTimeout(t);
  }, [toastMessage, dismissToast]);

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-4 py-3 rounded-lg bg-ink text-white text-sm shadow-lg max-w-md">
      <span className="flex-1">{toastMessage}</span>
      <button
        type="button"
        onClick={dismissToast}
        className="shrink-0 p-1 rounded hover:bg-white/10 cursor-pointer"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}
