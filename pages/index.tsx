import FeaturedAuction from "@/components/auction/AuctionGrid";
import { Auction as FeaturedAuctions } from "@/types/auction";
import featuredAuctionsData from "@/data/auctions_detail.json";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const featuredAuctions: FeaturedAuctions[] = featuredAuctionsData.slice(
    0,
    3
  ) as FeaturedAuctions[];
  return (
    <section className="mb-12">
      <FeaturedAuction featuredAuctions={featuredAuctions} />

      <div className="mt-6 flex justify-end">
        <Link
          href="/auction/featured"
          className="flex items-center text-blue-500 hover:underline font-semibold"
        >
          More
          <ArrowRight className="ml-2 w-5 h-5" /> {/* Icon for the link */}
        </Link>
      </div>
    </section>
  );
}
