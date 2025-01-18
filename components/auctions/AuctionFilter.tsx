import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Grid, Hand, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import AuctionGrid from "@/components/auctions/AuctionGrid";
import { Auction, Status } from "@prisma/client";
import Loading from "../Loading";

interface AuctionFilterProps {
  similarAuctions?: Auction[];
  isLoading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

type AuctionFilter = "all" | "active" | "ended";
type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc";

export default function AuctionFilter({
  similarAuctions = [],
  isLoading,
  onLoadMore,
  hasMore,
}: AuctionFilterProps) {
  const [filterType, setFilterType] = useState<AuctionFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [filteredAuctions, setFilteredAuctions] =
    useState<Auction[]>(similarAuctions);

  useEffect(() => {
    let result = [...similarAuctions];

    // Apply status filter
    if (filterType !== "all") {
      result = result.filter((auction) => {
        if (filterType === "active") {
          return (
            auction.status === Status.OPEN || auction.status === Status.UPCOMING
          );
        }
        return auction.status === Status.CLOSED;
      });
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (auction) =>
          auction.title.toLowerCase().includes(query) ||
          auction.auctioneer.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "date-asc":
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        case "date-desc":
          return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
        default:
          return 0;
      }
    });

    setFilteredAuctions(result);
  }, [similarAuctions, filterType, searchQuery, sortBy]);

  const filterOptions = [
    { id: "all", label: "All auctions", icon: Grid },
    { id: "active", label: "Active auctions", icon: Hand },
    { id: "ended", label: "Ended auctions", icon: Clock },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {filterOptions.map((option) => (
            <Button
              key={option.id}
              variant="ghost"
              className={cn(
                "flex items-center gap-2 text-sm py-2 px-3 sm:px-4",
                filterType === option.id && "bg-primary/10 text-primary"
              )}
              onClick={() => setFilterType(option.id as AuctionFilter)}
            >
              <option.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{option.label}</span>
              <span className="sm:hidden">{option.label.split(" ")[0]}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            type="search"
            placeholder="Search auctions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="border rounded-md px-3 py-2 text-sm bg-background"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="date-asc">End Date (Earliest)</option>
          <option value="date-desc">End Date (Latest)</option>
        </select>
      </div>

      <div className="text-sm text-muted-foreground px-1">
        {filteredAuctions.length} similar auctions
      </div>

      <AuctionGrid featuredAuctions={filteredAuctions} />

      {hasMore && (
        <div className="text-center mt-6 md:mt-8">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? <Loading /> : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
