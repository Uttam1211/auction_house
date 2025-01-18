import { Card, CardContent } from "@/components/ui/card";

export default function AuctionConditionsTab() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="prose dark:prose-invert max-w-none text-sm md:text-base">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Conditions of Business
        </h3>

        <div className="space-y-4 md:space-y-6">
          <section>
            <h4 className="text-base md:text-lg font-medium mb-2 md:mb-3">
              1. Introduction
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              These conditions of business establish the terms on which we
              conduct sales on behalf of our sellers and govern all aspects of
              your relationship with us regarding the sale process.
            </p>
          </section>

          <section>
            <h4 className="text-base md:text-lg font-medium mb-2 md:mb-3">
              2. Bidding Procedures
            </h4>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Registration required before bidding</li>
              <li>Bids are binding once placed</li>
              <li>We reserve the right to reject bids</li>
              <li>Online bidding subject to platform terms</li>
            </ul>
          </section>

          <section>
            <h4 className="text-base md:text-lg font-medium mb-2 md:mb-3">
              3. Payment & Collection
            </h4>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Payment due within 7 days of sale</li>
              <li>Multiple payment methods accepted</li>
              <li>Collection by appointment only</li>
              <li>Storage fees apply after 14 days</li>
            </ul>
          </section>

          <section>
            <h4 className="text-base md:text-lg font-medium mb-2 md:mb-3">
              4. Warranty & Liability
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              All items are sold "as is" with no warranties or guarantees
              implied. Our liability is limited to the hammer price and buyer's
              premium paid.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
