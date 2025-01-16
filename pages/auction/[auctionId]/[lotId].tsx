import { useRouter } from "next/router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import LotImageGallery from "@/components/lot/LotImageGallery";
import LotBidSection from "@/components/lot/LotBidSection";
import LotFilters from "@/components/lot/LotFilters";
import { useLot } from "@/hooks/useLot";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSimilarItems } from "@/hooks/useSimilarItems";
import { useState } from "react";
import { Category } from "@prisma/client";
import { LotWithCategories } from "@/types/combinationPrismaTypes";
export default function LotPage() {
  const router = useRouter();
  const { auctionId, lotId } = router.query;
  const {
    data: lot,
    isLoading,
    isError,
  } = useLot(auctionId as string, lotId as string);

  const ITEMS_PER_PAGE = 8;
  const [page, setPage] = useState(1);

  const { similarLots, isLoading: isLoadingSimilar } = useSimilarItems(
    auctionId as string,
    lotId as string,
    page,
    ITEMS_PER_PAGE
  );

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !lot) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Lot Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The lot you're looking for doesn't exist or has been removed.
        </p>
        <Button
          onClick={() => router.push(`/auction/${auctionId}`)}
          variant="default"
        >
          Back to Auction
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/auctions">Auctions</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/auction/${auctionId}`}>
              {lot.auction.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{lot.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <LotImageGallery images={lot.images} />

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{lot.title}</h1>
            <div className="flex flex-wrap gap-2">
              {lot.categories?.map((category: Category) => (
                <Badge key={category.id} variant="outline">
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          <LotBidSection
            incrementRate={lot.incrementRate}
            currentBid={lot.currentBid || 0}
            status={lot.status}
            bidHistory={lot.bidHistory || []}
          />

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details">
              <AccordionTrigger>Lot Details</AccordionTrigger>
              <AccordionContent>
                <div className="prose dark:prose-invert">
                  <p>{lot.description}</p>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-muted-foreground">
                        Dimensions
                      </dt>
                      <dd>
                        {lot.width && lot.height
                          ? `${lot.width} ${lot.unit} x ${lot.height} ${lot.unit}`
                          : ""}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">
                        Condition
                      </dt>
                      <dd>{lot.condition}</dd>
                    </div>
                  </dl>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="condition">
              <AccordionTrigger>Condition Report</AccordionTrigger>
              <AccordionContent>
                <p>{lot.condition}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping Information</AccordionTrigger>
              <AccordionContent>
                <p>{lot.provenance}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Filters and Similar Lots */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Similar Lots</h2>
        <LotFilters
          similarLots={similarLots as LotWithCategories[]}
          isLoading={isLoadingSimilar}
          onLoadMore={handleLoadMore}
          hasMore={(similarLots?.length ?? 0) >= page * ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
}
