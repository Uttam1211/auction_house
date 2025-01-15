import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lot } from "@/types/Lot";
import { Grid, List, Hand, Heart } from "lucide-react";
import FilterSidebar from "@/components/auction/FilterSidebar";
import { cn } from "@/lib/utils";
import LotCard from "@/components/auction/LotCard";
import { FilterState } from "@/types/filters";
interface AuctionLotsTabProps {
  lots: Lot[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  processedLots: Lot[];
  onLotsDataChange: (filters: Partial<FilterState>) => void;
  isLoading: boolean;
  auctionId: string;
}

type ViewMode = "grid" | "list";
type LotFilter = "all" | "open" | "my-bids" | "favorites";

export default function AuctionLotsTab({
  lots,
  currentPage,
  totalPages,
  onPageChange,
  processedLots,
  onLotsDataChange,
  isLoading,
  auctionId,
}: AuctionLotsTabProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterType, setFilterType] = useState<LotFilter>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("lot-number-asc");

  const filterOptions = [
    { id: "all", label: "All lots", icon: Grid },
    { id: "open", label: "Open lots", icon: Hand },
    { id: "my-bids", label: "My bids", icon: List },
    { id: "favorites", label: "Favorites", icon: Heart },
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
          <option value="lot-number-asc">Lot number (low to high)</option>
          <option value="lot-number-desc">Lot number (high to low)</option>
          <option value="estimate-asc">Estimate (low to high)</option>
          <option value="estimate-desc">Estimate (high to low)</option>
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
        {processedLots.length} results sorted by {sortBy.replace("-", " ")}
      </div>

      {/* Lots Grid/List */}
      <div
        className={cn(
          "grid gap-6",
          viewMode === "grid" ? "grid-cols-3" : "grid-cols-1"
        )}
      >
        {processedLots.map((lot) => (
          <LotCard
            key={lot.id}
            lot={lot}
            viewMode={viewMode}
            auctionId={auctionId}
          />
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
