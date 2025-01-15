import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BidHistory } from "@/types/auction";

interface BidHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bidHistory: BidHistory[];
}

export default function BidHistoryDialog({
  open,
  onOpenChange,
  bidHistory,
}: BidHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bid History</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {bidHistory.map((bid, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div>
                <p className="font-medium">${bid.amount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{bid.bidder}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(bid.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
