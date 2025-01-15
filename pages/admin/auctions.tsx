import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const MOCK_AUCTIONS = [
  {
    id: 1,
    title: "Vintage Watch Collection",
    seller: "Jane Smith",
    status: "active",
    startPrice: 1000,
    currentBid: 1500,
    endDate: "2024-04-15",
  },
  {
    id: 2,
    title: "Art Deco Furniture Set",
    seller: "Bob Wilson",
    status: "pending",
    startPrice: 5000,
    currentBid: 0,
    endDate: "2024-04-20",
  },
];

export default function AuctionsPage() {
  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Auctions</h2>
        <Button>Create Auction</Button>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Price</TableHead>
              <TableHead>Current Bid</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_AUCTIONS.map((auction) => (
              <TableRow key={auction.id}>
                <TableCell>{auction.title}</TableCell>
                <TableCell>{auction.seller}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      auction.status === "active" ? "default" : "secondary"
                    }
                  >
                    {auction.status}
                  </Badge>
                </TableCell>
                <TableCell>${auction.startPrice}</TableCell>
                <TableCell>${auction.currentBid || "-"}</TableCell>
                <TableCell>{auction.endDate}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="outline">
                    View Items
                  </Button>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  {auction.status === "pending" && (
                    <Button size="sm" variant="default">
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
