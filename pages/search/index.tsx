import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SearchResults from "@/components/search/SearchResults";
import AdvancedFilters from "@/components/search/AdvancedFilters";
import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/router";
import { SearchFilters } from "@/types/search";
import { useSearch } from "@/hooks/useSearch";
import { GetServerSideProps } from "next";
import { PrismaClient, Subcategory } from "@prisma/client";
import { Category } from "@prisma/client";
import Loading from "@/components/Loading";

interface SearchPageProps {
  categoriesData: Category[];
  subcategoriesData: Subcategory[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient();

  try {
    const categories = await prisma.category.findMany({
      include: { subcategories: true },
    });

    return {
      props: {
        categoriesData: JSON.parse(JSON.stringify(categories)),
      },
    };
  } finally {
    await prisma.$disconnect();
  }
};

export default function SearchPage({
  categoriesData,
  subcategoriesData,
}: SearchPageProps) {
  const router = useRouter();
  const { q: initialQuery, type: initialType } = router.query;
  const [searchQuery, setSearchQuery] = useState(
    initialQuery ? String(initialQuery).replace(/['"]/g, "") : ""
  );
  const [activeTab, setActiveTab] = useState((initialType as string) || "all");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    priceRange: [0, 1000000],
    status: null,
    location: null,
    sortBy: "relevance",
    type: activeTab as "all" | "auction" | "lot" | "event" | "contact",
  });

  const { data, isLoading, isError } = useSearch(searchQuery, filters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() && !hasActiveFilters(filters)) return;

    const query: Record<string, string> = {};

    // Only add non-empty search query
    if (searchQuery.trim()) {
      query.q = searchQuery;
    }

    // Only add non-default filter values
    if (filters.type !== "all") {
      query.type = filters.type;
    }
    if (filters.categories.length > 0) {
      query.categories = filters.categories.join(",");
    }
    if (filters.status !== null) {
      query.status = filters.status;
    }
    if (filters.location !== null) {
      query.location = filters.location;
    }
    if (filters.sortBy !== "relevance") {
      query.sortBy = filters.sortBy;
    }
    if (filters.priceRange[0] > 0) {
      query.minPrice = filters.priceRange[0].toString();
    }
    if (filters.priceRange[1] < 1000000) {
      query.maxPrice = filters.priceRange[1].toString();
    }

    router.push({
      pathname: "/search",
      query,
    });
  };

  // Helper function to check if any non-default filters are active
  const hasActiveFilters = (filters: SearchFilters): boolean => {
    return (
      filters.type !== "all" ||
      filters.categories.length > 0 ||
      filters.status !== null ||
      filters.location !== null ||
      filters.sortBy !== "relevance" ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 1000000
    );
  };

  const handleFilterApply = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    handleSearch(new Event("submit") as any);
  };

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(
        decodeURIComponent(String(initialQuery).replace(/['"]/g, ""))
      );
    }
    if (initialType) {
      setActiveTab(String(initialType));
    }
  }, [initialQuery, initialType]);

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="space-y-4 md:space-y-6">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              type="search"
              placeholder="Search auctions, lots, events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Button
            variant="outline"
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full sm:w-auto"
          >
            <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Filters
          </Button>
        </form>

        {showFilters && (
          <div className="rounded-lg border bg-card p-4 md:p-6">
            <AdvancedFilters
              categoriesData={categoriesData}
              subcategoriesData={subcategoriesData}
              currentFilters={filters}
              onApply={handleFilterApply}
            />
          </div>
        )}
      </div>

      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="mt-6 md:mt-8"
      >
        <TabsList className="mb-6 md:mb-8 w-full flex overflow-x-auto no-scrollbar">
          <TabsTrigger value="all" className="flex-1">
            All Results
          </TabsTrigger>
          <TabsTrigger value="auctions" className="flex-1">
            Auctions
          </TabsTrigger>
          <TabsTrigger value="lots" className="flex-1">
            Lots
          </TabsTrigger>
          <TabsTrigger value="events" className="flex-1">
            Events
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex-1">
            Contacts
          </TabsTrigger>
        </TabsList>

        <div className="space-y-4 md:space-y-6">
          <TabsContent value="all">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loading />
              </div>
            ) : isError ? (
              <div className="text-center py-8 text-red-500">
                Error loading results
              </div>
            ) : (
              <SearchResults
                query={searchQuery}
                filters={filters}
                data={data || null}
              />
            )}
          </TabsContent>

          <TabsContent value="auctions">
            <SearchResults
              query={searchQuery}
              filters={{ ...filters, type: "auction" }}
              data={data || null}
            />
          </TabsContent>
          <TabsContent value="lots">
            <SearchResults
              query={searchQuery}
              filters={{ ...filters, type: "lot" }}
              data={data || null}
            />
          </TabsContent>
          <TabsContent value="events">
            <SearchResults
              query={searchQuery}
              filters={{ ...filters, type: "event" }}
              data={data || null}
            />
          </TabsContent>
          <TabsContent value="contacts">
            <SearchResults
              query={searchQuery}
              filters={{ ...filters, type: "contact" }}
              data={data || null}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
