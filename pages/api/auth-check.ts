import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "Your-secrect-key";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    res.status(200).json({ authenticated: true });
  } catch (err) {
    console.error("Invalid token:", err);
    res.status(401).json({ authenticated: false });
  }
}
