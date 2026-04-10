import type { ComparisonPaneMode, DRRSettingsSnapshot } from "../types/drrSettings";

export type { ComparisonPaneMode };

export interface MockProduct {
  id: string;
  title: string;
  brand: string;
  price: number;
  currency: string;
  category: string;
  subcategories: string[];
  tags: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  color: string;
  imageHue: number;
  sales: number;
  hasRules: boolean;
}

export const allProducts: MockProduct[] = [
  {
    id: "prod-001",
    title: "Wireless Noise-Cancelling Headphones",
    brand: "SoundCore",
    price: 249.99,
    currency: "USD",
    category: "Electronics",
    subcategories: ["Audio", "Headphones"],
    tags: ["Wireless", "ANC", "Bluetooth 5.3", "40h Battery"],
    rating: 4.7,
    reviews: 2341,
    inStock: true,
    color: "#3B82F6",
    imageHue: 220,
    sales: 8920,
    hasRules: true,
  },
  {
    id: "prod-002",
    title: "Premium Leather Crossbody Bag",
    brand: "Artisan & Co",
    price: 189.00,
    currency: "USD",
    category: "Fashion",
    subcategories: ["Bags", "Crossbody"],
    tags: ["Leather", "Handmade", "Italian", "Unisex"],
    rating: 4.8,
    reviews: 876,
    inStock: true,
    color: "#92400E",
    imageHue: 30,
    sales: 4210,
    hasRules: false,
  },
  {
    id: "prod-003",
    title: "Organic Matcha Powder - Ceremonial",
    brand: "Zen Leaf",
    price: 34.50,
    currency: "USD",
    category: "Food & Drink",
    subcategories: ["Tea", "Matcha"],
    tags: ["Organic", "Japanese", "Ceremonial Grade", "100g"],
    rating: 4.6,
    reviews: 1523,
    inStock: true,
    color: "#16A34A",
    imageHue: 140,
    sales: 12300,
    hasRules: true,
  },
  {
    id: "prod-004",
    title: "Minimalist Desk Lamp - Matte Black",
    brand: "Luminos",
    price: 79.95,
    currency: "USD",
    category: "Home & Office",
    subcategories: ["Lighting", "Desk Lamps"],
    tags: ["LED", "Dimmable", "USB-C", "Touch Control"],
    rating: 4.5,
    reviews: 634,
    inStock: true,
    color: "#1F2937",
    imageHue: 210,
    sales: 3450,
    hasRules: false,
  },
  {
    id: "prod-005",
    title: "Running Shoes - UltraBoost Pro",
    brand: "StrideMax",
    price: 159.00,
    currency: "USD",
    category: "Sports",
    subcategories: ["Footwear", "Running"],
    tags: ["Lightweight", "Responsive", "Carbon Plate", "Men's"],
    rating: 4.4,
    reviews: 3120,
    inStock: true,
    color: "#DC2626",
    imageHue: 0,
    sales: 6780,
    hasRules: true,
  },
  {
    id: "prod-006",
    title: "Stainless Steel Water Bottle 750ml",
    brand: "HydroKeep",
    price: 29.99,
    currency: "USD",
    category: "Sports",
    subcategories: ["Accessories", "Bottles"],
    tags: ["Insulated", "BPA-Free", "24h Cold", "12h Hot"],
    rating: 4.3,
    reviews: 4567,
    inStock: true,
    color: "#0891B2",
    imageHue: 190,
    sales: 15400,
    hasRules: false,
  },
  {
    id: "prod-007",
    title: "Mechanical Keyboard - 75% Layout",
    brand: "KeyCraft",
    price: 134.99,
    currency: "USD",
    category: "Electronics",
    subcategories: ["Peripherals", "Keyboards"],
    tags: ["Mechanical", "Hot-Swap", "RGB", "Gateron Pro"],
    rating: 4.6,
    reviews: 1890,
    inStock: true,
    color: "#7C3AED",
    imageHue: 270,
    sales: 5230,
    hasRules: true,
  },
  {
    id: "prod-008",
    title: "Ceramic Pour-Over Coffee Dripper",
    brand: "BrewCraft",
    price: 42.00,
    currency: "USD",
    category: "Home & Office",
    subcategories: ["Kitchen", "Coffee"],
    tags: ["Ceramic", "Handmade", "Size 02", "White"],
    rating: 4.9,
    reviews: 312,
    inStock: true,
    color: "#F5F5F4",
    imageHue: 40,
    sales: 2100,
    hasRules: false,
  },
  {
    id: "prod-009",
    title: "Yoga Mat - Extra Thick 6mm",
    brand: "FlexForm",
    price: 54.95,
    currency: "USD",
    category: "Sports",
    subcategories: ["Yoga", "Mats"],
    tags: ["Non-Slip", "Eco-Friendly", "TPE", "Carry Strap"],
    rating: 4.5,
    reviews: 2045,
    inStock: true,
    color: "#059669",
    imageHue: 160,
    sales: 7890,
    hasRules: false,
  },
  {
    id: "prod-010",
    title: "Polarised Aviator Sunglasses",
    brand: "ShadeVault",
    price: 119.00,
    currency: "USD",
    category: "Fashion",
    subcategories: ["Accessories", "Sunglasses"],
    tags: ["Polarised", "UV400", "Titanium Frame", "Unisex"],
    rating: 4.3,
    reviews: 987,
    inStock: true,
    color: "#D97706",
    imageHue: 45,
    sales: 3560,
    hasRules: true,
  },
  {
    id: "prod-011",
    title: "Smart Fitness Tracker Band",
    brand: "PulseSync",
    price: 89.99,
    currency: "USD",
    category: "Electronics",
    subcategories: ["Wearables", "Fitness"],
    tags: ["Heart Rate", "SpO2", "Sleep", "7-day Battery"],
    rating: 4.2,
    reviews: 5432,
    inStock: true,
    color: "#0D9488",
    imageHue: 175,
    sales: 11200,
    hasRules: false,
  },
  {
    id: "prod-012",
    title: "Linen Blend Throw Blanket",
    brand: "Nest & Nook",
    price: 68.00,
    currency: "USD",
    category: "Home & Office",
    subcategories: ["Textiles", "Blankets"],
    tags: ["Linen", "Oeko-Tex", "Machine Wash", "150x200cm"],
    rating: 4.7,
    reviews: 445,
    inStock: true,
    color: "#B45309",
    imageHue: 35,
    sales: 1890,
    hasRules: true,
  },
];

