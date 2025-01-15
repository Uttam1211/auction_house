import FeaturedAuction from "@/components/auction/AuctionGrid";
import { Auction as FeaturedAuctions } from "@/types/auction";
import featuredAuctionsData from "@/data/auctions_detail.json";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import CategoryNav from "@/components/categories/CategoryNav";
import Image from "next/image";
import categoriesData from "@/data/categories.json";
import Newsletter from "@/components/marketing/Newsletter";
import Testimonials from "@/components/marketing/Testimonials";
import FeaturedLots from "@/components/auction/FeaturedLots";

export default function Home() {
  const featuredAuctions: FeaturedAuctions[] = featuredAuctionsData.slice(
    0,
    3
  ) as FeaturedAuctions[];

  return (
    <>
      {/* Hero Section */}
      <section className="relative mb-16 -mx-4 px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-100/5 via-transparent to-transparent dark:from-gray-800/5 dark:via-transparent dark:to-transparent" />
        <div className="relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Discover Exceptional Auctions
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Explore curated collections and bid on unique pieces from trusted
              sellers worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Featured Auctions Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold dark:text-white">
            Featured Auctions
          </h2>
          <Link
            href="/auction/featured"
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            View All Auctions
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
        <FeaturedAuction featuredAuctions={featuredAuctions} />
      </section>

      {/* Categories Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 dark:text-white">
          Explore Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesData.categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="group relative overflow-hidden rounded-lg aspect-square hover:shadow-lg transition-all duration-300"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-red-500/20 via-yellow-500/20 to-green-500/20 mix-blend-soft-light dark:mix-blend-screen" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-xl font-semibold transform group-hover:scale-105 transition-transform relative z-10">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Lots Carousel */}
      <FeaturedLots />

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}
