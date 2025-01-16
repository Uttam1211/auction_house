import useSWR from "swr";
import { Lot } from "@prisma/client";
import { Auction } from "@prisma/client";
import { LotWithCategories } from "@/types/combinationPrismaTypes";

interface SimilarItemsResponse {
  similarLots?: LotWithCategories[];
  similarAuctions?: Auction[];
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
  const url = auctionId
    ? `/api/auctions/${auctionId}/similar?page=${page}&limit=${limit}${
        lotId ? `&lotId=${lotId}` : ""
      }`
    : null;

  const { data, error, isLoading } = useSWR<SimilarItemsResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    similarLots: data?.similarLots as LotWithCategories[],
    similarAuctions: data?.similarAuctions as Auction[],
    isLoading,
    isError: error,
  };
}
