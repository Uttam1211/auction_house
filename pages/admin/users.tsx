import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

type User = {
  id: number;
  name: string;
  email: string;
  type: string;
  requestedType: string | null;
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
  },
  {
    accessorKey: "requestedType",
    header: "Requested Type",
    cell: ({ row }) =>
      row.original.requestedType ? (
        <Badge variant="secondary">{row.original.requestedType}</Badge>
      ) : null,
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }) => (
      <div className="space-x-2" id="row.id">
        <Button size="sm" variant="outline">
          Edit
        </Button>
        {row.original.requestedType && (
          <>
            <Button size="sm" variant="default">
              Approve
            </Button>
            <Button size="sm" variant="destructive">
              Reject
            </Button>
          </>
        )}
      </div>
    ),
  },
];

const MOCK_USERS = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    type: "user",
    requestedType: null,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    type: "seller",
    requestedType: null,
  },
  {
    id: 3,
    name: "Bob Wilson",
    email: "bob@example.com",
    type: "user",
    requestedType: "seller",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    type: "admin",
    requestedType: null,
  },
  {
    id: 5,
    name: "Charlie Davis",
    email: "charlie@example.com",
    type: "user",
    requestedType: "seller",
  },
  {
    id: 6,
    name: "Diana Evans",
    email: "diana@example.com",
    type: "seller",
    requestedType: null,
  },
  {
    id: 7,
    name: "Ethan Foster",
    email: "ethan@example.com",
    type: "user",
    requestedType: null,
  },
  {
    id: 8,
    name: "Fiona Green",
    email: "fiona@example.com",
    type: "admin",
    requestedType: null,
  },
  {
    id: 9,
    name: "George Harris",
    email: "george@example.com",
    type: "user",
    requestedType: "admin",
  },
  {
    id: 10,
    name: "Hannah Johnson",
    email: "hannah@example.com",
    type: "seller",
    requestedType: null,
  },
  {
    id: 11,
    name: "Ian King",
    email: "ian@example.com",
    type: "user",
    requestedType: null,
  },
  {
    id: 12,
    name: "Julia Lee",
    email: "julia@example.com",
    type: "admin",
    requestedType: null,
  },
  {
    id: 13,
    name: "Kevin Martin",
    email: "kevin@example.com",
    type: "user",
    requestedType: "seller",
  },
  {
    id: 14,
    name: "Laura Nelson",
    email: "laura@example.com",
    type: "seller",
    requestedType: null,
  },
];

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      </div>
      <Card className="p-4">
        <DataTable columns={columns} data={MOCK_USERS} searchKey="name" />
      </Card>
    </div>
  );
}
