import Link from "next/link";
import FooterIcons from "./FooterIcons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      category: "About Us",
      links: [
        { name: "footer/about_us", label: "About Us" },
        { name: "footer/careers", label: "Careers" },
        { name: "footer/press", label: "Press" },
      ],
    },
    {
      category: "Guides",
      links: [
        { name: "footer/how-to-buy", label: "How to Buy" },
        { name: "footer/how-to-sell", label: "How to Sell" },
        { name: "footer/buying-guides", label: "Buying Guides" },
        { name: "footer/price-guide", label: "Price Guide" },
      ],
    },
    {
      category: "Help",
      links: [
        { name: "footer/customer-service", label: "Customer Service" },
        { name: "footer/contact", label: "Contact Us" },
        { name: "footer/live-chat", label: "Live Chat" },
        { name: "footer/sitemap", label: "Site Map" },
        { name: "footer/seller-application", label: "Seller Application" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-t dark:border-gray-800">
      <div className="container mx-auto px-0 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
          {/* Column 1 - About */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Fothebys
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Discover exceptional items from prestigious auction houses
              worldwide. Fothebys connects collectors with authenticated pieces
              from trusted sellers.
            </p>
          </div>

          {/* Other Columns */}
          {footerLinks.map((section) => (
            <div key={section.category}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {section.category}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={`/${link.name}`}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-4 pt-1 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 md:mb-0">
            © {currentYear} Fothebys all rights reserved
          </div>
          <div className="flex space-x-1">
            <Link
              href="/footer/lot-directory"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Lot directory
            </Link>
            <Link
              href="/footer/legal"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Legal
            </Link>
            <Link
              href="/footer/cookies"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Cookies
            </Link>
          </div>
          <FooterIcons />
        </div>
      </div>
    </footer>
  );
}
