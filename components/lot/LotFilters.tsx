import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LotFilters() {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Input
        placeholder="Search lots..."
        className="w-full md:w-auto md:flex-1"
      />
      <Select defaultValue="price-asc">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="lot-number">Lot Number</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline">Filter</Button>
    </div>
  );
}
