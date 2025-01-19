import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lotId } = req.query;

  if (req.method === "DELETE") {
  
    if (!lotId || typeof lotId !== "string") {
      return res.status(400).json({ message: "Invalid lot ID" });
    }
  
    try {
      // First delete all related bids
      await prisma.bid.deleteMany({
        where: { lotId },
      });
  
      // Then delete the lot
      await prisma.lot.delete({
        where: { id: lotId },
      });
  
      return res.status(200).json({ message: "Lot deleted successfully" });
    } catch (error) {
      console.error("Error deleting lot:", error);
      return res.status(500).json({ message: "Failed to delete lot" });
    }
  }
  

  if (req.method === "PATCH") {
    // Similar to POST but with update logic
    // ... implementation similar to auction update
  }

  return res.status(405).json({ message: "Method not allowed" });
}
