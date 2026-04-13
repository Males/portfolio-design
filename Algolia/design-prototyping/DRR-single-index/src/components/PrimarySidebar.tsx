import {
  Home,
  Search,
  Rocket,
  BarChart2,
  Database,
  Settings,
} from "lucide-react";

function NavIcon({ icon, active, badge }: { icon: React.ReactNode; active?: boolean; badge?: boolean }) {
  return (
    <div
      className={`relative flex items-center justify-center w-8 h-8 rounded ${
        active
          ? "bg-white shadow-[0px_1px_3px_0px_rgba(33,36,61,0.25),0px_0px_0px_1px_rgba(33,36,61,0.05)]"
          : "hover:bg-white/60 cursor-pointer"
      }`}
    >
      <div className="text-subdued">{icon}</div>
      {badge && (
        <div className="absolute top-[5px] right-[5px] w-1.5 h-1.5 bg-primary rounded-full border border-white" />
      )}
    </div>
  );
}

export default function PrimarySidebar() {
  return (
    <div className="flex flex-col w-14 h-full bg-bg-sidebar border-r border-border-subtle shrink-0">
      <div className="flex flex-col items-center justify-center h-[60px] border-b border-border-subtle px-3">
        <img
          src={`${import.meta.env.BASE_URL}algolia-mark.png`}
          alt="Algolia"
          width="28"
          height="28"
        />
      </div>

      <div className="flex-1 flex flex-col items-center gap-2 pt-[17px] px-3">
        <NavIcon icon={<Home size={16} />} />
        <div className="w-full h-px bg-border-subtle my-1" />
        <NavIcon icon={<Search size={14} />} active />
        <NavIcon
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="4" r="3" stroke="#5A5E9A" strokeWidth="1.5" fill="none" />
              <path d="M3 13c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#5A5E9A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          }
        />
        <NavIcon
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="6" width="13.5" height="1.93" fill="#36395A" />
              <rect x="4" y="9.86" width="11.57" height="1.93" fill="#36395A" />
              <rect x="4" y="13.71" width="9" height="1.93" fill="#36395A" />
              <path d="M18.14 11.14l-.82 2.49a1.14 1.14 0 0 1-.71.71l-2.49.82 2.49.82c.13.04.24.11.34.21.1.09.17.21.21.34l.82 2.49.82-2.49a1.14 1.14 0 0 1 .71-.71l2.49-.82-2.49-.82a1.14 1.14 0 0 1-.71-.71l-.82-2.49Z" fill="#9524FF" />
            </svg>
          }
        />
      </div>

      <div className="flex flex-col items-center gap-2 pb-3 px-3">
        <NavIcon icon={<Rocket size={16} />} badge />
        <NavIcon icon={<BarChart2 size={16} />} />
        <NavIcon icon={<Database size={16} />} />
        <NavIcon icon={<Settings size={16} />} />
      </div>
    </div>
  );
}
