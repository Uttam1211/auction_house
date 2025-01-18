import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Status, VenueType } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;
  const skip = (page - 1) * limit;

  const {
    title,
    description,
    auctioneer,
    status,
    isFeatured,
    isPublished,
    isActive,
    venueType,
    tags,
    category,
    subcat,
    location,
  } = req.query;

  const prisma = new PrismaClient();

  try {
    // Parse multi-value filters
    const tagList = tags ? (tags as string).split(",") : undefined;
    const categoryList = category ? (category as string).split(",") : undefined;
    const locationList = location ? (location as string).split(",") : undefined;

    // Validate enums
    const validStatus = status && Object.values(Status).includes(status as Status);
    const validVenueType = venueType && Object.values(VenueType).includes(venueType as VenueType);

    const auctions = await prisma.auction.findMany({
      where: {
        AND: [
          title ? { title: { contains: title as string, mode: "insensitive" } } : {},
          description ? { description: { contains: description as string, mode: "insensitive" } } : {},
          auctioneer ? { auctioneer: { contains: auctioneer as string, mode: "insensitive" } } : {},
          validStatus ? { status: { equals: status as Status } } : {},
          isFeatured !== undefined ? { isFeatured: isFeatured === "true" } : {},
          isPublished !== undefined ? { isPublished: isPublished === "true" } : {},
          isActive !== undefined ? { isActive: isActive === "true" } : {},
          validVenueType ? { venueType: { equals: venueType as VenueType } } : {},
          tagList ? { tags: { hasSome: tagList } } : {},
          locationList ? { location: { hasSome: locationList } } : {},
          categoryList ? { categories: { some: { name: { in: categoryList, mode: "insensitive" } } } } : {},
          subcat ? { categories: { some: { subcategories: { some: { name: { contains: subcat as string, mode: "insensitive" } } } } } } : {},
        ],
      },
      include: {
        categories: {
          include: {
            subcategories: true,
          },
        },
        _count: {
          select: {
            lots: true,
          },
        },
      },
      take: limit,
      skip: skip,
      orderBy: {
        timeStamp: "desc",
      },
    });

    const totalRecords = await prisma.auction.count({
      where: {
        AND: [
          title ? { title: { contains: title as string, mode: "insensitive" } } : {},
          description ? { description: { contains: description as string, mode: "insensitive" } } : {},
          auctioneer ? { auctioneer: { contains: auctioneer as string, mode: "insensitive" } } : {},
          validStatus ? { status: { equals: status as Status } } : {},
          isFeatured !== undefined ? { isFeatured: isFeatured === "true" } : {},
          isPublished !== undefined ? { isPublished: isPublished === "true" } : {},
          isActive !== undefined ? { isActive: isActive === "true" } : {},
          validVenueType ? { venueType: { equals: venueType as VenueType } } : {},
          tagList ? { tags: { hasSome: tagList } } : {},
          locationList ? { location: { hasSome: locationList } } : {},
          categoryList ? { categories: { some: { name: { in: categoryList, mode: "insensitive" } } } } : {},
          subcat ? { categories: { some: { subcategories: { some: { name: { contains: subcat as string, mode: "insensitive" } } } } } } : {},
        ],
      },
    });

    return res.status(200).json({
      data: auctions,
      metadata: {
        totalRecords,
        currentPage: page,
        recordsPerPage: limit,
        totalPages: Math.ceil(totalRecords / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching auctions:", error);
    return res.status(500).json({ message: "Error fetching auctions" });
  } finally {
    await prisma.$disconnect();
  }
}
