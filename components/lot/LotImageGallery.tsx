import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LotImageGalleryProps {
  images: string[];
}

export default function LotImageGallery({ images }: LotImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden">
        <Image
          src={images[selectedImage]}
          alt="Lot image"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0",
              selectedImage === index && "ring-2 ring-primary"
            )}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
