import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create Categories
  const artCategory = await prisma.category.create({
    data: {
      name: "Art",
      image: "/images/categories/art.jpg",
      subcategories: {
        create: [
          { name: "Paintings" },
          { name: "Prints & Multiples" },
          { name: "Photographs" },
          { name: "Sculptures" },
          { name: "Contemporary Art" },
        ],
      },
    },
  });

  const collectiblesCategory = await prisma.category.create({
    data: {
      name: "Collectibles",
      image: "/images/categories/collectibles.jpg",
      subcategories: {
        create: [
          { name: "Coins & Stamps" },
          { name: "Memorabilia" },
          { name: "Vintage Items" },
          { name: "Toys & Games" },
        ],
      },
    },
  });

  // Create Auctions with related data
  const middleEastAuction = await prisma.auction.create({
    data: {
      title: "Contemporary Middle Eastern Art",
      description:
        "A prestigious collection featuring works by leading Middle Eastern artists...",
      startDate: new Date("2024-06-01T10:00:00Z"),
      endDate: new Date("2024-06-15T18:00:00Z"),
      images: [
        "/auctions/1/main.jpg",
        "/auctions/1/gallery1.jpg",
        "/auctions/1/gallery2.jpg",
        "/auctions/1/gallery3.jpg",
      ],
      auctioneer: "Sarah Al-Rashid",
      location: ["Diriyah, Riyadh, Saudi Arabia"],
      status: "UPCOMING",
      tags: ["emerging artists", "cultural heritage", "modern expression"],
      noOfLots: 2,
      venue: "At-Turaif UNESCO World Heritage Site",
      registrationDeadline: new Date("2024-05-30T18:00:00Z"),
      contactPersonName: "Mohammed Al-Saud",
      contactPersonEmail: "m.alsaud@auction.com",
      contactPersonPhone: "+966 50 123 4567",
      categories: {
        connect: { id: artCategory.id },
      },
      viewingDates: {
        create: {
          start: new Date("2024-05-25T10:00:00Z"),
          end: new Date("2024-05-30T18:00:00Z"),
        },
      },
      lots: {
        create: [
          {
            title: "Desert Harmony",
            artist: "Aref El Rayess",
            estimatedPrice: "50000-70000",
            currentBid: 55000,
            images: [
              "/lots/101/main.jpg",
              "/lots/101/detail1.jpg",
              "/lots/101/detail2.jpg",
            ],
            status: "OPEN",
            description: "A masterful exploration of desert landscapes...",
            startingBid: 45000,
            reservePrice: 48000,
            incrementRate: 1000,
            medium: "Oil on canvas",
            height: 120,
            width: 150,
            unit: "CM",
            year: "1985",
            condition: "Excellent",
            provenance: "Private Collection, Beirut",
            signature: "Signed and dated lower right",
            edition: "Unique",
            categories: {
              connect: { id: artCategory.id },
            },
            bidHistory: {
              create: {
                bidder: "Bidder123",
                amount: 55000,
                timestamp: new Date("2024-06-01T14:30:00Z"),
              },
            },
          },
          {
            title: "Cultural Reverie",
            artist: "Shirin Neshat",
            estimatedPrice: "75000-90000",
            currentBid: 80000,
            images: [
              "/lots/102/main.jpg",
              "/lots/102/detail1.jpg",
              "/lots/102/detail2.jpg",
            ],
            status: "OPEN",
            description:
              "A powerful photograph that explores themes of identity and culture",
            startingBid: 70000,
            reservePrice: 75000,
            incrementRate: 2000,
            medium: "Archival pigment print",
            height: 80,
            width: 60,
            unit: "CM",
            year: "2010",
            condition: "Mint",
            provenance: "Direct from the artist",
            signature: "Signed and dated on verso",
            edition: "2/10",
            categories: {
              connect: { id: artCategory.id },
            },
            bidHistory: {
              create: {
                bidder: "Collector987",
                amount: 80000,
                timestamp: new Date("2024-06-02T12:00:00Z"),
              },
            },
          },
        ],
      },
    },
  });

  // Create Asian Art Auction
  const asianArtAuction = await prisma.auction.create({
    data: {
      title: "Modern & Contemporary Asian Art",
      description:
        "An exceptional selection of modern and contemporary Asian artworks...",
      startDate: new Date("2024-07-01T09:00:00Z"),
      endDate: new Date("2024-07-14T17:00:00Z"),
      images: [
        "/auctions/2/main.jpg",
        "/auctions/2/gallery1.jpg",
        "/auctions/2/gallery2.jpg",
      ],
      auctioneer: "Jun Tanaka",
      location: ["Tokyo, Japan"],
      status: "UPCOMING",
      tags: ["japanese art", "chinese contemporary", "emerging markets"],
      noOfLots: 2,
      venue: "Tokyo International Forum",
      registrationDeadline: new Date("2024-06-28T17:00:00Z"),
      contactPersonName: "Yuki Yamamoto",
      contactPersonEmail: "y.yamamoto@auction.com",
      contactPersonPhone: "+81 3 1234 5678",
      categories: {
        connect: { id: artCategory.id },
      },
      viewingDates: {
        create: {
          start: new Date("2024-06-25T10:00:00Z"),
          end: new Date("2024-06-30T18:00:00Z"),
        },
      },
      lots: {
        create: [
          {
            title: "Eternal Mountain",
            artist: "Takashi Murakami",
            estimatedPrice: "80000-120000",
            currentBid: 85000,
            images: [
              "/lots/201/main.jpg",
              "/lots/201/detail1.jpg",
              "/lots/201/detail2.jpg",
            ],
            status: "UPCOMING",
            description: "A stunning example of Murakami's signature style",
            startingBid: 75000,
            reservePrice: 80000,
            incrementRate: 5000,
            medium: "Acrylic on canvas mounted on board",
            height: 180,
            width: 180,
            unit: "CM",
            year: "2019",
            condition: "Pristine",
            provenance: "Direct from the artist's studio",
            signature: "Signed and dated on verso",
            edition: "Unique",
            categories: {
              connect: { id: artCategory.id },
            },
          },
          {
            title: "Harmony in Motion",
            artist: "Yayoi Kusama",
            estimatedPrice: "120000-150000",
            currentBid: 125000,
            images: [
              "/lots/202/main.jpg",
              "/lots/202/detail1.jpg",
              "/lots/202/detail2.jpg",
            ],
            status: "UPCOMING",
            description:
              "A mesmerizing piece featuring Kusama's signature polka dot motif",
            startingBid: 110000,
            reservePrice: 120000,
            incrementRate: 5000,
            medium: "Acrylic on canvas",
            height: 100,
            width: 100,
            unit: "CM",
            year: "2021",
            condition: "Mint",
            provenance: "Private Collection, Tokyo",
            signature: "Signed and dated lower right",
            edition: "Unique",
            categories: {
              connect: { id: artCategory.id },
            },
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
