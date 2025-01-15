import { Lot } from "@/types/Lot";
import Image from "next/image";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface LotCardProps {
  lot: Lot;
  viewMode: "grid" | "list";
  auctionId: string;
}

const categoryColors: { [key: string]: string } = {
  art: "bg-indigo-500/20 text-indigo-700 dark:bg-indigo-500/30 dark:text-indigo-300",
  collectibles:
    "bg-violet-500/20 text-violet-700 dark:bg-violet-500/30 dark:text-violet-300",
  jewelry:
    "bg-rose-500/20 text-rose-700 dark:bg-rose-500/30 dark:text-rose-300",
  furniture:
    "bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-300",
  watches:
    "bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-300",
  antiques:
    "bg-cyan-500/20 text-cyan-700 dark:bg-cyan-500/30 dark:text-cyan-300",
  paintings:
    "bg-fuchsia-500/20 text-fuchsia-700 dark:bg-fuchsia-500/30 dark:text-fuchsia-300",
  sculptures:
    "bg-blue-500/20 text-blue-700 dark:bg-blue-500/30 dark:text-blue-300",
  default:
    "bg-slate-500/20 text-slate-700 dark:bg-slate-500/30 dark:text-slate-300",
};

export default function LotCard({ lot, viewMode, auctionId }: LotCardProps) {
  return (
    <Link
      href={`/auction/${auctionId}/${lot.id}`}
      className={cn(
        "group relative overflow-hidden border rounded-lg dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300 block",
        viewMode === "list" && "flex gap-6"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          viewMode === "list" ? "w-48" : "aspect-square"
        )}
      >
        <Image
          src={lot.images[0]}
          alt={lot.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4 flex-1 relative">
        <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 transition-colors">
          <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors" />
        </button>

        <h3 className="font-semibold text-lg mb-2 dark:text-white">
          {lot.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {lot.description}
        </p>
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-gray-900 dark:text-white font-semibold">
              Current Bid: ${lot.currentBid}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {lot.startingBid} starting bid
            </p>
          </div>
        </div>

        {/* Category Tags */}
        <div className="flex gap-2 flex-wrap">
          {lot.categories.slice(0, 4).map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className={cn(
                "font-medium text-xs px-2 py-0.5 rounded-full",
                categoryColors[category.toLowerCase()] || categoryColors.default
              )}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
