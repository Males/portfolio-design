import { Star, TrendingUp } from "lucide-react";
import type { MockProduct } from "../data/mockData";

interface ProductCardProps {
  product: MockProduct;
  rank: number;
  showRankChange?: number;
}

function ProductImage({ product }: { product: MockProduct }) {
  const hue = product.imageHue;
  const bgLight = `hsl(${hue}, 25%, 95%)`;
  const bgMid = `hsl(${hue}, 30%, 88%)`;
  const accent = `hsl(${hue}, 50%, 60%)`;

  return (
    <div
      className="relative h-[130px] w-full"
      style={{ background: `linear-gradient(135deg, ${bgLight}, ${bgMid})` }}
    >
      <svg width="100%" height="100%" viewBox="0 0 140 130" preserveAspectRatio="xMidYMid meet">
        <rect x="35" y="25" width="70" height="70" rx="8" fill="white" fillOpacity="0.6" />
        <rect x="42" y="32" width="56" height="56" rx="4" fill={accent} fillOpacity="0.15" />
        <circle cx="70" cy="60" r="18" fill={accent} fillOpacity="0.25" />
        <circle cx="70" cy="60" r="8" fill={accent} fillOpacity="0.5" />
        <line x1="55" y1="45" x2="85" y2="75" stroke={accent} strokeWidth="1.5" strokeOpacity="0.3" />
        <line x1="85" y1="45" x2="55" y2="75" stroke={accent} strokeWidth="1.5" strokeOpacity="0.3" />
        <text
          x="70"
          y="108"
          textAnchor="middle"
          fill={accent}
          fontSize="7"
          fontWeight="600"
          opacity="0.5"
        >
          {product.brand.toUpperCase()}
        </text>
      </svg>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={8}
          className={i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}
        />
      ))}
      <span className="text-[9px] text-subdued ml-0.5">{rating}</span>
    </div>
  );
}

export default function ProductCard({ product, rank, showRankChange }: ProductCardProps) {
  return (
    <div className="flex flex-col w-full rounded-lg border border-border-subtle bg-bg-surface overflow-hidden hover:shadow-sm transition-shadow">
      <div className="relative">
        <ProductImage product={product} />

        <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
          <span className="flex items-center justify-center min-w-[18px] h-[18px] rounded bg-white/90 text-primary text-[10px] font-bold shadow-sm px-1">
            {rank}
          </span>
          {showRankChange !== undefined && showRankChange !== 0 && (
            <span
              className={`flex items-center gap-0.5 px-1 h-[16px] rounded text-[9px] font-semibold ${
                showRankChange > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-500"
              }`}
            >
              <TrendingUp
                size={8}
                className={showRankChange < 0 ? "rotate-180" : ""}
              />
              {Math.abs(showRankChange)}
            </span>
          )}
        </div>

        <div className="absolute top-1.5 right-1.5">
          <span className="flex items-center justify-center h-[18px] rounded bg-purple-100/90 text-purple-500 shadow-sm px-1">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <rect x="1" y="3" width="1.5" height="6" rx="0.5" />
              <rect x="4.25" y="1" width="1.5" height="8" rx="0.5" />
              <rect x="7.5" y="4" width="1.5" height="5" rx="0.5" />
            </svg>
          </span>
        </div>

        {product.inStock && (
          <div className="absolute bottom-1.5 left-1.5">
            <span className="text-[9px] font-medium text-green-700 bg-green-100/90 rounded px-1 py-0.5 shadow-sm">
              In stock
            </span>
          </div>
        )}

        <div className="absolute bottom-1.5 right-1.5">
          <span className="text-[10px] font-bold text-ink bg-white/90 rounded px-1.5 py-0.5 shadow-sm">
            ${product.price.toFixed(product.price % 1 === 0 ? 0 : 2)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 px-2 pt-1.5 pb-2">
        <p className="text-[11px] font-semibold text-ink leading-tight line-clamp-2">{product.title}</p>
        <p className="text-[10px] text-subdued">{product.brand}</p>
        <p className="text-[10px] text-subdued">
          {product.category} › {product.subcategories.join(" › ")}
        </p>

        <StarRating rating={product.rating} />

        <div className="flex flex-wrap gap-0.5 mt-0.5">
          {product.tags.slice(0, 3).map((t) => (
            <span key={t} className="text-[8px] text-subdued bg-bg-sidebar rounded px-1 py-px">
              {t}
            </span>
          ))}
          {product.tags.length > 3 && (
            <span className="text-[8px] text-subdued">+{product.tags.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
}
