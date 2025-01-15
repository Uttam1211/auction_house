import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColumnDef } from "@tanstack/react-table";

type UserRequest = {
  id: number;
  user: string;
  email: string;
  currentType: string;
  requestedType: string;
  date: string;
};

type AuctionRequest = {
  id: number;
  title: string;
  seller: string;
  items: number;
  startPrice: number;
  date: string;
};

const userColumns: ColumnDef<UserRequest>[] = [
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "currentType",
    header: "Current Type",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.currentType}</Badge>
    ),
  },
  {
    accessorKey: "requestedType",
    header: "Requested Type",
    cell: ({ row }) => (
      <Badge>{row.original.requestedType}</Badge>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    id: "actions",
    cell: () => (
      <div className="space-x-2">
        <Button size="sm" variant="default">Approve</Button>
        <Button size="sm" variant="destructive">Reject</Button>
      </div>
    ),
  },
];

const auctionColumns: ColumnDef<AuctionRequest>[] = [
  {
    accessorKey: "title",
    header: "Title" ,
  },
  {
    accessorKey: "seller",
    header: "Seller",
  },
  {
    accessorKey: "items",
    header: "Items",
  },
  {
    accessorKey: "startPrice",
    header: "Start Price",
    cell: ({ row }) => `$${row.original.startPrice}`,
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    id: "actions",
    cell: () => (
      <div className="space-x-2">
        <Button size="sm" variant="outline">View Details</Button>
        <Button size="sm" variant="default">Approve</Button>
        <Button size="sm" variant="destructive">Reject</Button>
      </div>
    ),
  },
];

const MOCK_USER_REQUESTS = [
  { 
    id: 1, 
    user: "John Smith",
    email: "john@example.com",
    currentType: "user",
    requestedType: "seller",
    date: "2024-03-20"
  },
  { 
    id: 2, 
    user: "Mary Johnson",
    email: "mary@example.com",
    currentType: "user",
    requestedType: "seller",
    date: "2024-03-19"
  },
];

const MOCK_AUCTION_REQUESTS = [
  { 
    id: 1, 
    title: "Vintage Camera Collection",
    seller: "Bob Wilson",
    items: 5,
    startPrice: 1000,
    date: "2024-03-20"
  },
  { 
    id: 2, 
    title: "Antique Furniture Set",
    seller: "Alice Brown",
    items: 3,
    startPrice: 2500,
    date: "2024-03-19"
  },
];

export default function ApprovalsPage() {
  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Approvals</h2>
      </div>
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Type Changes</TabsTrigger>
          <TabsTrigger value="auctions">Auction Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card className="p-4">
            <DataTable
              columns={userColumns}
              data={MOCK_USER_REQUESTS}
              searchKey="user"
            />
          </Card>
        </TabsContent>
        <TabsContent value="auctions">
          <Card className="p-4">
            <DataTable
              columns={auctionColumns}
              data={MOCK_AUCTION_REQUESTS}
              searchKey="title"
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}