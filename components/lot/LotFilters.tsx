import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Grid, Hand, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import LotCard from "@/components/auctions/LotCard";
import { Status } from "@prisma/client";
import { LotWithCategories } from "@/types/combinationPrismaTypes";

interface LotFiltersProps {
  similarLots?: LotWithCategories[];
  isLoading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

type LotFilter = "all" | "open" | "closed";
type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

export default function LotFilters({
  similarLots = [],
  isLoading,
  onLoadMore,
  hasMore,
}: LotFiltersProps) {
  const [filterType, setFilterType] = useState<LotFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [filteredLots, setFilteredLots] =
    useState<LotWithCategories[]>(similarLots);

  useEffect(() => {
    let result = [...similarLots];

    // Apply status filter
    if (filterType !== "all") {
      result = result.filter((lot) => {
        if (filterType === "open") {
          return lot.status === Status.OPEN || lot.status === Status.UPCOMING;
        }
        return lot.status === Status.CLOSED;
      });
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (lot) =>
          lot.title?.toLowerCase().includes(query) ||
          lot.artist?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return (a.title ?? "").localeCompare(b.title ?? "");
        case "name-desc":
          return (b.title ?? "").localeCompare(a.title ?? "");
        case "price-asc":
          return (a.startingBid ?? 0) - (b.startingBid ?? 0);
        case "price-desc":
          return (b.startingBid ?? 0) - (a.startingBid ?? 0);
        default:
          return 0;
      }
    });

    setFilteredLots(result);
  }, [similarLots, filterType, searchQuery, sortBy]);

  const filterOptions = [
    { id: "all", label: "All lots", icon: Grid },
    { id: "open", label: "Open lots", icon: Hand },
    { id: "closed", label: "Closed lots", icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls */}
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
              onClick={() => setFilterType(option.id as LotFilter)}
            >
              <option.icon className="w-4 h-4" />
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Input
            type="search"
            placeholder="Search by title or artist..."
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
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredLots.length} similar lots
      </div>

      {/* Lots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredLots.map((lot) => (
          <LotCard
            key={`${lot.auctionId}-${lot.id}`}
            lot={lot}
            viewMode="grid"
          />
        ))}
      </div>

      {/* Load More Button */}
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
