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
import { Lot as PrismaLot, Status, Category } from "@prisma/client";
import { ArrowRight } from "lucide-react";

interface CategoryWithSub extends Category {
  subcategories?: { id: string; name: string }[];
}

interface LotWithCategories extends PrismaLot {
  categories: CategoryWithSub[];
}

export default function FeaturedLots() {
  const { auctions: lots, isLoading } = useAuctions({
    isFeatured: true,
    limit: 5,
  });

  return (
    <section className="py-8 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold dark:text-white mb-3 sm:mb-0">
            Trending Lots
          </h2>
          <Link
            href="/lots"
            className="text-primary hover:text-primary/80 transition-colors text-sm sm:text-base flex items-center"
          >
            View all lots
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 sm:-ml-4">
            {lots?.map((lot: LotWithCategories) => (
              <CarouselItem
                key={lot.id}
                className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <Link href={`/auctions/${lot.auctionId}/lot/${lot.id}`}>
                  <Card className="mx-0 sm:mx-2 hover:shadow-lg transition-all duration-300">
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
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors" />
                        </button>
                      </div>

                      <div className="p-3 sm:p-4">
                        <h3 className="font-semibold text-base sm:text-lg mb-2 dark:text-white line-clamp-2">
                          {lot.title}
                        </h3>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-3">
                          <Badge
                            variant="secondary"
                            className="text-xs sm:text-sm"
                          >
                            Current Bid: ${lot.currentBid?.toLocaleString()}
                          </Badge>
                          <span className="text-xs sm:text-sm text-gray-500">
                            {lot.status === Status.OPEN ? "Active" : "Ended"}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {[
                            ...lot.categories?.map((cat: CategoryWithSub) => ({
                              id: cat.id,
                              name: cat.name,
                            })),
                            ...lot.categories?.flatMap(
                              (cat: CategoryWithSub) => cat.subcategories ?? []
                            ),
                          ]
                            .slice(0, 3)
                            .map((item) => (
                              <Badge
                                key={item.id}
                                variant="outline"
                                className="text-xs whitespace-nowrap"
                              >
                                {item.name}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
