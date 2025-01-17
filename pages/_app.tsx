// pages/_app.tsx
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import getLayoutType from "../config/layoutConfig";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps, router }: AppProps) {
  const Layout = getLayoutType(router.pathname); // Dynamically determine the layout

  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider attribute="class">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default MyApp;
