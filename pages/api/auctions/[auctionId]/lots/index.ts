import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { auctionId } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!auctionId || typeof auctionId !== "string") {
    return res.status(400).json({ message: "Invalid auction ID" });
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const {
    title,
    artist,
    status,
    categories,
    subcategories,
    isFeatured,
    isLive,
    startingBid,
  } = req.query;

  try {
    // Parse multi-value filters
    const categoryList = categories ? (categories as string).split(",") : undefined;
    const subcategoryList = subcategories ? (subcategories as string).split(",") : undefined;

    // Validate enums
    const validStatus = status && Object.values(Status).includes((status as string).toUpperCase() as Status);

    // Fetch lots
    const lots = await prisma.lot.findMany({
      where: {
        AND: [
          { auctionId }, // Filter by auction ID
          title ? { title: { contains: title as string, mode: "insensitive" } } : {},
          artist ? { artist: { contains: artist as string, mode: "insensitive" } } : {},
          validStatus ? { status: { equals: (status as string).toUpperCase() as Status } } : {},
          isFeatured !== undefined ? { isFeatured: isFeatured === "true" } : {},
          isLive !== undefined ? { isLive: isLive === "true" } : {},
          categoryList
            ? {
                categories: {
                  some: { name: { in: categoryList, mode: "insensitive" } },
                },
              }
            : {},
          subcategoryList
            ? {
                categories: {
                  some: {
                    subcategories: {
                      some: { name: { in: subcategoryList, mode: "insensitive" } },
                    },
                  },
                },
              }
            : {},
        ],
      },
      include: {
        categories: {
          include: {
            subcategories: true, // Include related subcategories
          },
        },
      },
      take: limit,
      skip: skip,
      orderBy: {
        timeStamp: "desc",
      },
    });

    // Total count for pagination
    const totalRecords = await prisma.lot.count({
      where: {
        AND: [
          { auctionId },
          title ? { title: { contains: title as string, mode: "insensitive" } } : {},
          artist ? { artist: { contains: artist as string, mode: "insensitive" } } : {},
          validStatus ? { status: { equals: (status as string).toUpperCase() as Status } } : {},
          isFeatured !== undefined ? { isFeatured: isFeatured === "true" } : {},
          isLive !== undefined ? { isLive: isLive === "true" } : {},
          categoryList
            ? {
                categories: {
                  some: { name: { in: categoryList, mode: "insensitive" } },
                },
              }
            : {},
          subcategoryList
            ? {
                categories: {
                  some: {
                    subcategories: {
                      some: { name: { in: subcategoryList, mode: "insensitive" } },
                    },
                  },
                },
              }
            : {},
        ],
      },
    });

    return res.status(200).json({
      data: lots,
      metadata: {
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        recordsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching lots:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}