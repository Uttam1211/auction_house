import useSWR from "swr";
import { Auction } from "@/types/auction";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UseAuctionsProps {
  page?: number;
  limit?: number;
  auctionId?: string;
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  status?: string[];
  search?: string;
  sort?: string;
  filterType?: "all" | "open" | "my-bids" | "favorites";
  featured?: boolean;
}

export function useAuctions({
  page = 1,
  limit = 10,
  auctionId,
  categories,
  priceMin,
  priceMax,
  status,
  search,
  sort,
  filterType = "all",
  featured,
}: UseAuctionsProps = {}) {
  // Build query parameters
  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(categories?.length && { categories: categories.join(",") }),
    ...(priceMin && { priceMin: String(priceMin) }),
    ...(priceMax && { priceMax: String(priceMax) }),
    ...(status?.length && { status: status.join(",") }),
    ...(search && { search }),
    ...(sort && { sort }),
    ...(filterType && { filterType }),
    ...(featured && { featured: String(featured) }),
  } as Record<string, string>);

  const url = auctionId
    ? `/api/auctions/${auctionId}?${queryParams}`
    : `/api/auctions?${queryParams}`;

  const { data, error, mutate } = useSWR(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true,
  });

  return {
    auction: auctionId ? data?.auction : undefined,
    auctions: auctionId ? undefined : data?.auctions,
    lots: data?.auction?.lots,
    pagination: data?.pagination,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
