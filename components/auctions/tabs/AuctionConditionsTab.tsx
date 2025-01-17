import { Card, CardContent } from "@/components/ui/card";

export default function AuctionConditionsTab() {
  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold mb-6 text-foreground">
        Terms & Conditions
      </h3>

      <div className="space-y-6">
        <section>
          <h4 className="font-semibold mb-3 text-foreground">1. Bidding</h4>
          <p className="text-muted-foreground leading-relaxed">
            By placing a bid, you enter into a legally binding contract. Bids
            cannot be retracted once placed. The highest bidder acknowledged by
            the auctioneer shall be the buyer.
          </p>
        </section>

        <section>
          <h4 className="font-semibold mb-3 text-foreground">2. Payment</h4>
          <p className="text-muted-foreground leading-relaxed">
            Payment is required within 48 hours of the auction end. We accept
            major credit cards, wire transfers, and approved payment methods.
          </p>
        </section>

        <section>
          <h4 className="font-semibold mb-3 text-foreground">
            3. Buyer's Premium
          </h4>
          <p className="text-muted-foreground leading-relaxed">
            A buyer's premium of 25% will be added to the hammer price of each
            lot.
          </p>
        </section>

        <section>
          <h4 className="font-semibold mb-3 text-foreground">
            4. Shipping & Collection
          </h4>
          <p className="text-muted-foreground leading-relaxed">
            Items must be collected or shipping arranged within 7 days of the
            auction end. Shipping costs are the responsibility of the buyer.
          </p>
        </section>

        <section>
          <h4 className="font-semibold mb-3 text-foreground">
            5. Condition of Items
          </h4>
          <p className="text-muted-foreground leading-relaxed">
            All items are sold "as is". While we provide condition reports,
            buyers are encouraged to inspect items personally before bidding.
          </p>
        </section>
      </div>
    </div>
  );
}
