import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lot, Status } from "@prisma/client";
import { Grid, List, Hand, Heart } from "lucide-react";
import FilterSidebar from "@/components/auctions/FilterSidebar";
import { cn } from "@/lib/utils";
import LotCard from "@/components/auctions/LotCard";
import { FilterState } from "@/types/filters";
import { LotWithCategories } from "@/types/combinationPrismaTypes";
interface AuctionLotsTabProps {
  processedLots: LotWithCategories[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLotsDataChange: (filters: Partial<FilterState>) => void;
  isLoading: boolean;
}

type ViewMode = "grid" | "list";
type LotFilter = "all" | "open" | "my-bids" | "favorites";

export default function AuctionLotsTab({
  processedLots,
  currentPage,
  totalPages,
  onPageChange,
  onLotsDataChange,
  isLoading,
}: AuctionLotsTabProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterType, setFilterType] = useState<LotFilter>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("lot-number-asc");
  const [filteredResults, setFilteredResults] =
    useState<LotWithCategories[]>(processedLots);

  const filterOptions = [
    { id: "all", label: "All lots", icon: Grid },
    { id: "open", label: "Open lots", icon: Hand },
    { id: "my-bids", label: "My bids", icon: List },
    { id: "favorites", label: "Favorites", icon: Heart },
  ];

  useEffect(() => {
    let result = [...processedLots];

    // Apply filter type
    if (filterType !== "all") {
      result = result.filter((lot) => {
        switch (filterType) {
          case "open":
            return lot.status === Status.OPEN || lot.status === Status.UPCOMING;
          case "my-bids":
            return ""; // Assuming you have this property
          case "favorites":
            return ""; // Assuming you have this property
          default:
            return true;
        }
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

    // Instead of calling onLotsDataChange directly, only update when filters change
    if (filterType !== "all" || searchQuery || sortBy !== "lot-number-asc") {
      onLotsDataChange({
        filterType,
        search: searchQuery,
        sort: sortBy,
      });
    }

    setFilteredResults(result);
  }, [filterType, searchQuery, sortBy]); // Remove onLotsDataChange and lots from dependencies

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

      {/* Search and Filter Controls */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2"
        >
          Filters
          <span className="text-xs bg-primary/10 px-2 py-1 rounded">3</span>
        </Button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>

        <div className="flex gap-2 border rounded-md p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("grid")}
            className={cn(viewMode === "grid" && "bg-primary/10 text-primary")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("list")}
            className={cn(viewMode === "list" && "bg-primary/10 text-primary")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredResults.length} results sorted by {sortBy.replace("-", " ")}
      </div>

      {/* Lots Grid/List */}
      <div
        className={cn(
          "grid gap-6",
          viewMode === "grid" ? "grid-cols-3" : "grid-cols-1"
        )}
      >
        {filteredResults.map((lot) => (
          <LotCard key={lot.id} lot={lot} viewMode={viewMode} />
        ))}
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
}
