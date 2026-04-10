import { Copy, MoreVertical } from "lucide-react";
import type { TestResult } from "../context/DRRContext";

interface TestBannerProps {
  result: TestResult;
}

const splitColors = ["bg-primary", "bg-green-600", "bg-orange-500"];

export default function TestBanner({ result }: TestBannerProps) {
  return (
    <div
      className="border border-border-subtle rounded-xl bg-bg-surface p-5 mb-6"
      style={{ animation: "fadeSlideIn 0.3s ease-out" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-ink">{result.name}</h3>
          <span className="text-sm text-subdued">{result.id}</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            result.status === "completed"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-primary"
          }`}>
            {result.status === "completed" ? "Completed" : "Running"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded border border-border-subtle hover:bg-bg-sidebar cursor-pointer">
            <Copy size={14} className="text-subdued" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded border border-border-subtle hover:bg-bg-sidebar cursor-pointer">
            <MoreVertical size={14} className="text-subdued" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-5">
        <div className="flex items-center gap-2">
          <span className="text-sm text-ink">{result.startDate}</span>
          <div className="w-24 h-1.5 rounded-full bg-border-subtle overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: "100%" }} />
          </div>
          <span className="text-sm text-ink">{result.endDate}</span>
        </div>
        <div className="flex items-center gap-4">
          {result.splits.map((s, i) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className={`w-4 h-4 rounded-full ${splitColors[i] ?? "bg-subdued"} text-white text-[10px] font-bold flex items-center justify-center`}>
                {s.label}
              </span>
              <span className="text-sm text-ink">Split: {s.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="text-left text-xs font-medium text-subdued py-2 pr-4">Variant</th>
            <th className="text-right text-xs font-medium text-subdued py-2 px-4">Tracked searches</th>
            <th className="text-right text-xs font-medium text-subdued py-2 px-4">Tracked users</th>
            <th className="text-right text-xs font-medium text-subdued py-2 px-4">CTR</th>
            <th className="text-right text-xs font-medium text-subdued py-2 pl-4">CVR</th>
          </tr>
        </thead>
        <tbody>
          {result.variants.map((v, i) => (
            <tr key={v.label} className="border-b border-border-subtle last:border-0">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full ${splitColors[i] ?? "bg-subdued"} text-white text-[10px] font-bold flex items-center justify-center`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm font-medium text-ink">{v.label}</span>
                </div>
              </td>
              <td className="text-right text-sm text-ink py-3 px-4">
                {typeof v.trackedSearches === "number" ? v.trackedSearches.toLocaleString() : v.trackedSearches}
              </td>
              <td className="text-right text-sm text-ink py-3 px-4">
                {typeof v.trackedUsers === "number" ? v.trackedUsers.toLocaleString() : v.trackedUsers}
              </td>
              <td className="text-right text-sm text-ink py-3 px-4">{v.ctr}%</td>
              <td className="text-right text-sm py-3 pl-4">
                {typeof v.cvr === "string" ? (
                  <span className="text-ink">{v.cvr}</span>
                ) : (
                  <span className={v.cvr < 0 ? "text-red-500" : "text-green-600"}>
                    {v.cvr > 0 ? "+" : ""}{v.cvr}%
                  </span>
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td className="pt-2 text-sm text-subdued">Confidence</td>
            <td />
            <td />
            <td className="text-right pt-2 text-sm text-subdued">Status</td>
            <td className="text-right pt-2 text-sm text-subdued">Status</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
