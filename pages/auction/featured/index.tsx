import FeaturedAuction from "@/components/auction/AuctionGrid";
import { Auction as FeaturedAuctions } from "@/types/auction";
import featuredAuctionsData from "@/data/auctions_detail.json";

export default function featured() {
  const featuredAuctions: FeaturedAuctions[] =
    featuredAuctionsData as FeaturedAuctions[];
  return (
    <>
      <FeaturedAuction featuredAuctions={featuredAuctions} />
    </>
  );
}
