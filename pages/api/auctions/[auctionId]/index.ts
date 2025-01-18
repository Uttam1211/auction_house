import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { auctionId } = req.query;

  // Ensure the method is GET
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Validate auctionId
  if (!auctionId || typeof auctionId !== "string") {
    return res.status(400).json({ message: "Invalid auction ID" });
  }

  try {
    // Fetch the specific auction by ID
    const auction = await prisma.auction.findUnique({
      where: {
        id: auctionId,
      },
      include: {
        lots: true,
        categories: true, // Include related categories if needed
        _count: {
          select: {
            lots: true,
          },
        },
      },
    });

    // Handle auction not found
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    return res.status(200).json(auction);
  } catch (error) {
    console.error("Error fetching auction:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}