import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Auction as FeaturedAuctions } from "@prisma/client";
import Link from "next/link";

type FeaturedAuctionProps = {
  featuredAuctions: FeaturedAuctions[]; // Accept an array of auctions
};

export default function FeaturedAuction({
  featuredAuctions,
}: FeaturedAuctionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredAuctions.map((auction) => (
        <Card
          key={auction.id}
          className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700"
        >
          <Link href={`/auctions/${auction.id}`} className="block rounded-lg">
            <CardHeader>
              <CardTitle className="dark:text-white">{auction.title}</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="relative overflow-hidden rounded-md mb-4">
                <Image
                  src={auction.images[0]}
                  alt={auction.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-red-500/20 via-yellow-500/20 to-green-500/20 mix-blend-soft-light dark:mix-blend-screen" />
              </div>

              <div className="flex justify-between items-center">
                <Badge
                  variant="outline"
                  className="dark:text-gray-200 dark:border-gray-600"
                >
                  Ends: {new Date(auction.endDate).toLocaleDateString()}
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {auction.noOfLots} Lots
                </span>
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}
