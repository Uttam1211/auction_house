import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { SearchFilters } from "@/types/search";
import categoriesData from "@/data/categories.json"; // Import categories data

interface AdvancedFiltersProps {
  currentFilters: SearchFilters;
  onApply: (filters: SearchFilters) => void;
}

export default function AdvancedFilters({
  currentFilters,
  onApply,
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>(currentFilters);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, categoryId]
        : prev.categories.filter((id) => id !== categoryId),
    }));
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      categories: [],
      priceRange: [0, 1000000] as [number, number],
      status: null,
      location: null,
      sortBy: "relevance",
      type: "all",
    };
    setFilters(resetFilters);
    onApply(resetFilters);
  };

  return (
    <div className="bg-card p-6 rounded-lg border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Price Range */}
        <div>
          <label className="text-sm font-medium mb-2 block dark:text-gray-200">
            Price Range
          </label>
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  priceRange: [value[0], value[1]] as [number, number],
                })
              }
              max={100000}
              step={1000}
              className="mt-2"
            />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priceRange: [+e.target.value, filters.priceRange[1]],
                  })
                }
                className="w-24"
              />
              <span>to</span>
              <Input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priceRange: [filters.priceRange[0], +e.target.value],
                  })
                }
                className="w-24"
              />
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="text-sm font-medium mb-2 block dark:text-gray-200">
            Sort By
          </label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {filters.type === "lots" ? (
                <>
                  <SelectItem value="bid-asc">
                    Starting Bid: Low to High
                  </SelectItem>
                  <SelectItem value="bid-desc">
                    Starting Bid: High to Low
                  </SelectItem>
                </>
              ) : filters.type === "events" ? (
                <>
                  <SelectItem value="date-asc">Date: Earliest First</SelectItem>
                  <SelectItem value="date-desc">Date: Latest First</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium mb-2 block dark:text-gray-200">
            Status
          </label>
          <Select
            value={filters.status || "any"}
            onValueChange={(value) =>
              setFilters({ ...filters, status: value === "any" ? null : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium mb-2 block dark:text-gray-200">
            Location
          </label>
          <Select
            value={filters.location || "any"}
            onValueChange={(value) =>
              setFilters({
                ...filters,
                location: value === "any" ? null : value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any location</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
              <SelectItem value="americas">Americas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Categories */}
      <Accordion type="single" collapsible className="mt-6">
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categoriesData.categories.map((category) => (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category.id, checked as boolean)
                      }
                    />
                    <label htmlFor={category.id}>{category.name}</label>
                  </div>
                  <div className="ml-6 space-y-1">
                    {category.subcategories.map((sub) => (
                      <div key={sub.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={sub.id}
                          checked={filters.categories.includes(sub.id)}
                          onCheckedChange={(checked) =>
                            handleCategoryChange(sub.id, checked as boolean)
                          }
                        />
                        <label htmlFor={sub.id}>{sub.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={() => onApply(filters)}>Apply Filters</Button>
      </div>
    </div>
  );
}
