export const IMAGES = {
  // Brand & Logo
  BRAND_LOGO: "/brand_logo.jpg",

  // Categories
  CATEGORIES: {
    ART: "/images/categories/art.jpg",
    PAINTINGS: "/images/categories/paintings.jpg",
    SCULPTURES: "/images/categories/sculptures.jpg",
    COLLECTIBLES: "/images/categories/collectibles.jpg",
    JEWELRY: "/images/categories/jewelry.jpg",
    WATCHES: "/images/categories/watches.jpg",
    FURNITURE: "/images/categories/furniture.jpg",
    ANTIQUES: "/images/categories/antiques.jpg",
  },

  // Placeholders & Fallbacks
  DEFAULT_AUCTION: "/images/placeholders/default-auction.jpg",
  DEFAULT_LOT: "/images/placeholders/default-lot.jpg",
  DEFAULT_CATEGORY: "/images/placeholders/default-category.jpg",
  USER_AVATAR: "/images/placeholders/default-avatar.jpg",

  // Hero & Banner Images
  HERO_BANNER: "/images/hero/main-banner.jpg",
  FEATURED_BANNER: "/images/hero/featured-banner.jpg",
} as const;

// Helper function to get category image
export const getCategoryImage = (categoryId: string): string => {
  const key = categoryId.toUpperCase() as keyof typeof IMAGES.CATEGORIES;
  return IMAGES.CATEGORIES[key] || IMAGES.DEFAULT_CATEGORY;
};

// Export image path utilities
export const getImagePath = {
  category: getCategoryImage,
  brandLogo: () => IMAGES.BRAND_LOGO,
  defaultAuction: () => IMAGES.DEFAULT_AUCTION,
  defaultLot: () => IMAGES.DEFAULT_LOT,
  userAvatar: () => IMAGES.USER_AVATAR,
};
