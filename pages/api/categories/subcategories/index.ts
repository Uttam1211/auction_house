import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      console.log(`Request Method: ${req.method}`);
      console.log(JSON.stringify(req.body, null, 2));
      const subcategories = req.body;

      if (!Array.isArray(subcategories)) {
        return res
          .status(400)
          .json({ message: "Subcategories must be an array" });
      }

      const createdSubcategories = await prisma.subcategory.createMany({
        data: subcategories,
        skipDuplicates: true,
      });

      res.status(201).json({
        message: "Subcategories created successfully",
        count: createdSubcategories.count,
      });
    } catch (error) {
      console.error("Error creating subcategories:", error);
      res.status(500).json({ message: "Failed to create subcategories" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
