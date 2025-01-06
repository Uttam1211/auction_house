import dynamic from "next/dynamic";

const Facebook = dynamic(
  () => import("lucide-react").then((mod) => mod.Facebook),
  { ssr: false }
);
const Twitter = dynamic(
  () => import("lucide-react").then((mod) => mod.Twitter),
  { ssr: false }
);
const Instagram = dynamic(
  () => import("lucide-react").then((mod) => mod.Instagram),
  { ssr: false }
);
const Pinterest = dynamic(
  () => import("lucide-react").then((mod) => mod.PinIcon),
  { ssr: false }
);
const Youtube = dynamic(
  () => import("lucide-react").then((mod) => mod.Youtube),
  { ssr: false }
);

export default function FooterIcons() {
  return (
    <div className="flex space-x-2 mt-2 md:mt-0">
      <a href="#" className="text-gray-400 hover:text-white">
        <Facebook size={20} />
      </a>
      <a href="#" className="text-gray-400 hover:text-white">
        <Twitter size={20} />
      </a>
      <a href="#" className="text-gray-400 hover:text-white">
        <Instagram size={20} />
      </a>
      <a href="#" className="text-gray-400 hover:text-white">
        <Pinterest size={20} />
      </a>
      <a href="#" className="text-gray-400 hover:text-white">
        <Youtube size={20} />
      </a>
    </div>
  );
}
