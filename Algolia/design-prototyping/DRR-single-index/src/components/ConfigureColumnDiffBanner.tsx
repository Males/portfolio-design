import { useMemo } from "react";
import type { DRRSettingsSnapshot } from "../types/drrSettings";
import { diffSettings } from "../lib/configDiff";

export default function ConfigureColumnDiffBanner({
  left,
  right,
}: {
  left: DRRSettingsSnapshot;
  right: DRRSettingsSnapshot;
}) {
  const count = useMemo(() => diffSettings(left, right).length, [left, right]);

  if (count === 0) {
    return (
      <p className="text-xs text-subdued rounded-lg border border-border-subtle bg-bg-sidebar/60 px-3 py-2">
        Same settings as the other column for all compared fields.
      </p>
    );
  }

  return (
    <p className="text-xs text-ink rounded-lg border border-primary/25 bg-primary/5 px-3 py-2">
      <span className="font-semibold">{count} setting{count === 1 ? "" : "s"}</span> differ from the other column.
    </p>
  );
}
