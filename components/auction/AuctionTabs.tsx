import { cn } from "@/lib/utils";
import { Auction } from "@/types/auction";
import { Lot } from "@/types/Lot";
import { useState } from "react";
import AuctionLotsTab from "./tabs/AuctionLotsTab";
import AuctionDetailsTab from "./tabs/AuctionDetailsTab";
import AuctionConditionsTab from "./tabs/AuctionConditionsTab";

interface FilterState {
  categories: string[];
  priceMin?: number;
  priceMax?: number;
  status: string[];
  search: string;
  sort: string;
  filterType: "all" | "open" | "my-bids" | "favorites";
  page: number;
  limit: number;
}

interface AuctionTabsProps {
  auction: Auction;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  processedLots: Lot[];
  onLotsDataChange: (filters: Partial<FilterState>) => void;
  isLoading: boolean;
}

type TabType = "lots" | "details" | "conditions";

export default function AuctionTabs({
  auction,
  currentPage,
  totalPages,
  onPageChange,
  processedLots,
  onLotsDataChange,
  isLoading,
}: AuctionTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("lots");

  const tabs = [
    { id: "lots", label: "LOTS" },
    { id: "details", label: "AUCTION DETAILS" },
    { id: "conditions", label: "CONDITIONS OF BUSINESS" },
  ] as const;

  return (
    <div className="w-full">
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

      <div className="py-6">
        {activeTab === "lots" && (
          <AuctionLotsTab
            lots={auction.lots}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            processedLots={processedLots}
            onLotsDataChange={onLotsDataChange}
            isLoading={isLoading}
          />
        )}

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
      </div>
    </div>
  );
}
