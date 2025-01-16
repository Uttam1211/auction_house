import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryWithSubcategories } from "@/types/combinationPrismaTypes";

interface CategoryNavProps {
  categories: CategoryWithSubcategories[];
}

export default function CategoryNav({ categories }: CategoryNavProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="border-b dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm relative z-50">
      <div className="container mx-auto max-w-7xl">
        <nav className="relative">
          <ul className="flex justify-center space-x-12 py-4">
            {categories.map((category) => (
              <li
                key={category.id}
                className="relative py-2 group"
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  href={`/category/${category.id}`}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors relative z-50"
                >
                  {category.name}
                </Link>

                <AnimatePresence>
                  {activeCategory === category.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-[500px] bg-white dark:bg-gray-800 shadow-lg rounded-lg border dark:border-gray-700 flex"
                      style={{ pointerEvents: "auto" }}
                    >
                      <div className="p-6 flex-1">
                        <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
                          {category.name} Categories
                        </h3>
                        <ul className="grid grid-cols-2 gap-2">
                          {category.subcategories.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={`/category/${category.id}/${sub.id}`}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white block py-1"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="w-48 p-4 bg-gray-50 dark:bg-gray-900 rounded-r-lg">
                        <Image
                          src={`/path/to/images/${category.image}`}
                          alt={category.name}
                          width={200}
                          height={200}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
