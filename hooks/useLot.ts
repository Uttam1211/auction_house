import useSWR from "swr";
import { Lot } from "@/types/Lot";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useLot(auctionId: string, lotId: string) {
  const { data, error, isLoading } = useSWR<Lot>(
    auctionId && lotId ? `/api/auctions/${auctionId}/lots/${lotId}` : null,
    fetcher
  );

  return {
    data,
    isLoading,
    isError: error,
  };
}
