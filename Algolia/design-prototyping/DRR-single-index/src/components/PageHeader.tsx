import { Sparkles, Clock } from "lucide-react";
import { useDRR } from "../context/DRRContext";

interface PageHeaderProps {
  onActivate?: () => void;
  onDeactivate?: () => void;
  onCreateTest?: () => void;
}

export default function PageHeader({
  onActivate = () => {},
  onDeactivate = () => {},
  onCreateTest = () => {},
}: PageHeaderProps) {
  const { isFirstTimeUser, isDRRActivated, testStatus } = useDRR();
  const hasRunningTest = testStatus === "running";
  const showActivate = isFirstTimeUser || !isDRRActivated;

  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-semibold text-ink leading-tight">Dynamic re-ranking</h1>
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <span className="flex items-center gap-1 text-primary">
            <Sparkles size={12} />
            197 queries re-ranked — 0 browsing facets re-ranked
          </span>
          <span className="text-subdued">•</span>
          <span className="flex items-center gap-1 text-subdued">
            <Clock size={12} />
            Last update: March 12th, at 01:44
          </span>
          {isDRRActivated ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
              <Sparkles size={10} />
              Activated
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600">
              Deactivated
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {showActivate ? (
          <button
            type="button"
            onClick={onActivate}
            className="px-4 py-2 text-sm font-medium text-ink border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
          >
            Activate re-ranking
          </button>
        ) : (
          <button
            type="button"
            onClick={onDeactivate}
            className="px-4 py-2 text-sm font-medium text-ink border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
          >
            Deactivate
          </button>
        )}
        <button
          onClick={onCreateTest}
          disabled={hasRunningTest}
          className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer ${
            hasRunningTest
              ? "bg-primary/50 text-white/70 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary-hover"
          }`}
        >
          Create A/B test
        </button>
      </div>
    </div>
  );
}
