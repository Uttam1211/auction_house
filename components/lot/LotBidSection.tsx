import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { Bid } from "@prisma/client";
import BidHistoryDialog from "@/components/lot/BidHistoryDialog";

interface LotBidSectionProps {
  currentBid: number;
  incrementRate: number;
  status: string;
  bidHistory: Bid[];
}

export default function LotBidSection({
  currentBid,
  incrementRate,
  status,
  bidHistory,
}: LotBidSectionProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const handleBid = () => {
    // Implement bid logic
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Current Bid</p>
          <p className="text-2xl font-bold">${currentBid.toLocaleString()}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowHistory(true)}
        >
          <History className="w-4 h-4 mr-2" />
          Bid History
        </Button>
      </div>

      {status === "active" ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Bid Increment: ${incrementRate.toLocaleString()}
          </p>
          <div className="flex gap-2">
            <Input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Enter bid amount (increment is $${incrementRate})`}
            />
            <Button onClick={handleBid}>Place Bid</Button>
          </div>
        </div>
      ) : (
        <Badge variant="secondary" className="w-full justify-center py-2">
          Auction Ended
        </Badge>
      )}

      <BidHistoryDialog
        open={showHistory}
        onOpenChange={setShowHistory}
        bidHistory={bidHistory}
      />
    </Card>
  );
}
