import { GetServerSideProps } from "next";
import { PrismaClient, Auction, Category } from "@prisma/client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AuctionFilter from "@/components/auctions/AuctionFilter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import AuctionTabs from "@/components/auctions/AuctionTabs";

interface AuctionsPageProps {
  auctions: (Auction & {
    categories: (Category & { subcategories: any[] })[];
    lots: any[];
    _count: { lots: number };
  })[];
  categories: (Category & { subcategories: any[] })[];
  featuredImages: string[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient();

  try {
    const [auctions, categories] = await Promise.all([
      prisma.auction.findMany({
        include: {
          categories: {
            include: {
              subcategories: true,
            },
          },
          lots: true,
          _count: {
            select: {
              lots: true,
            },
          },
        },
        take: 10,
      }),
      prisma.category.findMany({
        include: {
          subcategories: true,
        },
      }),
    ]);

    const featuredImages = auctions
      .filter((a) => a.isFeatured && a.images.length > 0)
      .flatMap((a) => a.images);

    return {
      props: {
        auctions: JSON.parse(JSON.stringify(auctions)),
        categories: JSON.parse(JSON.stringify(categories)),
        featuredImages,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { 
      props: { 
        auctions: [], 
        categories: [], 
        featuredImages: [] 
      } 
    };
  } finally {
    await prisma.$disconnect();
  }
};

export default function AuctionsPage({
  auctions,
  categories,
  featuredImages,
}: AuctionsPageProps) {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Auctions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Auctions</h1>
        <p className="text-muted-foreground">
          Discover unique items and place your bids on our exclusive auctions.
        </p>
      </div>

      {/* Featured Images Carousel */}
      {featuredImages.length > 0 && (
        <Carousel className="w-full">
          <CarouselContent>
            {featuredImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-[21/9] relative rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`Featured auction ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}

      <AuctionFilter
        similarAuctions={auctions}
        isLoading={false}
        onLoadMore={() => {}}
        hasMore={false}
      />
    </div>
  );
}