import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const lotId = req.query.id as string;

  try {
    const bids = await prisma.bid.findMany({
      where: { lotId },
      select: {
        id: true,
        bidder: true,
        amount: true,
        timestamp: true,
        lotId: true,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return res.status(200).json(bids);
  } catch (error) {
    console.error("Error fetching bids:", error);
    return res.status(500).json({
      message: "Failed to fetch bids",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
