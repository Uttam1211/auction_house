// config/layoutConfig.ts
import PublicLayout from "@/components/layouts/PublicLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";

const layoutConfig = {
  publicPaths: [
    "/",
    "/about",
    "/auctions",
    "/auction/*",
    "/footer/*",
    "/contact",
  ],
  privatePaths: [
    "/dashboard",
    "/profile",
    "/admin/*",
  ],
};

const getLayoutType = (pathname: string) => {
  // Helper to check if a route matches a list of paths
  const matchPath = (paths: string[]) =>
    paths.some((path) =>
      path.endsWith("/*") ? pathname.startsWith(path.replace("/*", "")) : path === pathname
    );

  if (matchPath(layoutConfig.privatePaths)) {
    return ProtectedLayout;
  }
  return PublicLayout; // Default to PublicLayout
};

export default getLayoutType;