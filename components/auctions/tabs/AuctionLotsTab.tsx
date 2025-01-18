import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Auction, Lot } from "@prisma/client";
import { Grid, List, Hand, Heart } from "lucide-react";
import { useLots } from "@/hooks/useLots";
import { cn } from "@/lib/utils";
import LotCard from "@/components/auctions/LotCard";
import FilterSidebar from "@/components/auctions/FilterSidebar";
import { LotWithCategories } from "@/types/combinationPrismaTypes";

type ViewMode = "grid" | "list";
type LotFilter = "all" | "open" | "my-bids" | "favorites";

interface AuctionLotsTabProps {
  auction: Auction;
}

export default function AuctionLotsTab({ auction }: AuctionLotsTabProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterType, setFilterType] = useState<LotFilter>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("price-desc");
  const [page, setPage] = useState(1);
  const limit = 6;

  // Use the useLots hook to fetch lots data
  const { lots, pagination, categories, subcategories, isLoading, isError } =
    useLots({
      auctionId: auction.id,
      page,
      limit,
      search: searchQuery,
      status: filterType === "open" ? "OPEN,UPCOMING" : undefined,
    });

  const filterOptions = [
    { id: "all", label: "All lots", icon: Grid },
    { id: "open", label: "Open lots", icon: Hand },
    { id: "my-bids", label: "My bids", icon: List },
    { id: "favorites", label: "Favorites", icon: Heart },
  ];

  const handleFilterApply = (filters: any) => {
    // Apply advanced filters here
    setIsFilterOpen(false);
    // Use setSearchQuery, setFilterType, setSortBy, etc., based on filters
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.id}
              variant="ghost"
              className={cn(
                "flex items-center gap-2 text-sm",
                filterType === option.id && "bg-primary/10 text-primary"
              )}
              onClick={() => setFilterType(option.id as LotFilter)}
            >
              <option.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{option.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            type="search"
            placeholder="Search lots"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2"
          >
            Filters
            <span className="text-xs bg-primary/10 px-2 py-1 rounded">
              Advanced
            </span>
          </Button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>

          <div className="flex gap-1 border rounded-md p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("grid")}
              className={cn(
                viewMode === "grid" && "bg-primary/10 text-primary"
              )}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("list")}
              className={cn(
                viewMode === "list" && "bg-primary/10 text-primary"
              )}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground px-1">
        {isLoading
          ? "Loading lots..."
          : isError
          ? "Failed to load lots."
          : `${pagination?.totalRecords || 0} results for "${
              searchQuery || "all lots"
            }" sorted by ${sortBy.replace("-", " ")}`}
      </div>

      {/* Lots Grid/List */}
      <div
        className={cn(
          "grid gap-4 md:gap-6",
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        )}
      >
        {lots?.map((lot: LotWithCategories) => (
          <LotCard key={lot.id} lot={lot} viewMode={viewMode} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          size="sm"
          disabled={pagination?.currentPage === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={pagination?.currentPage === pagination?.totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={() => {}}
      />
    </div>
  );
}
