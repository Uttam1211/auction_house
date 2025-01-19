import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { auctionId } = req.query;

  if (req.method === "DELETE") {
    // Ensure `auctionId` is valid
    if (!auctionId || typeof auctionId !== "string") {
      console.error("Invalid auction ID:", auctionId);
      return res.status(400).json({ message: "Invalid auction ID" });
    }

    try {
      console.log("Checking if auction exists:", auctionId);

      // First delete all related viewing dates
      await prisma.viewingDate.deleteMany({
        where: { auctionId },
      });

      // Then delete all related lots
      await prisma.lot.deleteMany({
        where: { auctionId },
      });

      // Finally delete the auction
      const deletedAuction = await prisma.auction.delete({
        where: { id: auctionId },
      });

      console.log("Auction deleted successfully:", auctionId);
      return res.status(200).json({ message: "Auction deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting auction:", error);
      return res.status(500).json({ message: "Internal server error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  if (req.method === "GET") {
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
  if (req.method === "PATCH") {
    return handlePatch(req, res);
  }
}

async function handlePatch(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.auctionId as string;

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
