// components/layouts/PublicLayout.tsx
import React from "react";
import Header from "../Header";
import Footer from "../footer/Footer";
import CategoryNav from "../categories/CategoryNav";
import { useRouter } from "next/router";
import { CategoryWithSubcategories } from "@/types/combinationPrismaTypes";

type PublicLayoutProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  categories?: CategoryWithSubcategories[];
};

const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  header = <Header />, // Default to Header component
  footer = <Footer />, // Default to Footer component
  categories,
}) => {
  const router = useRouter();
  const isHomePage = router.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      {header}
      {isHomePage && categories && <CategoryNav categories={categories} />}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      {footer}
    </div>
  );
};

export default PublicLayout;
