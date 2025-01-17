import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useState } from "react";

interface AuctionImagesCarouselProps {
  images: string[];
}

export default function AuctionImagesCarousel({
  images,
}: AuctionImagesCarouselProps) {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2">
        {images.map((image, index) => (
          <div
            key={image}
            className={`relative w-20 h-20 cursor-pointer ${
              currentImage === index ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setCurrentImage(index)}
          >
            <Image
              src={image}
              alt={`Preview ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Main Carousel */}
      <Carousel className="flex-1">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image}>
              <div className="relative aspect-[4/3]">
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
