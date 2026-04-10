import { Search } from "lucide-react";

interface ComparisonQueryToolbarProps {
  /** Merged onto the root; use for spacing when embedded in a section. */
  className?: string;
}

/**
 * Search + actions (Figma DRR-single-index Preview: "Preview a query" section).
 */
export default function ComparisonQueryToolbar({ className = "" }: ComparisonQueryToolbarProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 min-w-0 ${className}`.trim()}
    >
      <div className="w-full sm:flex-1 sm:max-w-[627px] min-w-0">
        <label className="sr-only" htmlFor="drr-query-search">
          Search query
        </label>
        <div className="flex h-10 items-center gap-2 px-4 rounded border border-[#777AAF] bg-bg-surface shadow-sm">
          <Search size={16} className="text-subdued shrink-0" aria-hidden />
          <input
            id="drr-query-search"
            type="search"
            name="drr-query"
            placeholder="Search for a query to compare"
            className="flex-1 min-w-0 text-sm text-ink placeholder:text-subdued bg-transparent border-0 outline-none focus:ring-0"
            autoComplete="off"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-[11px] shrink-0">
        <button
          type="button"
          className="h-10 px-3 text-sm font-medium text-ink bg-bg-surface border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
        >
          Add query parameter
        </button>
        <button
          type="button"
          className="h-10 px-3 text-sm font-medium text-ink bg-bg-surface border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer"
        >
          Display preferences
        </button>
      </div>
    </div>
  );
}
