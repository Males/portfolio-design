import { useId, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

function RulesIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className={className} aria-hidden>
      <rect x="1" y="1" width="2" height="10" rx="0.5" />
      <rect x="5" y="3" width="2" height="8" rx="0.5" />
      <rect x="9" y="5" width="2" height="6" rx="0.5" />
    </svg>
  );
}

function AIIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className} aria-hidden>
      <path
        d="M6 1l-.5 1.5a1 1 0 0 1-.6.6L3.5 3.5l1.4.5a1 1 0 0 1 .6.6L6 6l.5-1.4a1 1 0 0 1 .6-.6l1.4-.5-1.4-.5a1 1 0 0 1-.6-.6L6 1Z"
        fill="currentColor"
      />
      <path
        d="M9 5.5l-.3.9a.6.6 0 0 1-.35.35L7.5 7l.85.3a.6.6 0 0 1 .35.35l.3.85.3-.85a.6.6 0 0 1 .35-.35L10.5 7l-.85-.3a.6.6 0 0 1-.35-.35L9 5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FactorChip({
  pressed,
  onPressedChange,
  icon,
  label,
  title,
  tone,
}: {
  pressed: boolean;
  onPressedChange: (value: boolean) => void;
  icon: ReactNode;
  label: string;
  title: string;
  tone: "ai" | "rules";
}) {
  const toneStyles = {
    ai: pressed
      ? "bg-pink-100 border-pink-600 text-[#9D174D]"
      : "bg-pink-50/80 border-pink-200 text-pink-900/45 hover:text-pink-900/80 hover:border-pink-300",
    rules: pressed
      ? "bg-[#EEF4FF] border-[#7C8AFF] text-[#2B3CBB]"
      : "bg-bg-sidebar/80 border-border-subtle text-subdued hover:text-[#2B3CBB] hover:border-[#7C8AFF]/50",
  };

  const dividerClass = pressed
    ? tone === "ai"
      ? "bg-pink-600/35"
      : "bg-[#7C8AFF]/50"
    : "bg-border-subtle";

  return (
    <button
      type="button"
      aria-pressed={pressed}
      title={title}
      onClick={() => onPressedChange(!pressed)}
      className={`inline-flex items-center border rounded-full cursor-pointer transition-colors text-xs font-medium ${toneStyles[tone]}`}
    >
      <span className="flex items-center gap-1.5 pl-2 pr-1 py-0.5 min-h-[20px]">
        <span className="shrink-0 opacity-90">{icon}</span>
        <span className="whitespace-nowrap">{label}</span>
      </span>
      <span className={`w-px self-stretch min-h-[14px] my-0.5 ${dividerClass}`} />
      <span className="flex items-center px-1.5 py-0.5 shrink-0 opacity-90">
        {pressed ? <Eye size={14} strokeWidth={1.75} /> : <EyeOff size={14} strokeWidth={1.75} />}
      </span>
    </button>
  );
}

export interface RankingFilters {
  showRules: boolean;
  showAI: boolean;
}

interface RankingBadgesProps {
  variant: "control" | "variant";
  filters: RankingFilters;
  onFilterChange: (key: keyof RankingFilters, value: boolean) => void;
}

export default function RankingBadges({ variant, filters, onFilterChange }: RankingBadgesProps) {
  const groupId = useId();
  const headingId = `${groupId}-heading`;

  return (
    <div
      role="group"
      aria-labelledby={headingId}
      className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5"
    >
      <span
        id={headingId}
        className="text-[10px] font-semibold uppercase tracking-wide text-subdued whitespace-nowrap"
      >
        Ranking factors:
      </span>
      <div className="flex flex-wrap items-center gap-2 min-w-0">
        {variant === "variant" && (
          <FactorChip
            tone="ai"
            pressed={filters.showAI}
            onPressedChange={(v) => onFilterChange("showAI", v)}
            icon={<AIIcon className="text-current" />}
            label="AI Re-Ranking"
            title="AI re-ranking — click to show or hide in this preview"
          />
        )}
        <FactorChip
          tone="rules"
          pressed={filters.showRules}
          onPressedChange={(v) => onFilterChange("showRules", v)}
          icon={<RulesIcon className="text-current" />}
          label="Rules"
          title="Rules boost — click to show or hide in this preview"
        />
      </div>
    </div>
  );
}
