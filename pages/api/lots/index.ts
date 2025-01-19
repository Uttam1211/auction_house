import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const lots = await prisma.lot.findMany({
        include: {
          auction: {
            select: {
              id: true,
              title: true,
            },
          },
          categories: true,
          bidHistory: {
            orderBy: {
              timestamp: "desc",
            },
          },
          _count: {
            select: {
              bidHistory: true,
            },
          },
        },
        orderBy: {
          timeStamp: "desc",
        },
      });

      return res.status(200).json(lots);
    } catch (error) {
      console.error("Error fetching lots:", error);
      return res.status(500).json({ message: "Failed to fetch lots" });
    }
  }

  if (req.method === "POST") {
    try {
      const {
        title,
        description,
        lotNumber,
        auctionId,
        categories,
        images,
        artist,
        year,
        medium,
        height,
        width,
        condition,
        provenance,
        signature,
        edition,
      } = req.body;

      const lot = await prisma.lot.create({
        data: {
          title,
          description: description || "",
          lotNumber: lotNumber || "None",
          artist: artist || null,
          year: year || null,
          medium: medium || null,
          height: height || null,
          width: width || null,
          condition: condition || null,
          provenance: provenance || null,
          signature: signature || null,
          edition: edition || null,
          images: images || [],
          status: "UPCOMING",
          auction: {
            connect: { id: auctionId },
          },
          categories:
            categories?.length > 0
              ? { connect: categories.map((id: string) => ({ id })) }
              : undefined,
        },
      });

      return res.status(201).json(lot);
    } catch (error) {
      console.error("Error creating lot:", error);
      return res.status(500).json({
        message: "Failed to create lot",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
