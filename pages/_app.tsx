// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import layoutConfig from "../config/layoutConfig";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps, router }: AppProps) {
  // Match layout based on current route or wildcard logic
  const getLayout = (pathname: string) => {
    for (const key in layoutConfig) {
      // Check for exact match
      if (key === pathname) return layoutConfig[key];

      // Check for wildcard match (e.g., "/auction/*")
      if (key.endsWith("/*") && pathname.startsWith(key.replace("/*", ""))) {
        return layoutConfig[key];
      }
    }
    // Default to PublicLayout if no match is found
    return layoutConfig["/"];
  };

  const Layout = getLayout(router.pathname);

  return (
    <ThemeProvider attribute="class">
      <UserProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </ThemeProvider>
  );
}

export default MyApp;
