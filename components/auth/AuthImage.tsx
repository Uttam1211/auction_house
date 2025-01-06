import Image from "next/image";

type AuthImageProps = {
  imageSrc: string;
  altText: string;
};

export default function AuthImage({ imageSrc, altText }: AuthImageProps) {
  return (
    <div className="relative hidden bg-muted md:block">
      <Image
        src={imageSrc}
        alt={altText}
        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        width={500}
        height={0}
      />
    </div>
  );
}
