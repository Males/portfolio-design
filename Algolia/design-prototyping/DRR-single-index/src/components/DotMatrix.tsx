import type { RankMovement } from "../data/mockData";

interface DotMatrixProps {
  movements: RankMovement[];
}

export default function DotMatrix({ movements }: DotMatrixProps) {
  const sorted = [...movements].sort((a, b) => a.controlRank - b.controlRank);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-[6px]">
        {sorted.map((m) => {
          const isReranked = m.movedUp || m.movedDown || m.isNew;
          const rightFill = m.variantRank !== -1;

          return (
            <div key={m.productId} className="flex items-center gap-0">
              <span className="w-5 text-right text-[9px] text-subdued/50 font-mono pr-1.5 select-none">
                {m.controlRank}
              </span>

              <div className="w-[7px] h-[7px] rounded-sm bg-[#B8B8D0]" />

              <svg width="68" height="7" className="mx-0">
                <line
                  x1="3"
                  y1="3.5"
                  x2="65"
                  y2="3.5"
                  stroke="#D6D6E7"
                  strokeWidth="1"
                  strokeOpacity="0.6"
                />
              </svg>

              <div
                className={`w-[7px] h-[7px] rounded-sm ${
                  isReranked || m.isNew
                    ? "bg-[#8B7FC7]"
                    : rightFill
                      ? "bg-[#B8B8D0]"
                      : "border border-[#D6D6E7]"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
