export interface SearchFilters {
  categories: string[];
  priceRange: [number, number];
  status: string | null;
  location: string | null;
  sortBy: string;
  type: string;
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
  status?: string;
  categories?: string[];
  location?: string;
  href: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  categories: string[];
  locations: string[];
}

export interface SearchResultsProps {
  query: string;
  filters: SearchFilters;
  data: SearchResponse | null | undefined;
}
