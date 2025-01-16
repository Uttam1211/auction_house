import { useRouter } from "next/router";
import { useState } from "react";
import AuctionFilter from "@/components/auction/AuctionFilter";
import { useSimilarItems } from "@/hooks/useSimilarItems";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ITEMS_PER_PAGE = 8;

export default function AuctionSimilarTab({ auctionId }: { auctionId: string }) {
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
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Auction Not Found</h1>
        <Button onClick={() => router.push('/auctions')}>
          Back to Auctions
        </Button>
      </div>
    );
  }

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/auctions">Auctions</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/auction/${auctionId}`}>
              Current Auction
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Similar Auctions</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-8">Similar Auctions</h1>

      <AuctionFilter
        similarAuctions={similarAuctions}
        isLoading={isLoading}
        onLoadMore={handleLoadMore}
        hasMore={(similarAuctions?.length ?? 0) >= page * ITEMS_PER_PAGE}
      />
    </div>
  );
}