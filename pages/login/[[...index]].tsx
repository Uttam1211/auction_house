import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
export default function SignInPage() {
  const { theme } = useTheme();
  return (
    <div className="flex items-center justify-center my-16">
      <SignIn
        routing="hash"
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
        }}
      />
    </div>
  );
}
SignInPage.getLayout = (page: React.ReactElement) => page;
