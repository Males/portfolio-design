import { useNavigate } from "react-router-dom";

export type ExploreConfigureActive = "explore" | "configure";

export default function ExploreConfigureTabs({ active }: { active: ExploreConfigureActive }) {
  const navigate = useNavigate();

  const item = (id: ExploreConfigureActive, label: string) => {
    const isActive = active === id;
    return (
      <button
        type="button"
        onClick={() => navigate(id === "explore" ? "/" : "/settings")}
        className="flex flex-col items-stretch bg-transparent border-0 p-0 cursor-pointer min-w-0"
      >
        <span
          className={`px-1 pt-0 pb-1.5 text-sm font-normal text-center transition-colors ${
            isActive ? "text-ink" : "text-subdued hover:text-ink"
          }`}
        >
          {label}
        </span>
        <span
          className={`h-0.5 w-full shrink-0 ${isActive ? "bg-nebula-600" : "bg-transparent"}`}
          aria-hidden
        />
      </button>
    );
  };

  return (
    <div className="mt-6 border-b border-tab-rule">
      <div className="flex gap-8 pl-2">
        {item("explore", "Explore")}
        {item("configure", "Configure")}
      </div>
    </div>
  );
}
