import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CommissionBid {
  clientNo: string;
  maxBid: number;
  openBid: number;
}

interface Transaction {
  lotNo: number;
  title: string;
  commissionBids: CommissionBid[];
  reservePrice: number;
  sold: boolean;
  finalPrice: number | null;
  clientNo: string | null;
  auctioneerComments: string;
  status: "SOLD" | "RNM" | "PENDING";
  soldOnCommission?: boolean;
  commissionClientNo?: string;
  highestBid?: {
    amount: number;
    clientNo: string;
  };
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    lotNo: 2,
    title: "Example Item One",
    commissionBids: [],
    reservePrice: 15000,
    sold: true,
    finalPrice: 17500,
    clientNo: "452",
    auctioneerComments: "",
    status: "SOLD",
  },
  {
    lotNo: 3,
    title: "Example Item Two",
    commissionBids: [
      { clientNo: "182", openBid: 49500, maxBid: 72000 },
      { clientNo: "1563", openBid: 35000, maxBid: 60000 },
      { clientNo: "485", openBid: 37500, maxBid: 45000 },
    ],
    reservePrice: 50000,
    sold: true,
    finalPrice: 65000,
    clientNo: "182",
    auctioneerComments: "Sold on commission bid from 182",
    status: "SOLD",
    soldOnCommission: true,
    commissionClientNo: "182",
  },
  {
    lotNo: 4,
    title: "Example Item Three",
    commissionBids: [],
    reservePrice: 75000,
    sold: false,
    finalPrice: null,
    clientNo: null,
    auctioneerComments: "RNM - Reserve Not Met\n(Highest bid 60,000 from 431)",
    status: "RNM",
    highestBid: {
      amount: 60000,
      clientNo: "431",
    },
  },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [formData, setFormData] = useState<Partial<Transaction>>({});

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormData(transaction);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (selectedTransaction) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.lotNo === selectedTransaction.lotNo ? { ...t, ...formData } : t
        )
      );
    }
    setIsDialogOpen(false);
    setSelectedTransaction(null);
    setFormData({});
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsDialogOpen(true)}>Add Transaction</Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lot No</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Commission Bids</TableHead>
              <TableHead>Reserve Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Final Price</TableHead>
              <TableHead>Client No</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.lotNo}>
                <TableCell>{transaction.lotNo}</TableCell>
                <TableCell>{transaction.title}</TableCell>
                <TableCell>
                  {transaction.commissionBids.length > 0 ? (
                    <div className="space-y-1">
                      {transaction.commissionBids.map((bid, index) => (
                        <div key={index} className="text-sm">
                          Client {bid.clientNo}: £{bid.openBid.toLocaleString()}{" "}
                          - £{bid.maxBid.toLocaleString()}
                        </div>
                      ))}
                    </div>
                  ) : (
                    "N"
                  )}
                </TableCell>
                <TableCell>
                  £{transaction.reservePrice.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.status === "SOLD"
                        ? "default"
                        : transaction.status === "RNM"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {transaction.finalPrice
                    ? `£${transaction.finalPrice.toLocaleString()}`
                    : "-"}
                </TableCell>
                <TableCell>{transaction.clientNo || "-"}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {transaction.auctioneerComments || "-"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(transaction)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTransaction ? "Edit Transaction" : "Add Transaction"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1">Lot Number</label>
                <Input
                  type="number"
                  value={formData.lotNo || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lotNo: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1">Title</label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1">
                  Reserve Price
                </label>
                <Input
                  type="number"
                  value={formData.reservePrice || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      reservePrice: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1">Final Price</label>
                <Input
                  type="number"
                  value={formData.finalPrice || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      finalPrice: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1">
                  Client Number
                </label>
                <Input
                  value={formData.clientNo || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientNo: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full rounded-md border border-input px-3 py-2"
                  value={formData.status || "PENDING"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as Transaction["status"],
                    }))
                  }
                >
                  <option value="PENDING">Pending</option>
                  <option value="SOLD">Sold</option>
                  <option value="RNM">Reserve Not Met</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1">
                Auctioneer Comments
              </label>
              <Textarea
                value={formData.auctioneerComments || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    auctioneerComments: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {selectedTransaction ? "Update" : "Add"} Transaction
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
