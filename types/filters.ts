export interface FilterState {
  categories: string[];
  priceMin?: number;
  priceMax?: number;
  status: string[];
  search: string;
  sort: string;
  filterType: "all" | "open" | "my-bids" | "favorites";
  page: number;
  limit: number;
}
