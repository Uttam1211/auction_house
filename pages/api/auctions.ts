import { NextApiRequest, NextApiResponse } from "next";
import auctionsData from "@/data/auctions_detail.json";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const page = parseInt((query.page as string) || "1", 10);
    const limit = parseInt((query.limit as string) || "10", 10);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Get paginated auctions
    const paginatedAuctions = auctionsData.slice(startIndex, endIndex);

    return res.status(200).json({
      auctions: paginatedAuctions,
      total: auctionsData.length,
      page,
      limit,
      totalPages: Math.ceil(auctionsData.length / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
