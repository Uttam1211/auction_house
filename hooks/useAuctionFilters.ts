import { useState } from "react";

export function useAuctionFilters() {
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceMin: undefined as number | undefined,
    priceMax: undefined as number | undefined,
    status: [] as string[],
    search: "",
    sort: "lot-number-asc",
    filterType: "all" as "all" | "open" | "my-bids" | "favorites",
    page: 1,
    limit: 10,
  });

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when filters change (except when explicitly changing page)
      page: "page" in newFilters ? newFilters.page! : 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      priceMin: undefined,
      priceMax: undefined,
      status: [],
      search: "",
      sort: "lot-number-asc",
      filterType: "all",
      page: 1,
      limit: 10,
    });
  };

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}
