import { useRouter } from "next/router";
import { useState } from "react";
import AuctionFilter from "@/components/auctions/AuctionFilter";
import { useSimilarItems } from "@/hooks/useSimilarItems";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Loading from "@/components/Loading";

const ITEMS_PER_PAGE = 8;

export default function AuctionSimilarTab({
  auctionId,
}: {
  auctionId: string;
}) {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { similarAuctions, isLoading, isError } = useSimilarItems(
    auctionId as string,
    undefined,
    page,
    ITEMS_PER_PAGE
  );

  if (!auctionId) {
    return (
      <div className="flex flex-col items-center justify-center py-8 md:py-16 px-4">
        <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">
          Auction Not Found
        </h1>
        <Button onClick={() => router.push("/auctions")}>
          Back to Auctions
        </Button>
      </div>
    );
  }

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px] md:min-h-[300px]">
          <Loading />
        </div>
      ) : (
        <>
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">
            Similar Auctions
          </h1>

          <div className="space-y-4 md:space-y-6">
            <AuctionFilter
              similarAuctions={similarAuctions}
              isLoading={isLoading}
              onLoadMore={handleLoadMore}
              hasMore={Boolean(
                similarAuctions && similarAuctions.length === ITEMS_PER_PAGE
              )}
            />
          </div>
        </>
      )}
    </div>
  );
}
