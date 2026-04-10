import { Bell, HelpCircle, ChevronDown, ChevronUp, Search, BookOpen, Meh } from "lucide-react";

function AppBadge() {
  return (
    <div className="flex items-center justify-center w-4 h-4 rounded-sm bg-avatar-secondary shadow-[0px_1px_3px_0px_rgba(33,36,61,0.25),0px_0px_0px_1px_rgba(33,36,61,0.05)]">
      <span className="text-[9px] font-normal text-cyan-800 leading-4">PR</span>
    </div>
  );
}

function Avatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
      <img
        src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"
        alt="User avatar"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default function TopHeader() {
  return (
    <div className="flex flex-col justify-center px-8 h-[60px] border-b border-border-subtle bg-bg-surface">
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1">
          <button className="flex flex-col gap-0 cursor-pointer">
            <span className="text-xs text-subdued leading-4 text-left">Applications</span>
            <div className="flex items-center gap-2 mt-0.5">
              <AppBadge />
              <span className="text-sm font-semibold text-ink leading-5">prod_env_app</span>
              <div className="flex flex-col">
                <ChevronUp size={10} className="text-ink" />
                <ChevronDown size={10} className="text-ink -mt-0.5" />
              </div>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-1 bg-bg-sidebar rounded-lg px-3 py-1.5 w-[310px]">
          <Search size={13} className="text-subdued" />
          <span className="text-sm text-subdued ml-1">Search for documentation, pages...</span>
          <span className="ml-auto text-xs text-subdued border border-border-subtle rounded px-1">⌘K</span>
        </div>

        <div className="flex items-center gap-4 ml-4">
          <div className="flex items-center gap-3">
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-bg-sidebar cursor-pointer">
              <HelpCircle size={16} className="text-subdued" />
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-bg-sidebar cursor-pointer">
              <Bell size={16} className="text-subdued" />
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-bg-sidebar cursor-pointer">
              <BookOpen size={16} className="text-subdued" />
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-bg-sidebar cursor-pointer">
              <Meh size={16} className="text-subdued" />
            </button>
          </div>
          <button className="flex items-center gap-1 cursor-pointer">
            <Avatar />
            <ChevronDown size={16} className="text-subdued" />
          </button>
        </div>
      </div>
    </div>
  );
}
