import { NextApiRequest, NextApiResponse } from "next";
import auctionsData from "@/data/auctions_detail.json";
import { SearchResponse, SearchFilters } from "@/types/search";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) {
  const {
    q: query,
    type,
    categories,
    status,
    location,
    minPrice,
    maxPrice,
    sortBy,
  } = req.query;

  let results: any[] = [];

  // If no filters at all, return empty response
  if (Object.keys(req.query).length === 0) {
    return res.status(200).json({
      results: [],
      total: 0,
      categories: [],
      locations: [],
    });
  }

  // Process all items
  auctionsData.forEach((auction) => {
    let matchesAuction = true;

    // Apply auction filters if any exist
    if (query) {
      matchesAuction =
        auction.title.toLowerCase().includes((query as string).toLowerCase()) ||
        auction.description
          .toLowerCase()
          .includes((query as string).toLowerCase());
    }
    if (categories) {
      matchesAuction =
        matchesAuction &&
        auction.categories.some((cat) =>
          (categories as string).split(",").includes(cat)
        );
    }
    if (location) {
      matchesAuction = matchesAuction && auction.location === location;
    }
    if (status) {
      matchesAuction = matchesAuction && auction.status === status;
    }

    // Add auction if it matches and type is appropriate
    if (matchesAuction && (!type || type === "all" || type === "auctions")) {
      results.push({
        id: auction.id,
        type: "auction",
        title: auction.title,
        description: auction.description,
        image: auction.images[0],
        date: auction.startDate,
        status: auction.status,
        categories: auction.categories,
        location: auction.location,
        href: `/auction/${auction.id}`,
      });
    }

    // Process lots
    auction.lots?.forEach((lot) => {
      let matchesLot = true;

      // Apply lot filters if any exist
      if (query) {
        matchesLot =
          lot.title.toLowerCase().includes((query as string).toLowerCase()) ||
          lot.description
            .toLowerCase()
            .includes((query as string).toLowerCase());
      }
      if (categories) {
        matchesLot =
          matchesLot &&
          lot.categories.some((cat) =>
            (categories as string).split(",").includes(cat)
          );
      }
      if (status) {
        matchesLot = matchesLot && lot.status === status;
      }
      if (minPrice) {
        matchesLot = matchesLot && lot.currentBid >= Number(minPrice);
      }
      if (maxPrice) {
        matchesLot = matchesLot && lot.currentBid <= Number(maxPrice);
      }

      // Add lot if it matches and type is appropriate
      if (matchesLot && (!type || type === "all" || type === "lots")) {
        results.push({
          id: lot.id,
          type: "lot",
          title: lot.title,
          description: lot.description,
          image: lot.images[0],
          currentBid: lot.currentBid,
          price: lot.estimatedPrice,
          categories: lot.categories,
          status: lot.status,
          href: `/auction/${auction.id}/lot/${lot.id}`,
        });
      }
    });
  });

  // Apply sorting if specified
  if (sortBy) {
    results = sortResults(results, sortBy as string, query as string);
  }

  // Get unique categories and locations from results
  const uniqueCategories = [
    ...new Set(results.flatMap((r) => r.categories || [])),
  ];
  const uniqueLocations = [
    ...new Set(results.map((r) => r.location).filter(Boolean)),
  ];

  res.status(200).json({
    results,
    total: results.length,
    categories: uniqueCategories,
    locations: uniqueLocations,
  });
}

function sortResults(results: any[], sortBy: string, query: string) {
  return [...results].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return (a.currentBid || 0) - (b.currentBid || 0);
      case "price-desc":
        return (b.currentBid || 0) - (a.currentBid || 0);
      case "date-asc":
        return (
          new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
        );
      case "date-desc":
        return (
          new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
        );
      case "title":
        return a.title.localeCompare(b.title);
      default:
        if (query) {
          const aPos = a.title.toLowerCase().indexOf(query.toLowerCase());
          const bPos = b.title.toLowerCase().indexOf(query.toLowerCase());
          return (
            (aPos === -1 ? Infinity : aPos) - (bPos === -1 ? Infinity : bPos)
          );
        }
        return 0;
    }
  });
}
