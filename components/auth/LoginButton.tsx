import { useState, useEffect } from "react";
import LoginDialog from "@/components/auth/LoginDialog";
import { useRouter } from "next/router";
import { Button } from "../ui/button";

export default function LoginButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const router = useRouter();

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Example: Small screen is <768px
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const handleLoginClick = () => {
    if (isSmallScreen) {
      // Redirect to the /login page
      router.push("/login");
    } else {
      // Open the dialog for larger screens
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <Button onClick={handleLoginClick}>Login</Button>
      <LoginDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
