import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Shield, Lock } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="py-12 sm:py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20" />

      <div className="relative max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold dark:text-white">
            Stay Updated with Auction Alerts
          </h2>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Subscribe to receive notifications about upcoming auctions, new
            lots, and exclusive previews. Be the first to know about special
            events and featured collections.
          </p>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto"
        >
          <div className="flex-1">
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-full h-11 sm:h-12"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-left">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>

          <Button
            size="lg"
            className="w-full sm:w-auto h-11 sm:h-12 whitespace-nowrap"
          >
            Subscribe
          </Button>
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span>Instant notifications</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>No spam guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>Secure & encrypted</span>
          </div>
        </div>
      </div>
    </section>
  );
}
