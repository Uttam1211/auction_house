import useSWR from "swr";
import { Bid, Category, Lot } from "@prisma/client";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  const data = await response.json();
  if ("error" in data) {
    throw new Error(data.error);
  }
  return data;
};

interface LotWithAuction extends Lot {
    auction: {
      title: string;
  };
  categories: Category[];
  bidHistory: Bid[];
}

export function useLot(auctionId: string, lotId: string) {
  const { data, error, isLoading } = useSWR<LotWithAuction>(
    auctionId && lotId ? `/api/auctions/${auctionId}/${lotId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data,
    isLoading,
    isError: error,
  };
}
