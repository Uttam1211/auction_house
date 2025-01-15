// components/layouts/PublicLayout.tsx
import React from "react";
import Header from "../Header";
import Footer from "../footer/Footer";
import CategoryNav from "../categories/CategoryNav";
import { useRouter } from "next/router";

type PublicLayoutProps = {
  children: React.ReactNode;
};

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const router = useRouter();
  const isHomePage = router.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b dark:border-gray-800">
        <Header />
        {isHomePage && <CategoryNav />}
      </div>
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
