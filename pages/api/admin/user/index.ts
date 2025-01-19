import { NextApiRequest, NextApiResponse } from "next";

const CLERK_API_URL = "https://api.clerk.com/v1";
const CLERK_API_KEY = process.env.CLERK_SECRET_KEY; // Add this to your .env.local file

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET": // Fetch all users with pagination
      try {
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;
        const order_by = req.query.order_by || "-created_at";

        const response = await fetch(
          `${CLERK_API_URL}/users?limit=${limit}&offset=${offset}&order_by=${order_by}`,
          {
            headers: {
              Authorization: `Bearer ${CLERK_API_KEY}`,
            },
          }
        );

        if (!response.ok) {
          const error = await response.json();
          return res.status(response.status).json({ error });
        }

        const users = await response.json();

        // Clerk API provides total count in headers
        const totalCount = parseInt(response.headers.get("X-Total-Count") || "0", 10);

        res.status(200).json({
          users,
          pagination: {
            limit,
            offset,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: Math.floor(offset / limit) + 1,
          },
        });
      } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

    case "POST": // Create a new user
      try {
        const {
          email_address,
            } = req.body;

        if (!email_address || !email_address.length) {
          return res.status(400).json({ error: "Email address is required" });
        }

        const response = await fetch(`${CLERK_API_URL}/invitations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${CLERK_API_KEY}`,
          },
          body: JSON.stringify({
            email_address: email_address,
            public_metadata: {
              role: "user",
            },
            notify: true,
            ignore_existing: false,
            expires_in_days: 1,
            template_slug: "invitation",
          }),
        });
        console.log(response);

        if (!response.ok) {
          const error = await response.json();
          const body = await response.body;
          return res.status(response.status).json({ error, body });
        }

        const user = await response.json();
        return res.status(201).json(user);
      } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

    case "DELETE": // Delete a user
      try {
        const { user_id } = req.body;

        if (!user_id) {
          return res.status(400).json({ error: "User ID is required" });
        }

        const response = await fetch(`${CLERK_API_URL}/users/${user_id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${CLERK_API_KEY}`,
          },
        });

        if (!response.ok) {
          const error = await response.json();
          return res.status(response.status).json({ error });
        }

        return res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE", "PATCH"]);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
