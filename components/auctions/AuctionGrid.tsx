import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Auction as FeaturedAuctions } from "@prisma/client";
import Link from "next/link";

type FeaturedAuctionProps = {
  featuredAuctions: FeaturedAuctions[]; // Accept an array of auctions
};

export default function AuctionGrid({
  featuredAuctions,
}: FeaturedAuctionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {featuredAuctions.map((auction) => (
        <Card
          key={auction.id}
          className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700"
        >
          <Link href={`/auctions/${auction.id}`} className="block">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl font-semibold line-clamp-2 dark:text-white">
                {auction.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="relative aspect-video overflow-hidden rounded-md mb-4">
                <Image
                  src={auction.images[0]}
                  alt={auction.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-red-500/20 via-yellow-500/20 to-green-500/20 mix-blend-soft-light dark:mix-blend-screen" />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                <Badge
                  variant="outline"
                  className="text-xs sm:text-sm dark:text-gray-200 dark:border-gray-600"
                >
                  Ends: {new Date(auction.endDate).toLocaleDateString()}
                </Badge>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {auction.noOfLots} Lots
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {auction.description}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">By </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {auction.auctioneer}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {auction.status}
                </Badge>
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}
