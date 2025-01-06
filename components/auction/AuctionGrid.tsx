import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Auction as FeaturedAuctions } from "@/types/auction";
import Link from "next/link";

type FeaturedAuctionProps = {
  featuredAuctions: FeaturedAuctions[]; // Accept an array of auctions
};

export default function FeaturedAuction({
  featuredAuctions,
}: FeaturedAuctionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-semibold mb-6">Featured Auctions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredAuctions.map((auction) => (
          <Card key={auction.id} className="hovercard">
            <Link
              href={`/auction/featured/${auction.id}`}
              className="hover:border-wheat-500 hover:bg-gray-50 border transition duration-300 block rounded-lg"
            >
              <CardHeader>
                <CardTitle>{auction.title}</CardTitle>
              </CardHeader>

              <CardContent>
                {/* Use the auction.imageUrl and other properties */}
                <Image
                  src={auction.image}
                  alt={auction.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />

                <div className="flex justify-between items-center">
                  <Badge variant="outline">
                    Ends: {new Date(auction.endDate).toLocaleDateString()}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {auction.noOfLots} Lots
                  </span>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
