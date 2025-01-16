import { useAuctions } from "@/hooks/useAuctions";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Lot, Status } from "@prisma/client";

export default function FeaturedLots() {
  const { lots } = useAuctions({ featured: true, limit: 5 });

  return (
    <section className="py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold dark:text-white">Trending Lots</h2>
        <Link
          href="/lots"
          className="text-primary hover:text-primary/80 transition-colors"
        >
          View all lots →
        </Link>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {lots?.map((lot: Lot) => (
            <CarouselItem key={lot.id} className="md:basis-1/2 lg:basis-1/3">
              <Link href={`/auction/${lot.auctionId}/lot/${lot.id}`}>
                <Card className="mx-2 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <Image
                        src={lot.images[0]}
                        alt={lot.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                      <button
                        className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to favorites logic here
                        }}
                      >
                        <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 dark:text-white">
                        {lot.title}
                      </h3>
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary">
                          Current Bid: ${lot.currentBid?.toLocaleString()}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {lot.status === Status.OPEN ? "Active" : "Ended"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
