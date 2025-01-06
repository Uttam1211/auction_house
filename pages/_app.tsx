// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import layoutConfig from "../config/layoutConfig";
import Header from "@/components/Header";

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
    // Default layout if no match is found
    return ({ children }: { children: React.ReactNode }) => (
      <>
        <Header />
        {children}
      </>
    );
  };

  const Layout = getLayout(router.pathname);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
