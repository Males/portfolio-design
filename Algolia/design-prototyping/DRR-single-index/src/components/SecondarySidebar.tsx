import { ChevronDown, Settings, Eye, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function NavItem({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <div
      className="flex items-center h-8 min-h-[32px] pl-2 w-full cursor-pointer"
      role={onClick ? "button" : undefined}
      onClick={onClick}
    >
      <div
        className={`flex-1 flex items-center gap-2.5 h-full pl-4 py-1 border-l ${
          active ? "border-primary" : "border-border-subtle"
        }`}
      >
        <span
          className={`flex-1 text-sm leading-5 truncate ${
            active ? "font-semibold text-primary" : "font-normal text-subdued"
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function NavGroup({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <button className="flex items-center gap-3 cursor-pointer">
        <span className="text-ink">{icon}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase leading-4 text-ink">{title}</span>
          <ChevronDown size={14} className="text-ink" />
        </div>
      </button>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

export default function SecondarySidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isReRanking =
    location.pathname === "/" ||
    location.pathname === "/preview" ||
    location.pathname === "/settings" ||
    location.pathname.startsWith("/create-") ||
    location.pathname.startsWith("/preview-") ||
    location.pathname.startsWith("/set-") ||
    location.pathname.startsWith("/test-");

  return (
    <div className="flex flex-col w-[250px] h-full bg-bg-surface border-r border-border-subtler shrink-0">
      <div className="flex items-center gap-2 h-[60px] px-6 border-b border-border-subtle">
        <Search className="text-primary" size={18} />
        <span className="text-[14px] font-semibold tracking-[0.18em] uppercase text-ink">
          SEARCH
        </span>
      </div>

      <div className="flex flex-col gap-8 px-6 pt-6">
        <NavGroup icon={<Settings size={16} />} title="Configure">
          <NavItem label="Index" />
          <NavItem label="Query Suggestions" />
          <NavItem label="Dictionaries" />
        </NavGroup>

        <NavGroup icon={<Eye size={16} />} title="Observe">
          <NavItem label="Analytics" />
          <NavItem label="A/B Testing" />
        </NavGroup>

        <NavGroup icon={<Sparkles size={16} />} title="Enhance">
          <NavItem label="Rules" />
          <NavItem label="AI Synonyms" />
          <NavItem label="Query Categorization" />
          <NavItem
            label="Re-Ranking"
            active={isReRanking}
            onClick={() => navigate("/")}
          />
          <NavItem label="Personalization" />
          <NavItem label="AI Personalization" />
        </NavGroup>
      </div>
    </div>
  );
}

function Search({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      width={size ?? 18}
      height={size ?? 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
