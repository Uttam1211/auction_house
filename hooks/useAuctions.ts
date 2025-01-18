import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

//Hook for fetching a list of auctions
interface UseAuctionsProps {
  page?: number;
  limit?: number;
  categories?: string[];
  tags?: string[];
  location?: string[];
  status?: string;
  search?: string;
  sort?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
}

export function useAuctions({
  page = 1,
  limit = 10,
  categories,
  tags,
  location,
  status,
  search,
  sort,
  isFeatured,
  isPublished,
}: UseAuctionsProps = {}) {
  // Build query parameters dynamically
  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(categories?.length && { categories: categories.join(",") }),
    ...(tags?.length && { tags: tags.join(",") }),
    ...(location?.length && { location: location.join(",") }),
    ...(status && { status }),
    ...(search && { search }),
    ...(sort && { sort }),
    ...(isFeatured !== undefined && { isFeatured: String(isFeatured) }),
    ...(isPublished !== undefined && { isPublished: String(isPublished) }),
  } as Record<string, string>);

  const url = `/api/auctions?${queryParams}`;

  const { data, error, mutate } = useSWR(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true,
  });

  // Pagination controls
  const currentPage = page;
  const totalPages = data?.metadata?.totalPages || 1;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return {
    auctions: data?.data, // List of auctions
    pagination: {
      totalRecords: data?.metadata?.totalRecords,
      currentPage,
      totalPages,
      isFirstPage,
      isLastPage,
    },
    isLoading: !error && !data,
    isError: error,
    mutate,
    // Pagination helper functions
    nextPage: () =>
      !isLastPage &&
      mutate(
        `/api/auctions?${new URLSearchParams({
          ...queryParams,
          page: String(currentPage + 1),
        })}`
      ),
    previousPage: () =>
      !isFirstPage &&
      mutate(
        `/api/auctions?${new URLSearchParams({
          ...queryParams,
          page: String(currentPage - 1),
        })}`
      ),
  };
}



// Hook for fetching a single auction by ID
export function useAuction(auctionId: string) {
  if (!auctionId) {
    throw new Error("auctionId is required for useAuction");
  }

  const url = `/api/auctions/${auctionId}`;

  const { data, error, mutate } = useSWR(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    auction: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