/**
 * Control ranking: standard relevance ordering (alphabetical-ish by sales volume).
 * This represents what search returns without DRR.
 */
export const controlOrder: string[] = [
  "prod-006", // Water Bottle — high volume, weak conversion
  "prod-011", // Fitness Tracker — high volume
  "prod-003", // Matcha — high volume
  "prod-001", // Headphones
  "prod-009", // Yoga Mat
  "prod-005", // Running Shoes
  "prod-007", // Keyboard
  "prod-002", // Leather Bag
  "prod-010", // Sunglasses
];

/**
 * Variant ranking: DRR-optimised ordering based on conversion rate signal.
 * Notice the re-ranking — high-converting items like the Headphones and
 * Leather Bag move up; low-converting but high-volume items drop.
 */
export const variantOrder: string[] = [
  "prod-001", // Headphones — high CVR, moved from #4 → #1
  "prod-008", // Pour-Over Dripper — high rating, moved from unranked → #2
  "prod-002", // Leather Bag — strong CVR, moved from #8 → #3
  "prod-003", // Matcha — stays high
  "prod-007", // Keyboard — moved up from #7 → #5
  "prod-005", // Running Shoes — stays similar
  "prod-012", // Throw Blanket — high CVR, pulled in from unranked
  "prod-009", // Yoga Mat — dropped from #5 → #8
  "prod-006", // Water Bottle — dropped from #1 → #9 (low CVR)
];

export function getProductById(id: string): MockProduct | undefined {
  return allProducts.find((p) => p.id === id);
}

