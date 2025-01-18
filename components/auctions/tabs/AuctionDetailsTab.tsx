import { Auction } from "@prisma/client";

interface AuctionDetailsTabProps {
  auction: Auction;
}

export default function AuctionDetailsTab({ auction }: AuctionDetailsTabProps) {
  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-foreground">
          About the Auction
        </h3>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          {auction.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-foreground">
            Auction Details
          </h4>
          <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-muted-foreground">
            <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-medium text-foreground">Start Date:</span>
              {new Date(auction.startDate).toLocaleString()}
            </li>
            <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-medium text-foreground">End Date:</span>
              {new Date(auction.endDate).toLocaleString()}
            </li>
            <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-medium text-foreground">Total Lots:</span>
              {0}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-foreground">
            Location & Contact
          </h4>
          <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-muted-foreground">
            <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-medium text-foreground">Auctioneer:</span>
              {auction.auctioneer}
            </li>
            <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-medium text-foreground">Location:</span>
              {auction.location}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
