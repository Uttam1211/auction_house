import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface Lot {
  id: string;
  title: string;
  artist: string;
  estimatedPrice: string;
  currentBid: number;
  image: string;
  description: string;
  bids: number;
}

interface LotGridProps {
  lots: Lot[];
}

export default function LotGrid({ lots }: LotGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {lots.map((lot) => (
        <div
          key={lot.id}
          className="group relative overflow-hidden border rounded-lg dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
        >
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={lot.image}
              alt={lot.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 transition-colors">
              <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors" />
            </button>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 dark:text-white">
              {lot.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {lot.description}
            </p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-900 dark:text-white font-semibold">
                  Current Bid: ${lot.currentBid}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {lot.bids} bids
                </p>
              </div>
              <Button variant="outline">Place Bid</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
