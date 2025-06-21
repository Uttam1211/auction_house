import useSWR from "swr";
import { LotWithCategories } from "@/types/combinationPrismaTypes";

interface SimilarItemsResponse {
  similarLots?: LotWithCategories[];
  similarAuctions?: any[];
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return response.json();
};

export function useSimilarItems(
  auctionId: string,
  lotId?: string,
  page: number = 1,
  limit: number = 8
) {
  if (!auctionId) {
    // Return loading state instead of disabling SWR
    return {
      similarLots: [],
      similarAuctions: [],
      isLoading: true,
      isError: false,
    };
  }

  let url = `/api/auctions/${auctionId}/similar?page=${page}&limit=${limit}`;
  if (lotId) {
    url += `&lotId=${lotId}`;
  }

  const { data, error, isLoading } = useSWR<SimilarItemsResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    similarLots: data?.similarLots as LotWithCategories[] || [],
    similarAuctions: data?.similarAuctions || [],
    isLoading,
    isError: error,
  };
}
