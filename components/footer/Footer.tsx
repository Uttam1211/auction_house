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
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1 - About */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
              Fothebys
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 pr-4">
              Discover exceptional items from prestigious auction houses
              worldwide. Fothebys connects collectors with authenticated pieces
              from trusted sellers.
            </p>
          </div>

          {/* Other Columns */}
          {footerLinks.map((section) => (
            <div key={section.category} className="col-span-1">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
                {section.category}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={`/${link.name}`}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
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
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
            © {currentYear} Fothebys all rights reserved
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 order-1 sm:order-2">
            <Link
              href="/footer/lot-directory"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Lot directory
            </Link>
            <Link
              href="/footer/legal"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Legal
            </Link>
            <Link
              href="/footer/cookies"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Cookies
            </Link>
          </div>

          <div className="order-3">
            <FooterIcons />
          </div>
        </div>
      </div>
    </footer>
  );
}
