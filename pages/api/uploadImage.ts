import { v2 as cloudinary } from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";

// Configure Cloudinary
cloudinary.config({
  cloud_name: `${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET}`,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { file } = req.body;

      if (!file) {
        return res.status(400).json({ message: "No file provided" });
      }

      // Upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(file, {
        folder: "categories", // Optional folder name in Cloudinary
      });

      res.status(200).json({
        message: "Image uploaded successfully",
        url: uploadResponse.secure_url, // Cloudinary's secure URL
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
