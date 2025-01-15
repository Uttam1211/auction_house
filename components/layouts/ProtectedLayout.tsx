// components/layouts/ProtectedLayout.tsx

import Header from "../Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Footer from "../footer/Footer";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <>
          <SidebarTrigger />
          {children}
        </>
      </SidebarProvider>
    </>
  );
};

export default ProtectedLayout;
