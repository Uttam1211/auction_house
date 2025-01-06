import { useEffect, useState } from "react";
import LoginButton from "./auth/LoginButton";

type ProtectedWithDialogProps = {
  children: React.ReactNode;
};

export default function ProtectedWithDialog({
  children,
}: ProtectedWithDialogProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null for loading state
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth-check");
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setShowDialog(true); // Show the login dialog if not authenticated
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setShowDialog(true);
      }
    }

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <p>Loading...</p>; // Show a loading state while checking auth
  }

  if (isAuthenticated) {
    return <>{children}</>; // Show the protected content if authenticated
  }

  return <LoginButton />;
}
