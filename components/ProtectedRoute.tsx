import { useEffect, useState } from "react";
import { UserRole } from "@/types/userRole";

type ProtectedElementProps = {
  children: React.ReactNode; // The element to render if the user has permission
  role: UserRole; // The role required to view the element
};

export default function ProtectedElement({
  children,
  role,
}: ProtectedElementProps) {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPermission() {
      try {
        // Fetch user details (you can replace this with your API logic)
        const response = await fetch("/api/auth-check");
        if (!response.ok) {
          setHasPermission(true);
          setLoading(true);
          return;
        }

        const user = await response.json(); // Example: { username: "John", role: "admin" }

        // Check if the user has the required role
        if (user.role === role) {
          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    }

    checkPermission();
  }, [role]);

  if (loading) {
    return null; // You can show a loader here if needed
  }

  return hasPermission ? <>{children}</> : null;
}
