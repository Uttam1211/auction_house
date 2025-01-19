import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useUsers } from "@/hooks/useUsers"; // Use your custom hook
import Loading from "@/components/Loading"; // Your custom loading spinner component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Import Shadcn Dialog components
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type User = {
  id: string;
  name: string;
  email: string;
  type: string;
  requestedType: string | null;
  avatar?: string | null;
  first_name?: string;
  last_name?: string;
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.original.avatar || ""} />
        <AvatarFallback>{row.original.name}</AvatarFallback>
      </Avatar>
    ),
  },
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
    cell: ({ row }) => {
      const { deleteUser, isLoading } = useUsers();

      return (
        <div className="space-x-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => deleteUser(row.original.id)}
            disabled={isLoading}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];

export default function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    email_address: "",
  });
  const { users, pagination, isLoading, error, inviteUser, handlePageChange, success } =
    useUsers();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateUser = async () => {
    try {
      await inviteUser({
        email_address: formData.email_address,
      });
      setIsDialogOpen(false); // Close modal after creation
      setFormData({ email_address: "" }); // Reset form
      toast.success("User invited successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error inviting user", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  if (success) {
    toast.success("User invited successfully", {
      position: "top-right",
      autoClose: 3000,
    });
  } else {
    toast.error(error, {
      position: "top-right",
      autoClose: 3000,
    });
  }

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    toast.error(error, {
      position: "top-right",
      autoClose: 3000,
    });
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <Button onClick={() => setIsDialogOpen(true)}>Invite User</Button>
      </div>
      <Card className="p-4">
        <DataTable<User, ColumnDef<User>>
          columns={columns}
          data={
            users?.map((user: any) => ({
              ...user,
              name: user.first_name + " " + user.last_name,
              email: user.email_addresses[0].email_address,
              type: user.public_metadata?.role,
              requestedType: "Null",
              id: user.id,
              avatar: user.image_url || "/default-avatar.png",
            })) ?? []
          }
          searchKey="name"
        />
      </Card>
      <div className="flex justify-between items-center mt-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePageChange(pagination?.currentPage ?? 1 - 1)}
          disabled={pagination?.currentPage === 1 || isLoading}
        >
          Previous
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePageChange(pagination?.currentPage ?? 1 + 1)}
          disabled={
            pagination?.currentPage === pagination?.totalPages || isLoading
          }
        >
          Next
        </Button>
      </div>

      {/* Shadcn Dialog for Adding User */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="email"
              name="email_address"
              placeholder="Email Address"
              value={formData.email_address}
              onChange={handleInputChange}
            />
            <Button onClick={handleCreateUser} disabled={isLoading}>
              Invite User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
