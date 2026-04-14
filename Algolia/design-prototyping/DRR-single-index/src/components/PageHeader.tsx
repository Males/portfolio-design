import { Sparkles, Clock, CircleOff } from "lucide-react";
import { useDRR } from "../context/DRRContext";

interface PageHeaderProps {
  onActivate?: () => void;
  onDeactivate?: () => void;
  onCreateTest?: () => void;
}

export default function PageHeader({
  onActivate = () => {},
  onDeactivate = () => {},
  onCreateTest,
}: PageHeaderProps) {
  const { isDRRActivated } = useDRR();
  const showActivate = !isDRRActivated;

  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-semibold text-ink leading-8 [font-family:var(--font-family-display)]">
          Dynamic re-ranking
        </h1>
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="flex items-center gap-1 text-primary">
            <Sparkles size={12} strokeWidth={2} />
            197 queries re-ranked — 0 browsing facets re-ranked
          </span>
          <span className="text-subdued">•</span>
          <span className="flex items-center gap-1 text-subdued">
            <Clock size={12} strokeWidth={2} />
            Last update: March 12th, at 01:44
          </span>
          {isDRRActivated ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 min-h-[20px] rounded-full border border-success-border bg-success-bg text-success-ink text-xs font-medium leading-none">
              <Sparkles size={12} strokeWidth={2} className="shrink-0 text-success-ink" aria-hidden />
              Activated
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 min-h-[20px] rounded-full bg-bg-sidebar text-subdued border border-border-subtle text-xs font-medium leading-none">
              <CircleOff size={12} strokeWidth={2} className="shrink-0" aria-hidden />
              Deactivated
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {showActivate ? (
          <button
            type="button"
            onClick={onActivate}
            className="h-10 px-3 text-sm font-normal text-ink bg-bg-surface border border-border-subtle rounded hover:bg-bg-sidebar cursor-pointer"
          >
            Activate re-ranking
          </button>
        ) : (
          <button
            type="button"
            onClick={onDeactivate}
            className="h-10 px-3 text-sm font-normal text-ink bg-bg-surface border border-border-subtle rounded hover:bg-bg-sidebar cursor-pointer"
          >
            Deactivate
          </button>
        )}
        {onCreateTest && (
          <button
            type="button"
            onClick={onCreateTest}
            className="h-10 px-3 text-sm font-normal text-ink bg-bg-surface border border-border-subtle rounded hover:bg-bg-sidebar cursor-pointer"
          >
            Create A/B test
          </button>
        )}
      </div>
    </div>
  );
}
