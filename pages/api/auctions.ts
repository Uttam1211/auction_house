import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const page = parseInt((query.page as string) || "1", 10);
    const limit = parseInt((query.limit as string) || "10", 10);
    const startIndex = (page - 1) * limit;

    // Get paginated auctions using Prisma
    const [paginatedAuctions, total] = await Promise.all([
      prisma.auction.findMany({
        skip: startIndex,
        take: limit,
      }),
      prisma.auction.count(),
    ]);

    return res.status(200).json({
      auctions: paginatedAuctions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
