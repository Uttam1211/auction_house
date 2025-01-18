import { GetStaticProps } from "next";
import { PrismaClient } from "@prisma/client";
import FeaturedAuction from "@/components/auctions/AuctionGrid";
import { Auction, Category } from "@prisma/client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Newsletter from "@/components/marketing/Newsletter";
import Testimonials from "@/components/marketing/Testimonials";
import FeaturedLots from "@/components/auctions/FeaturedLots";
import PublicLayout from "@/components/layouts/PublicLayout";
import { CategoryWithSubcategories } from "@/types/combinationPrismaTypes";
import CategoryNav from "@/components/categories/CategoryNav";
import Header from "@/components/Header";
import Footer from "@/components/footer/Footer";
import { ReactElement } from "react";
// Define the props type for the Home component
interface HomeProps {
  featuredAuctions: Auction[];
  categories: CategoryWithSubcategories[];
}

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
        take: 3,
      }),
      prisma.category.findMany({
        include: {
          subcategories: true,
        },
      }),
    ]);

    return {
      props: {
        featuredAuctions: JSON.parse(JSON.stringify(featuredAuctions)),
        categories: JSON.parse(JSON.stringify(categories)),
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        featuredAuctions: [],
        categories: [],
      },
      revalidate: 3600,
    };
  } finally {
    await prisma.$disconnect();
  }
};

export default function Home({ featuredAuctions, categories }: HomeProps) {
  return (
    <>
      <CategoryNav categories={categories} />

      {/* Hero Section */}
      <section className="relative mb-8 sm:mb-16 -mx-4 px-4 py-12 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-100/5 via-transparent to-transparent dark:from-gray-800/5 dark:via-transparent dark:to-transparent" />
        <div className="relative">
          <div className="text-center max-w-3xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white leading-tight">
              Discover Exceptional Auctions
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Explore curated collections and bid on unique pieces from trusted
              sellers worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Featured Auctions Section */}
      <section className="mb-8 sm:mb-16 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold dark:text-white">
            Featured Auctions
          </h2>
          <Link
            href="/auctions/featured"
            className="flex items-center text-primary hover:text-primary/80 transition-colors text-sm sm:text-base"
          >
            View All Auctions
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
        <FeaturedAuction featuredAuctions={featuredAuctions} />
      </section>

      {/* Featured Lots Section */}
      <section className="mb-8 sm:mb-16">
        <FeaturedLots />
      </section>

      {/* Testimonials Section */}
      <section className="mb-8 sm:mb-16 px-4 sm:px-6">
        <Testimonials />
      </section>

      {/* Newsletter Section */}
      <section className="mb-8 sm:mb-16 px-4 sm:px-6">
        <Newsletter />
      </section>
    </>
  );
}
