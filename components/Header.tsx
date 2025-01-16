import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, SlidersHorizontal } from "lucide-react";
import LoginButton from "./auth/LoginButton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { getImagePath } from "@/config/images";
import { useRouter } from "next/router";

const navLinks = [
  { href: "/auctions", label: "Auctions" },
  { href: "/auction/featured", label: "Featured" },
  { href: "/footer/about_us", label: "About" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          <Image
            src={getImagePath.brandLogo()}
            alt="Fothebys"
            blurDataURL="data:..."
            placeholder="blur"
            width={200}
            height={200}
          />
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {/* Search Form with Quick Links */}
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search auctions & lots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-20 rounded-full bg-gray-100 dark:bg-gray-800"
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>

            {/* Quick action buttons */}
            <div className="absolute inset-y-0 right-2 flex items-center space-x-1">
              <Link href="/search">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </Link>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <LoginButton />

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white dark:bg-gray-900">
              <nav className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
