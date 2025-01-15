import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { BidHistory } from "@/types/auction";
import BidHistoryDialog from "@/components/lot/BidHistoryDialog";

interface LotBidSectionProps {
  currentBid: number;
  nextMinimumBid: number;
  status: string;
  bidHistory: BidHistory[];
}

export default function LotBidSection({
  currentBid,
  nextMinimumBid,
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
            Next minimum bid: ${nextMinimumBid.toLocaleString()}
          </p>
          <div className="flex gap-2">
            <Input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Enter bid amount (min. $${nextMinimumBid})`}
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
