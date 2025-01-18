import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UseLotsProps {
  auctionId: string;
  page?: number;
  limit?: number;
  status?: string;
  categories?: string[];
  subcategories?: string[];
  search?: string;
}

export function useLots({
  auctionId,
  page = 1,
  limit = 10,
  status,
  categories,
  subcategories,
  search,
}: UseLotsProps) {
  if (!auctionId) {
    throw new Error("auctionId is required for useLots");
  }

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(status && { status }),
    ...(categories?.length && { categories: categories.join(",") }),
    ...(subcategories?.length && { subcategories: subcategories.join(",") }),
    ...(search && { search }),
  } as Record<string, string>);

  const url = `/api/auctions/${auctionId}/lots?${queryParams}`;

  const { data, error, mutate } = useSWR(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true,
  });

  return {
    lots: data?.data,
    categories: data?.categories,
    subcategories: data?.subcategories,
    pagination: data?.metadata,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

// Hook for fetching a single lot by ID
export function useLot(auctionId: string, lotId: string) {
  if (!auctionId || !lotId) {
    throw new Error("Both auctionId and lotId are required for useLot");
  }

  const url = `/api/auctions/${auctionId}/lots/${lotId}`;

  const { data, error, mutate } = useSWR(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    lot: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
