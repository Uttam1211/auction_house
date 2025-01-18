import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export default function FilterSidebar({ isOpen, onClose, onApply }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  
  const categories = [
    "Paintings",
    "Sculptures",
    "Photography",
    "Prints",
    "Works on Paper",
    "Design",
    "Jewelry",
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-medium">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox id={category} />
                  <Label htmlFor={category}>{category}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <h4 className="font-medium">Price Range</h4>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={0}
              max={100000}
              step={1000}
            />
            <div className="flex justify-between text-sm">
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h4 className="font-medium">Status</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="active" />
                <Label htmlFor="active">Active Bidding</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="upcoming" />
                <Label htmlFor="upcoming">Upcoming</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="closed" />
                <Label htmlFor="closed">Closed</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Clear All
          </Button>
          <Button className="flex-1">Apply Filters</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
} 