export interface Lot {
  id: string;
  auctionId: string;
  title: string;
  artist: string;
  auctionTitle: string;
  estimatedPrice: string;
  currentBid: number;
  images: string[];
  categories: string[];
  status: "open" | "closed";
  description: string;
  details: {
    medium?: string;
    dimensions?: {
      height: number;
      width: number;
      depth?: number;
      unit: "cm" | "in";
    };
    year?: string;
    condition?: string;
    provenance?: string;
    signature?: string;
    edition?: string;
  };
  bidHistory?: {
    bidder: string;
    amount: number;
    timestamp: string;
  }[];
  startingBid: number;
  reservePrice?: number;
  nextMinimumBid: number;
  weight?: string;
  shippingInfo?: string;
  dimensions?: string;
  condition?: string;
}
