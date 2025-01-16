// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import getLayoutType from "../config/layoutConfig";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps, router }: AppProps) {
  const Layout = getLayoutType(router.pathname); // Dynamically determine the layout

  return (
    <ThemeProvider attribute="class">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;