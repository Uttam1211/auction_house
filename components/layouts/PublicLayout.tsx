// components/layouts/PublicLayout.tsx
import React from "react";
import Header from "../Header";
import Footer from "../footer/Footer";

type PublicLayoutProps = {
  children: React.ReactNode;
};

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <header className="bg-gray-200 p-0">
          <Header />
        </header>
        <main className="flex-grow flex items-center justify-center p-4">
          {children}
        </main>
        <footer className="bg-gray-200 p-0 text-center">
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default PublicLayout;
