import { NextApiRequest, NextApiResponse } from "next";
import auctionsData from "@/data/auctions_detail.json";

interface FilterParams {
  category?: string[];
  priceMin?: number;
  priceMax?: number;
  status?: string[];
  search?: string;
  sort?: string;
  filterType?: "all" | "open" | "my-bids" | "favorites";
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: {
      auctionId,
      page = "1",
      limit = "10",
      categories,
      priceMin,
      priceMax,
      status,
      search,
      sort,
      filterType = "all",
    },
  } = req;

  try {
    let auction = auctionsData.find((a) => a.id === auctionId);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    let filteredLots = [...auction.lots];

    // Apply filterType filter
    switch (filterType) {
      case "open":
        filteredLots = filteredLots.filter((lot) => lot.status === "open");
        break;
      case "my-bids":
        // In a real app, this would check against user's bid history
        
        break;
      case "favorites":
        // In a real app, this would check against user's favorites
        break;
    }

    // Apply category filter
    if (categories) {
      const categoryList = Array.isArray(categories)
        ? categories
        : [categories];
      filteredLots = filteredLots.filter((lot) =>
        lot.categories.some((cat) => categoryList.includes(cat))
      );
    }

    // Apply status filter
    if (status) {
      const statusList = Array.isArray(status) ? status : [status];
      filteredLots = filteredLots.filter((lot) =>
        statusList.includes(lot.status)
      );
    }

    // Apply price filter
    if (priceMin || priceMax) {
      filteredLots = filteredLots.filter((lot) => {
        const [minPrice] = lot.estimatedPrice
          .split("-")
          .map((str) => parseInt(str.replace(/[^0-9]/g, ""), 10));
        return (
          (!priceMin || minPrice >= Number(priceMin)) &&
          (!priceMax || minPrice <= Number(priceMax))
        );
      });
    }

    // Apply search
    if (search) {
      const searchTerm = (
        Array.isArray(search) ? search[0] : search
      ).toLowerCase();
      filteredLots = filteredLots.filter(
        (lot) =>
          lot.title.toLowerCase().includes(searchTerm) ||
          lot.artist.toLowerCase().includes(searchTerm) ||
          lot.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (sort) {
      filteredLots.sort((a, b) => {
        switch (sort) {
          case "lot-number-asc":
            return a.id.localeCompare(b.id);
          case "lot-number-desc":
            return b.id.localeCompare(a.id);
          case "estimate-asc": {
            const [aMin] = a.estimatedPrice
              .split("-")
              .map((str) => parseInt(str.replace(/[^0-9]/g, ""), 10));
            const [bMin] = b.estimatedPrice
              .split("-")
              .map((str) => parseInt(str.replace(/[^0-9]/g, ""), 10));
            return aMin - bMin;
          }
          case "estimate-desc": {
            const [aMin] = a.estimatedPrice
              .split("-")
              .map((str) => parseInt(str.replace(/[^0-9]/g, ""), 10));
            const [bMin] = b.estimatedPrice
              .split("-")
              .map((str) => parseInt(str.replace(/[^0-9]/g, ""), 10));
            return bMin - aMin;
          }
          default:
            return 0;
        }
      });
    }

    // Apply pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedLots = filteredLots.slice(startIndex, endIndex);

    return res.status(200).json({
      auction: {
        ...auction,
        lots: paginatedLots,
      },
      pagination: {
        total: filteredLots.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(filteredLots.length / Number(limit)),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
