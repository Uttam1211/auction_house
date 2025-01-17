import { SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
  const { theme } = useTheme();


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <SignUp
        routing="hash"
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
        }}
      />
    </div>
  );
}

SignUpPage.getLayout = (page: React.ReactElement) => page;
