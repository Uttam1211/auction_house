import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { auctionId } = req.query;
  const { isFeatured } = req.body;

  try {
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId as string },
    });

    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }
    const updatedAuction = await prisma.auction.update({
      where: { id: auctionId as string },
      data: { isFeatured: !auction.isFeatured },
    });

    res.json(updatedAuction);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
