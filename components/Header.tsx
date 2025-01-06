import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import LoginButton from "./auth/LoginButton";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          <Image
            src="/brand_logo.jpg"
            alt="Fothebys"
            blurDataURL="data:..."
            placeholder="blur"
            width={200}
            height={200}
          />
        </Link>
        <div className="flex items-center space-x-4">
          <form className="relative">
            <Input
              type="search"
              placeholder="Search auctions..."
              className="pl-10 pr-4 py-2 rounded-full bg-gray-700"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </form>
          <nav className="hidden md:flex space-x-4">
            <Link href="/auctions" className="hover:text-gray-300">
              Auctions
            </Link>
            <Link href="/auction/featured" className="hover:text-gray-300">
              Featured
            </Link>
            <Link href="/about" className="hover:text-gray-300">
              About
            </Link>
          </nav>
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
