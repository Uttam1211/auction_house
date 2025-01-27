import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import LotGrid from "@/components/auctions/LotGrid";
import { useAuction, useAuctions } from "@/hooks/useAuctions";
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
import Loading from "@/components/Loading";

export default function AuctionDetails() {
  const router = useRouter();
  const { auctionId } = router.query;
  const { auction, isLoading, isError } = useAuction(auctionId as string);

  if (!router.isReady) {
    return <Loading />;
  }

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

  if (isLoading) return <Loading />;

  if (!auction || isError) {
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
    <>
      <div className="container mx-auto px-4 py-4 md:py-8">
        <Breadcrumb className="mb-4 md:mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/auctions">Auctions</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{auction.title}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
          <div>
            <Image
              src={auction.image}
              alt={auction.title}
              width={600}
              height={400}
              className="w-full h-[300px] md:h-[400px] object-cover rounded-lg"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold">{auction.title}</h1>
            <p className="text-gray-600 text-sm md:text-base">
              {auction.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm md:text-base">
                  Start Date
                </h3>
                <p className="text-sm md:text-base">
                  {new Date(auction.startDate).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm md:text-base">End Date</h3>
                <p className="text-sm md:text-base">
                  {new Date(auction.endDate).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm md:text-base">
                  Auctioneer
                </h3>
                <p className="text-sm md:text-base">{auction.auctioneer}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm md:text-base">Location</h3>
                <p className="text-sm md:text-base">{auction.location}</p>
              </div>
            </div>
            <Button size="lg" className="w-full sm:w-auto">
              Register for Auction
            </Button>
          </div>
        </div>

        {auction && <AuctionTabs auction={auction} />}
      </div>
    </>
  );
}
