import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { auctionId } = req.query;

  if (!auctionId) {
    return res.status(400).json({ error: "Auction ID is required" });
  }

  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId as string },
    });

    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }
    const updatedAuction = await prisma.auction.update({
      where: { id: auctionId as string },
      data: { isPublished: !auction.isPublished },
    });

    res.json(updatedAuction);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
