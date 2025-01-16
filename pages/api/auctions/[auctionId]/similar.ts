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
    if (auctionId) {
      // Fetch the categories and subcategories associated with the given auction
      const auction = await prisma.auction.findUnique({
        where: { id: auctionId as string },
        include: {
          categories: {
            include: {
              subcategories: true,
            },
          },
        },
      });

      if (!auction) {
        return res.status(404).json({ error: "Auction not found" });
      }

      // Extract all category IDs and subcategory IDs from the auction
      const categoryIds = auction.categories.map((cat) => cat.id);
      const subcategoryIds = auction.categories.flatMap((cat) =>
        cat.subcategories.map((sub) => sub.id)
      );

      // Find all auctions that share at least one category or subcategory
      const similarAuctions = await prisma.auction.findMany({
        where: {
          id: {
            not: auctionId as string, // Exclude the current auction
          },
          OR: [
            {
              categories: {
                some: {
                  id: { in: categoryIds },
                },
              },
            },
            {
              categories: {
                some: {
                  subcategories: {
                    some: {
                      id: { in: subcategoryIds },
                    },
                  },
                },
              },
            },
          ],
        },
        include: {
          categories: true,
        },
        take: 8, // Limit to 8 similar auctions
      });

      return res.status(200).json({ similarAuctions });
    }

    if (lotId) {
      // Fetch the lot with its categories and subcategories
      const lot = await prisma.lot.findUnique({
        where: { id: lotId as string },
        include: {
          categories: {
            include: {
              subcategories: true,
            },
          },
        },
      });

      if (!lot) {
        return res.status(404).json({ error: "Lot not found" });
      }

      // Extract all category IDs and subcategory IDs from the lot
      const categoryIds = lot.categories.map((cat) => cat.id);
      const subcategoryIds = lot.categories.flatMap((cat) =>
        cat.subcategories.map((sub) => sub.id)
      );

      // Find lots with matching categories or subcategories
      const similarLots = await prisma.lot.findMany({
        where: {
          id: {
            not: lotId as string, // Exclude the current lot
          },
          OR: [
            {
              categories: {
                some: {
                  id: { in: categoryIds },
                },
              },
            },
            {
              categories: {
                some: {
                  subcategories: {
                    some: {
                      id: { in: subcategoryIds },
                    },
                  },
                },
              },
            },
          ],
        },
        include: {
          categories: true,
        },
        take: 8, // Limit to 8 similar lots
      });

      return res.status(200).json({ similarLots });
    }

    return res
      .status(400)
      .json({ error: "Invalid request. Provide auctionId or lotId." });
  } catch (error) {
    console.error("Error fetching similar items:", error);
    return res.status(500).json({ error: "Failed to fetch similar items" });
  } finally {
    await prisma.$disconnect();
  }
}
