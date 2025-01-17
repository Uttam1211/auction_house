import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Grid, Hand, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import AuctionGrid from "@/components/auctions/AuctionGrid";
import { Auction, Status } from "@prisma/client";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {filterOptions.map((option) => (
            <Button
              key={option.id}
              variant="ghost"
              className={cn(
                "flex items-center gap-2",
                filterType === option.id && "bg-primary/10 text-primary"
              )}
              onClick={() => setFilterType(option.id as AuctionFilter)}
            >
              <option.icon className="w-4 h-4" />
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Input
            type="search"
            placeholder="Search auctions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="border rounded-md px-3 py-2"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="date-asc">End Date (Earliest)</option>
          <option value="date-desc">End Date (Latest)</option>
        </select>
      </div>

      <div className="text-sm text-muted-foreground">
        {filteredAuctions.length} similar auctions
      </div>

      <AuctionGrid featuredAuctions={filteredAuctions} />

      {hasMore && (
        <div className="text-center mt-8">
          <Button variant="outline" onClick={onLoadMore} disabled={isLoading}>
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
