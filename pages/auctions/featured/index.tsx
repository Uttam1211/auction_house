import { GetStaticProps } from "next";
import { Category, PrismaClient } from "@prisma/client";
import FeaturedAuction from "@/components/auctions/AuctionGrid";
import { Auction } from "@prisma/client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AuctionFilter from "@/components/auctions/AuctionFilter";

export const getStaticProps: GetStaticProps = async () => {
  const prisma = new PrismaClient();

  try {
    const [featuredAuctions, categories] = await Promise.all([
      prisma.auction.findMany({
        where: {
          isFeatured: true,
        },
      include: {
          lots: true,
          categories: true,
        },
      }),
      prisma.category.findMany({
        include: { subcategories: true },
      }),
    ]);

    return {
      props: {
        featuredAuctions: JSON.parse(JSON.stringify(featuredAuctions)),
        categories: JSON.parse(JSON.stringify(categories)),
        totalCount: featuredAuctions.length,
      },
      revalidate: 3600, // fetch every 1 hour
    };
  } catch (error) {
    console.error("Error fetching auctions:", error);
    return {
      props: {
        featuredAuctions: [],
        categories: [],
        totalCount: 0,
      },
      revalidate: 3600, // fetch every 1 hour
    };
  } finally {
    await prisma.$disconnect();
  }
};

interface FeaturedProps {
  featuredAuctions: Auction[];
  categories: Category[];
  totalCount: number;
}
const ITEMS_PER_PAGE = 8;
let page = 1;

const handleLoadMore = () => {
  page++;
};

export default function Featured({
  featuredAuctions,
  categories,
  totalCount,
}: FeaturedProps) {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/auctions">Auctions</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Featured Auctions</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-semibold mb-4">Featured Auctions</h1>
      <p className="text-gray-600 mb-8">
        Discover our curated selection of featured auctions, showcasing the best
        of our collection.
      </p>
      <AuctionFilter
        similarAuctions={featuredAuctions}
        isLoading={false}
        onLoadMore={handleLoadMore}
        hasMore={(featuredAuctions?.length ?? 0) >= page * ITEMS_PER_PAGE}
      />
    </div>
  );
}
