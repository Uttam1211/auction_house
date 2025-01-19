import { IMAGES } from "@/config/images";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Extract the category ID from the request

  if (req.method === "DELETE") {
    try {
      // Check if the category exists
      const category = await prisma.category.findUnique({
        where: { id: id as string },
      });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Delete the category and cascade delete subcategories
      await prisma.category.delete({
        where: { id: id as string },
      });

      res.status(200).json({ message: "Category and related subcategories deleted successfully" });
    } catch (error) {
      console.error("Error deleting category and subcategories:", error);
      res.status(500).json({ message: "Failed to delete category" });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "PATCH") {
    try {
      const { name, image } = req.body;
      const imageUrl = image ? image : IMAGES.DEFAULT_CATEGORY;
  
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }
  
      const updatedCategory = await prisma.category.update({
        where: { id: id as string },
        data: { name: name as string, image: imageUrl },
      });
  
      res.status(200).json({
        message: "Category updated successfully",
        category: updatedCategory,
      });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["DELETE", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
