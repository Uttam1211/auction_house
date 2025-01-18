import dynamic from "next/dynamic";
import Link from "next/link";

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
  const socialLinks = [
    { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
    { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
    { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
    { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
  ];

  return (
    <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-4">
      {socialLinks.map(({ href, icon: Icon, label }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
          aria-label={label}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="sr-only">{label}</span>
        </Link>
      ))}
    </div>
  );
}
