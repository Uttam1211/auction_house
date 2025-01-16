export interface SearchFilters {
  categories: string[];
  priceRange: [number, number];
  status: "OPEN" | "CLOSED" | "UPCOMING" | null;
  location: string | null;
  sortBy: string;
  type: "auction" | "lot" | "all" | "event" | "contact";
}

export interface SearchResult {
  id: string;
  type: "auction" | "lot" | "event";
  title: string;
  description: string;
  image: string;
  price?: number;
  currentBid?: number;
  date?: string;
  status: "OPEN" | "CLOSED" | "UPCOMING";
  categories: string[];
  location?: string;
  href: string;
  isSold: boolean;
  isPublished: boolean;
  isLive: boolean;
  isFeatured: boolean;
  isApproved: boolean;
  error?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  categories: string[];
  locations: string[];
  error?: string;
}

export interface SearchResultsProps {
  query: string;
  filters: SearchFilters;
  data: SearchResponse | null | undefined;
}
