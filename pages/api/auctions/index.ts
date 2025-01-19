import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Status, VenueType } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "GET") {
    return handleGet(req, res);
  } else if (method === "POST") {
    return handlePost(req, res);
  } else if (method === "PATCH") {
    return handlePatch(req, res); // Handle updates
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
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

  try {
    const tagList = tags ? (tags as string).split(",") : undefined;
    const categoryList = category ? (category as string).split(",") : undefined;
    const locationList = location ? (location as string).split(",") : undefined;

    const validStatus =
      status && Object.values(Status).includes(status as Status);
    const validVenueType =
      venueType && Object.values(VenueType).includes(venueType as VenueType);

    const auctions = await prisma.auction.findMany({
      where: {
        AND: [
          title
            ? { title: { contains: title as string, mode: "insensitive" } }
            : {},
          description
            ? {
                description: {
                  contains: description as string,
                  mode: "insensitive",
                },
              }
            : {},
          auctioneer
            ? {
                auctioneer: {
                  contains: auctioneer as string,
                  mode: "insensitive",
                },
              }
            : {},
          validStatus ? { status: { equals: status as Status } } : {},
          isFeatured !== undefined ? { isFeatured: isFeatured === "true" } : {},
          isPublished !== undefined
            ? { isPublished: isPublished === "true" }
            : {},
          isActive !== undefined ? { isActive: isActive === "true" } : {},
          validVenueType
            ? { venueType: { equals: venueType as VenueType } }
            : {},
          tagList ? { tags: { hasSome: tagList } } : {},
          locationList ? { location: { hasSome: locationList } } : {},
          categoryList
            ? {
                categories: {
                  some: { name: { in: categoryList, mode: "insensitive" } },
                },
              }
            : {},
          subcat
            ? {
                categories: {
                  some: {
                    subcategories: {
                      some: {
                        name: {
                          contains: subcat as string,
                          mode: "insensitive",
                        },
                      },
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
          title
            ? { title: { contains: title as string, mode: "insensitive" } }
            : {},
          description
            ? {
                description: {
                  contains: description as string,
                  mode: "insensitive",
                },
              }
            : {},
          auctioneer
            ? {
                auctioneer: {
                  contains: auctioneer as string,
                  mode: "insensitive",
                },
              }
            : {},
          validStatus ? { status: { equals: status as Status } } : {},
          isFeatured !== undefined ? { isFeatured: isFeatured === "true" } : {},
          isPublished !== undefined
            ? { isPublished: isPublished === "true" }
            : {},
          isActive !== undefined ? { isActive: isActive === "true" } : {},
          validVenueType
            ? { venueType: { equals: venueType as VenueType } }
            : {},
          tagList ? { tags: { hasSome: tagList } } : {},
          locationList ? { location: { hasSome: locationList } } : {},
          categoryList
            ? {
                categories: {
                  some: { name: { in: categoryList, mode: "insensitive" } },
                },
              }
            : {},
          subcat
            ? {
                categories: {
                  some: {
                    subcategories: {
                      some: {
                        name: {
                          contains: subcat as string,
                          mode: "insensitive",
                        },
                      },
                    },
                  },
                },
              }
            : {},
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

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      images,
      auctioneer,
      location,
      tags,
      status,
      venueType,
      isPublished,
      isFeatured,
      contactPersonName,
      contactPersonEmail,
      contactPersonPhone,
      registrationDeadline,
      viewingDates,
      categories,
    } = req.body;

    // Validation
    if (!title || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Title, startDate, and endDate are required." });
    }

    // Create the new auction
    const newAuction = await prisma.auction.create({
      data: {
        title,
        description: description || "Not provided",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        images: images || [],
        auctioneer: auctioneer || "Not provided",
        location: location || [],
        tags: tags || [],
        status: status || "UPCOMING",
        venueType: venueType || "ONLINE",
        isPublished: isPublished || false,
        isFeatured: isFeatured || false,
        contactPersonName,
        contactPersonEmail,
        contactPersonPhone,
        registrationDeadline: registrationDeadline
          ? new Date(registrationDeadline)
          : null,
        viewingDates: {
          create: viewingDates?.map((date: any) => ({
            start: new Date(date.start),
            end: new Date(date.end),
          })),
        },
        categories: {
          connect: categories?.map((id: string) => ({ id })),
        },
      },
    });

    return res.status(201).json(newAuction);
  } catch (error) {
    console.error("Error creating auction:", error);
    return res.status(500).json({ message: "Failed to create auction" });
  } finally {
    await prisma.$disconnect();
  }
}

async function handlePatch(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Auction ID is required" });
  }

  try {
    const {
      title,
      description,
      startDate,
      endDate,
      images,
      auctioneer,
      location,
      tags,
      status,
      venueType,
      isPublished,
      isFeatured,
      contactPersonName,
      contactPersonEmail,
      contactPersonPhone,
      registrationDeadline,
      viewingDates,
      categories,
    } = req.body;

    // Validate required fields for update
    if (!title || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Title, startDate, and endDate are required" });
    }

    // Update the auction
    const updatedAuction = await prisma.auction.update({
      where: { id },
      data: {
        title,
        description: description || "Not provided",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        images: images || [],
        auctioneer: auctioneer || "Not provided",
        location: location || [],
        tags: tags || [],
        status: status || "UPCOMING",
        venueType: venueType || "ONLINE",
        isPublished: isPublished || false,
        isFeatured: isFeatured || false,
        contactPersonName,
        contactPersonEmail,
        contactPersonPhone,
        registrationDeadline: registrationDeadline
          ? new Date(registrationDeadline)
          : null,
        viewingDates: {
          deleteMany: {}, // Clear existing viewing dates
          create: viewingDates?.map((date: any) => ({
            start: new Date(date.start),
            end: new Date(date.end),
          })),
        },
        categories: {
          set: [], // Clear all existing categories
          connect: categories?.map((id: string) => ({ id })),
        },
      },
    });

    return res.status(200).json(updatedAuction);
  } catch (error) {
    console.error("Error updating auction:", error);
    return res.status(500).json({ message: "Failed to update auction" });
  } finally {
    await prisma.$disconnect();
  }
}
