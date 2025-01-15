import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { useSearch } from "@/hooks/useSearch";
import { SearchFilters, SearchResponse } from "@/types/search";

interface SearchResultsProps {
  query: string;
  filters: SearchFilters;
  data: SearchResponse | null;
}

export default function SearchResults({
  query,
  filters,
  data,
}: SearchResultsProps) {
  // Filter results based on type
  const filteredResults = data?.results.filter(
    (result) =>
      filters.type === "all"
        ? true
        : result.type === filters.type.replace("s", "") // Convert 'auctions' to 'auction'
  );

  const displayData = filteredResults
    ? {
        ...data,
        results: filteredResults,
        total: filteredResults.length,
      }
    : null;

  if (
    !query.trim() &&
    !filters.categories.length &&
    !filters.status &&
    !filters.location
  ) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          Please enter search terms or apply filters
        </p>
      </div>
    );
  }

  const { isLoading, isError } = useSearch(query, filters);

  if (isLoading) {
    return <SearchSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          An error occurred while searching
        </p>
      </div>
    );
  }

  if (!displayData?.results?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No {filters.type === "all" ? "" : filters.type} found for "{query}"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Found {displayData.results.length} results for "{query}"
      </p>

      <div className="space-y-4">
        {displayData.results.map((result) => (
          <Card
            key={result.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <Link href={result.href}>
              <CardContent className="p-4 flex gap-4">
                {result.image && (
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={result.image}
                      alt={result.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold dark:text-white truncate">
                      {result.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {result.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                    {result.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    {result.currentBid && (
                      <span>
                        Current Bid: ${result.currentBid.toLocaleString()}
                      </span>
                    )}
                    {result.date && (
                      <span>
                        {formatDistance(new Date(result.date), new Date(), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                    {result.location && <span>{result.location}</span>}
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-4 flex gap-4">
            <Skeleton className="w-24 h-24 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
