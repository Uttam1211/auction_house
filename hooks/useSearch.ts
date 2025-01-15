import useSWR from "swr";
import { SearchFilters, SearchResponse } from "@/types/search";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export function useSearch(query: string, filters: SearchFilters) {
  const queryParams = new URLSearchParams({
    ...(query && { q: query }),
    ...(filters.type !== "all" && { type: filters.type }),
    ...(filters.categories.length > 0 && {
      categories: filters.categories.join(","),
    }),
    ...(filters.status && { status: filters.status }),
    ...(filters.location && { location: filters.location }),
    ...(filters.sortBy !== "relevance" && { sortBy: filters.sortBy }),
    ...(filters.priceRange[0] > 0 && {
      minPrice: filters.priceRange[0].toString(),
    }),
    ...(filters.priceRange[1] < 1000000 && {
      maxPrice: filters.priceRange[1].toString(),
    }),
  });

  // Only fetch if there are actual parameters to search with
  const shouldFetch = queryParams.toString().length > 0;

  const { data, error, isLoading } = useSWR<SearchResponse>(
    shouldFetch ? `/api/search?${queryParams.toString()}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    }
  );

  return {
    data,
    isLoading,
    isError: error,
  };
}
