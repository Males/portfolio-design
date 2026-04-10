import ProductCard from "./ProductCard";
import type { MockProduct } from "../data/mockData";

interface SearchResultsGridProps {
  products: MockProduct[];
  rankChanges?: Map<string, number>;
}

export default function SearchResultsGrid({ products, rankChanges }: SearchResultsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product, idx) => (
        <ProductCard
          key={product.id}
          product={product}
          rank={idx + 1}
          showRankChange={rankChanges?.get(product.id)}
        />
      ))}
    </div>
  );
}
