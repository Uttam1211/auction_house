// pages/api/auth-check.ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "Your-secret-key";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.auth_token;

  if (!token) {
    return res
      .status(401)
      .json({ authenticated: false, message: "No token provided" });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as {
      name: string;
      role: string;
    }; // Add your JWT payload structure
    res.status(200).json({ authenticated: true, user });
  } catch (err) {
    console.error("Invalid token:", err);
    res
      .status(401)
      .json({ authenticated: false, message: "Invalid or expired token" });
  }
}
