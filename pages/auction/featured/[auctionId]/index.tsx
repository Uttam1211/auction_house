import { useRouter } from "next/router";
import { notFound } from "next/navigation"; // For 404 handling
import Image from "next/image";
import { Button } from "@/components/ui/button";
import LotGrid from "@/components/auction/LotGrid";
import auctionsData from "@/data/auctions_detail.json";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedWithDialog from "@/components/ProtectedRedirectButton";

export default function AuctionDetails() {
  const router = useRouter();
  const { auctionId } = router.query;

  // Find the auction based on the dynamic route ID
  const auction = auctionsData.find((a) => a.id === auctionId);

  if (!auction) {
    // Redirect to a 404 page if the auction is not found
    return <p>Auction not found!</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-[120px]">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <Image
            src={auction.image}
            alt={auction.title}
            width={600}
            height={400}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{auction.title}</h1>
          <p className="text-gray-600 mb-4">{auction.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold">Start Date</h3>
              <p>{new Date(auction.startDate).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">End Date</h3>
              <p>{new Date(auction.endDate).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">Auctioneer</h3>
              <p>{auction.auctioneer}</p>
            </div>
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{auction.location}</p>
            </div>
          </div>
          <ProtectedWithDialog>
            <Button size="lg">Register for Auction</Button>
          </ProtectedWithDialog>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Auction Lots</h2>
      <LotGrid lots={auction.lots} />
    </div>
  );
}
