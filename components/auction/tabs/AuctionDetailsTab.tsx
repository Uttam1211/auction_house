import { Auction } from "@/types/auction";

interface AuctionDetailsTabProps {
  auction: Auction;
}

export default function AuctionDetailsTab({ auction }: AuctionDetailsTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">
          About the Auction
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {auction.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold mb-4 text-foreground">
            Auction Details
          </h4>
          <ul className="space-y-3 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Start Date:</span>{" "}
              {new Date(auction.startDate).toLocaleString()}
            </li>
            <li>
              <span className="font-medium text-foreground">End Date:</span>{" "}
              {new Date(auction.endDate).toLocaleString()}
            </li>
            <li>
              <span className="font-medium text-foreground">Total Lots:</span>{" "}
              {auction.lots?.length || 0}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-foreground">
            Location & Contact
          </h4>
          <ul className="space-y-3 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Auctioneer:</span>{" "}
              {auction.auctioneer}
            </li>
            <li>
              <span className="font-medium text-foreground">Location:</span>{" "}
              {auction.location}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
