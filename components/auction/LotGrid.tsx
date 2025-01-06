import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Lot {
  id: string;
  title: string;
  artist: string;
  estimatedPrice: string;
  currentBid: number;
  image: string;
}

interface LotGridProps {
  lots: Lot[];
}

export default function LotGrid({ lots }: LotGridProps) {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State for sorting
  const [sortField, setSortField] = useState<"title" | "currentBid">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Calculate the total number of pages
  const totalPages = Math.ceil(lots.length / itemsPerPage);

  // Sort the lots
  const sortedLots = [...lots].sort((a, b) => {
    if (sortField === "title") {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    if (sortField === "currentBid") {
      return sortOrder === "asc" ? a.currentBid - b.currentBid : b.currentBid - a.currentBid;
    }
    return 0;
  });

  // Get the lots for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLots = sortedLots.slice(startIndex, startIndex + itemsPerPage);

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <section>
      <div className="mb-4 flex justify-between items-center">
        {/* Sorting Controls */}
        <div>
          <label className="mr-2 font-semibold">Sort by:</label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as "title" | "currentBid")}
            className="border rounded-md p-1 mr-2"
          >
            <option value="title">Name</option>
            <option value="currentBid">Current Bid</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="border rounded-md p-1"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {/* Pagination Controls */}
        <div>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="mr-2 px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Grid of Lots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedLots.map((lot) => (
          <Card key={lot.id} className="hovercard">
            <CardHeader>
              <CardTitle className="text-lg">{lot.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={lot.image}
                alt={lot.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
              <p className="text-sm text-gray-600 mb-2">{lot.artist}</p>
              <div className="flex justify-between items-center mb-2">
                <Badge variant="secondary">Estimated</Badge>
                <span className="font-semibold">${lot.estimatedPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <Badge>Current Bid</Badge>
                <span className="font-semibold">
                  ${lot.currentBid.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Page Number */}
      <div className="mt-4 text-center">
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>
    </section>
  );
}
