// layoutConfig.ts
import PublicLayout from "../components/layouts/PublicLayout";
import ProtectedLayout from "../components/layouts/ProtectedLayout";

const layoutConfig: { [key: string]: React.FC<{ children: React.ReactNode }> } =
  {
    "/": PublicLayout,
    "/about": PublicLayout,
    "/dashboard": ProtectedLayout,
    "/profile": ProtectedLayout,
    "/footer/*": PublicLayout,
    "/auctions": PublicLayout,
    "/auction/*": PublicLayout,
  };

export default layoutConfig;
