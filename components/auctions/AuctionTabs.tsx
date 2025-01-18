import { cn } from "@/lib/utils";
import { Auction, Lot } from "@prisma/client";
import { useState } from "react";
import AuctionLotsTab from "./tabs/AuctionLotsTab";
import AuctionDetailsTab from "./tabs/AuctionDetailsTab";
import AuctionConditionsTab from "./tabs/AuctionConditionsTab";
import AuctionSimilarTab from "./tabs/AuctionSimilarTab";

interface AuctionTabsProps {
  auction: Auction;
}

type TabType = "lots" | "details" | "conditions" | "similar";

export default function AuctionTabs({ auction }: AuctionTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("lots");

  const tabs = [
    { id: "lots", label: "LOTS" },
    { id: "details", label: "AUCTION DETAILS" },
    { id: "conditions", label: "CONDITIONS OF BUSINESS" },
    { id: "similar", label: "SIMILAR AUCTIONS" },
  ] as const;

  return (
    <div className="w-full">
      <div className="sticky top-0 bg-background z-10 my-2">
        <div className="border-b border-border mb-8">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-4 text-muted-foreground font-medium transition-colors relative",
                  activeTab === tab.id && "text-primary",
                  "hover:text-primary"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="py-6">
        {activeTab === "lots" && <AuctionLotsTab auction={auction} />}

        {activeTab === "details" && (
          <div className="max-w-4xl">
            <AuctionDetailsTab auction={auction} />
          </div>
        )}

        {activeTab === "conditions" && (
          <div className="max-w-4xl">
            <AuctionConditionsTab />
          </div>
        )}

        {activeTab === "similar" && (
          <div className="max-w-4xl">
            <AuctionSimilarTab auctionId={auction.id} />
          </div>
        )}
      </div>
    </div>
  );
}
