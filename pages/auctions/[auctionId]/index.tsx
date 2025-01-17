import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import LotGrid from "@/components/auctions/LotGrid";
import { useAuctions } from "@/hooks/useAuctions";
import { useState } from "react";
import TableControls from "@/components/table/TableControls";
import { Lot } from "@prisma/client";
import AuctionTabs from "@/components/auctions/AuctionTabs";
import { useAuctionFilters } from "@/hooks/useAuctionFilters";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AuctionDetails() {
  const router = useRouter();
  const { auctionId } = router.query;
  const { filters, updateFilters } = useAuctionFilters();

  const { auction, lots, pagination, isLoading } = useAuctions({
    auctionId: auctionId as string,
    ...filters,
  });

  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    updateFilters(newFilters);
  };

  const sortFields = [
    { value: "title" as keyof Lot, label: "Title" },
    { value: "artist" as keyof Lot, label: "Artist" },
    { value: "currentBid" as keyof Lot, label: "Current Bid" },
    { value: "estimatedPrice" as keyof Lot, label: "Estimated Price" },
  ];

  const filterFields = [
    { value: "title" as keyof Lot, label: "Title" },
    { value: "artist" as keyof Lot, label: "Artist" },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!auction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Auction not found!</p>
        <Button onClick={() => router.push("/auctions/featured")}>
          Back to Featured Auctions
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 ">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/auctions">Auctions</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{auction.title}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <Image
            src={auction.image}
            alt={auction.title}
            width={600}
            height={400}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{auction.title}</h1>
          <p className="text-gray-600 mb-4">{auction.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold">Start Date</h3>
              <p>{new Date(auction.startDate).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">End Date</h3>
              <p>{new Date(auction.endDate).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">Auctioneer</h3>
              <p>{auction.auctioneer}</p>
            </div>
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{auction.location}</p>
            </div>
          </div>
          <Button size="lg">Register for Auction</Button>
        </div>
      </div>

      {auction && (
        <AuctionTabs
          auction={auction}
          currentPage={filters.page}
          totalPages={pagination?.totalPages || 1}
          onPageChange={handlePageChange}
          processedLots={lots}
          onLotsDataChange={handleFilterChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
