import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20" />
      <div className="relative max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 dark:text-white">
          Stay Updated with Auction Alerts
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Subscribe to receive notifications about upcoming auctions, new lots,
          and exclusive previews
        </p>
        <form className="flex gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1"
          />
          <Button>Subscribe</Button>
        </form>
      </div>
    </section>
  );
}
