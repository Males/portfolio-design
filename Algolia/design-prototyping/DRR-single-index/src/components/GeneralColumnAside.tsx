import { Loader2 } from "lucide-react";

/** Empty Draft 1/2 column on Configure — card beside Goal / Event source / Hourly. */
export function CreateNewVariantCard({
  onCreate,
  disabled,
}: {
  onCreate: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex h-full min-h-[220px] flex-col gap-3 rounded-xl border border-border-subtle bg-bg-sidebar/60 p-4">
      <h4 className="text-base font-semibold text-ink leading-snug">Create a new draft?</h4>
      <p className="text-sm text-subdued leading-relaxed">
        Start a ranking draft to try new settings and preview them on Explore. Drafts don’t affect live data — you can
        run an A/B test from them or apply a winning setup to Control when you’re ready.
      </p>
      <button
        type="button"
        disabled={disabled}
        onClick={onCreate}
        className="mt-auto self-start px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Create
      </button>
    </div>
  );
}

export function BuildingColumnAside({ slot }: { slot: "A" | "B" }) {
  return (
    <div className="flex h-full min-h-[220px] flex-col gap-3 rounded-xl border border-border-subtle bg-bg-sidebar/60 p-4">
      <div className="flex items-start gap-2">
        <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary mt-0.5" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-ink">Creating Draft {slot === "A" ? "1" : "2"}</p>
          <p className="mt-1 text-sm text-subdued leading-relaxed">
            We’re copying your Control draft into this slot. General settings for this column will stay read-only until
            the build finishes.
          </p>
        </div>
      </div>
    </div>
  );
}

export function DrrOffColumnAside() {
  return (
    <div className="flex h-full min-h-[160px] flex-col justify-center rounded-xl border border-border-subtle bg-bg-sidebar/40 p-4">
      <p className="text-sm text-subdued leading-relaxed">
        This column is set to DRR off. There are no re-ranking settings here — Coverage and Ordering below use a dash
        for this side.
      </p>
    </div>
  );
}
