import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { auctionId, lotId } = req.query;

  try {
    const lot = await prisma.lot.findFirst({
      where: {
        id: lotId as string,
        auctionId: auctionId as string,
      },
      include: {
        auction: {
          select: {
            title: true,
          },
        },
        categories: true,
        bidHistory: true,
      },
    });

    if (!lot) {
      return res.status(404).json({ error: "Lot not found" });
    }

    return res.status(200).json(lot);
  } catch (error) {
    console.error("Error fetching lot:", error);
    return res.status(500).json({ error: "Failed to fetch lot data" });
  } finally {
    await prisma.$disconnect();
  }
}
