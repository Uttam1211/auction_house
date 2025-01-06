import { Lot } from "./Lot";
export type Auction = {
  id: string;
  title: string;
  description: string;
  startDate: string; // JSON dates are strings
  endDate: string; // JSON dates are strings
  image: string;
  auctioneer: string;
  location: string;
  noOfLots: number;
  lots: Lot[]; // Array of lots
};
