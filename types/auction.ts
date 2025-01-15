import { Lot } from "./Lot";
export interface Auction {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  images: string[];
  auctioneer: string;
  location: string;
  status: "open" | "closed";
  categories: string[];
  tags: string[];
  noOfLots: number;
  lots: Lot[];
  additionalDetails?: {
    venue?: string;
    registrationDeadline?: string;
    viewingDates?: {
      start: string;
      end: string;
    }[];
    contactPerson?: {
      name: string;
      email: string;
      phone: string;
    };
  };
}

export interface BidHistory {
  bidder: string;
  amount: number;
  timestamp: string;
}
