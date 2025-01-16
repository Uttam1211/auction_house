import { GetStaticProps } from "next";
import { PrismaClient } from "@prisma/client";
import FeaturedAuction from "@/components/auction/AuctionGrid";
import { Auction } from "@prisma/client";

export const getStaticProps: GetStaticProps = async () => {
  const prisma = new PrismaClient();

  try {
    const featuredAuctions = await prisma.auction.findMany({
      where: {
        isFeatured: true,
      },
      include: {
        lots: true,
        categories: true,
      },
    });

    return {
      props: {
        featuredAuctions: JSON.parse(JSON.stringify(featuredAuctions)),
      },
      revalidate: 3600, // fetch every 1 hour
    };
  } catch (error) {
    console.error("Error fetching auctions:", error);
    return {
      props: {
        featuredAuctions: [],
      },
      revalidate: 3600, // fetch every 1 hour
    };
  } finally {
    await prisma.$disconnect();
  }
};

interface FeaturedProps {
  featuredAuctions: Auction[];
}

export default function Featured({ featuredAuctions }: FeaturedProps) {
  return <FeaturedAuction featuredAuctions={featuredAuctions} />;
}