export function getOrderedProducts(order: string[]): MockProduct[] {
  return order
    .map((id) => getProductById(id))
    .filter((p): p is MockProduct => p !== undefined);
}

/**
 * Ranking movement data for the dot matrix visualisation.
 * Each entry maps a control-side rank to its variant-side rank.
 */
export interface RankMovement {
  controlRank: number;
  variantRank: number;
  productId: string;
  movedUp: boolean;
  movedDown: boolean;
  isNew: boolean;
  delta: number;
}

export function computeRankMovements(): RankMovement[] {
  return controlOrder.map((id, controlIdx) => {
    const variantIdx = variantOrder.indexOf(id);
    const isInVariant = variantIdx !== -1;
    return {
      controlRank: controlIdx + 1,
      variantRank: isInVariant ? variantIdx + 1 : -1,
      productId: id,
      movedUp: isInVariant && variantIdx < controlIdx,
      movedDown: isInVariant && variantIdx > controlIdx,
      isNew: !isInVariant,
      delta: isInVariant ? controlIdx - variantIdx : 0,
    };
  });
}

function hashSnapshot(config: DRRSettingsSnapshot): number {
  const s = JSON.stringify({
    goal: config.goal,
    eventSourceIndex: config.eventSourceIndex,
    hourlyRefresh: config.hourlyRefresh,
    multiSignalRanking: config.multiSignalRanking,
    rerankedEmptyQueries: config.rerankedEmptyQueries,
    browsingFacetsCount: config.browsingFacetsCount,
    eventFreshness: config.eventFreshness,
    groupSimilarQueries: config.groupSimilarQueries,
    groupSimilarQueriesLang: config.groupSimilarQueriesLang,
    reRankingFilter: config.reRankingFilter,
  });
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) || 1;
}

/**
 * Deterministic ranking for a DRR-on snapshot: starts from variant template and
 * reorders by a seeded shuffle so different settings visibly change results.
 */
export function rankingIdsForDRRSettings(config: DRRSettingsSnapshot): string[] {
  const base = [...variantOrder];
  const seed = hashSnapshot(config);
  const ids = [...base];
  let s = seed;
  for (let i = ids.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}

export function rankingIdsForPane(
  mode: ComparisonPaneMode,
  options: {
    productionConfig: DRRSettingsSnapshot;
    /**
     * When set (e.g. on Settings while editing), "Control" pane rankings use this snapshot
     * instead of saved production — so users see live preview of unsaved changes.
     */
    controlPreviewSnapshot?: DRRSettingsSnapshot;
    variantAConfig: DRRSettingsSnapshot;
    variantBConfig: DRRSettingsSnapshot;
    hasVariantA: boolean;
    hasVariantB: boolean;
  },
): string[] {
  const savedLive = options.productionConfig;
  const controlRankingSource = options.controlPreviewSnapshot ?? savedLive;

  switch (mode) {
    case "drr-off":
      return [...controlOrder];
    case "control":
      return rankingIdsForDRRSettings(controlRankingSource);
    case "variant-a":
      return options.hasVariantA
        ? rankingIdsForDRRSettings(options.variantAConfig)
        : rankingIdsForDRRSettings(savedLive);
    case "variant-b":
      return options.hasVariantB
        ? rankingIdsForDRRSettings(options.variantBConfig)
        : rankingIdsForDRRSettings(savedLive);
    default:
      return [...controlOrder];
  }
}

export function computeRankMovementsBetween(
  leftIds: string[],
  rightIds: string[],
): RankMovement[] {
  return leftIds.map((id, leftIdx) => {
    const rightIdx = rightIds.indexOf(id);
    const isInRight = rightIdx !== -1;
    return {
      controlRank: leftIdx + 1,
      variantRank: isInRight ? rightIdx + 1 : -1,
      productId: id,
      movedUp: isInRight && rightIdx < leftIdx,
      movedDown: isInRight && rightIdx > leftIdx,
      isNew: !isInRight,
      delta: isInRight ? leftIdx - rightIdx : 0,
    };
  });
}
