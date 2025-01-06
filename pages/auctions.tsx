import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'

export default function AuctionDetail() {
  const auction = {
    id: 1,
    title: "Fine Art Masterpieces",
    description: "A curated collection of fine art masterpieces from renowned artists of the 19th and 20th centuries.",
    image: "/placeholder.svg",
    endDate: "2023-07-15T23:59:59Z",
    lotsCount: 150,
    currentBid: 25000,
  }

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-semibold mb-6">Featured Auction</h2>
      <Card>
        <CardHeader>
          <CardTitle>{auction.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Image src={auction.image} alt={auction.title} width={500} height={300} className="w-full h-64 object-cover rounded-md" />
            <div>
              <p className="mb-4">{auction.description}</p>
              <div className="flex justify-between items-center mb-4">
                <Badge variant="secondary">Ends {new Date(auction.endDate).toLocaleString()}</Badge>
                <span className="text-sm text-gray-500">{auction.lotsCount} Lots</span>
              </div>
              <p className="text-xl font-semibold mb-4">Current Bid: ${auction.currentBid.toLocaleString()}</p>
              <Button className="w-full">Place Bid</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

