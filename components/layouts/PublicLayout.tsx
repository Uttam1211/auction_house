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
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {header}
      <main className="flex-grow container mx-auto max-w-7xl">{children}</main>
      {footer}
    </div>
  );
};

export default PublicLayout;
