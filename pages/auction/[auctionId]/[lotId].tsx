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

export default function LotPage() {
  const router = useRouter();
  const { auctionId, lotId } = router.query;
  const { data: lot, isLoading } = useLot(auctionId as string, lotId as string);

  if (isLoading) return <div>Loading...</div>;
  if (!lot) return <div>Lot not found</div>;

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
              {lot.auctionTitle}
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
              {lot.categories.map((category: string) => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <LotBidSection
  currentBid={lot.currentBid}
  nextMinimumBid={lot.nextMinimumBid || lot.currentBid + 100} // Fallback increment
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
                      <dd>{lot.dimensions}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Weight</dt>
                      <dd>{lot.weight}</dd>
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
                <p>{lot.shippingInfo}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Filters and Similar Lots */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Similar Lots</h2>
        <LotFilters />
        {/* Similar lots grid */}
      </div>
    </div>
  );
}
