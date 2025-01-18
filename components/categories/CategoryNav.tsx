import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryWithSubcategories } from "@/types/combinationPrismaTypes";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryNavProps {
  categories: CategoryWithSubcategories[];
}

const rippleVariants = {
  initial: {
    scale: 0,
    opacity: 0.35,
  },
  animate: {
    scale: 2,
    opacity: 0,
    transition: { duration: 0.8 },
  },
};

const categoryVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 30,
    duration: 0.3,
  },
};

export default function CategoryNav({ categories }: CategoryNavProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });
  const [isRippling, setIsRippling] = useState(false);

  const visibleCategories = categories.slice(startIndex, startIndex + 6);

  useEffect(() => {
    setShowLeftArrow(startIndex > 0);
    setShowRightArrow(startIndex + 6 < categories.length);
  }, [startIndex, categories.length]);

  const scrollLeft = () => {
    setStartIndex((prev) => Math.max(0, prev - 6));
  };

  const scrollRight = () => {
    setStartIndex((prev) => Math.min(categories.length - 6, prev + 6));
  };

  const handleArrowClick = (
    direction: "left" | "right",
    e: React.MouseEvent
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipplePosition({ x, y });
    setIsRippling(true);

    setTimeout(() => setIsRippling(false), 800);

    if (direction === "left") {
      scrollLeft();
    } else {
      scrollRight();
    }
  };

  return (
    <div className="w-full bg-wheat/10 dark:bg-gray-900/1 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50 relative z-50">
      <div className="container mx-auto max-w-7xl relative">
        <nav className="relative flex justify-center items-center">
          {showLeftArrow && (
            <motion.button
              onClick={(e) => handleArrowClick("left", e)}
              className="absolute left-4 z-10 p-2 bg-white/80 dark:bg-gray-900/80 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-colors overflow-hidden"
              aria-label="Scroll left"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              {isRippling && (
                <motion.span
                  variants={rippleVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute bg-gray-400/80 rounded-full"
                  style={{
                    width: 40,
                    height: 40,
                    left: ripplePosition.x - 20,
                    top: ripplePosition.y - 20,
                  }}
                />
              )}
            </motion.button>
          )}

          <motion.ul
            ref={scrollContainerRef}
            className="flex justify-center space-x-12 py-4 w-auto"
            layout
            layoutRoot
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleCategories.map((category) => (
                <motion.li
                  key={category.id}
                  variants={categoryVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="relative py-2 group"
                  onMouseEnter={() => setActiveCategory(category.id)}
                  onMouseLeave={() => setActiveCategory(null)}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 700, damping: 15 }}
                >
                  <Link
                    href={`/category/${category.id}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors relative z-50 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-md p-2"
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
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-[500px] bg-white dark:bg-gray-900 backdrop-blur-md shadow-lg rounded-lg border border-gray-200/50 dark:border-gray-800/50 flex"
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
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>

          {showRightArrow && (
            <motion.button
              onClick={(e) => handleArrowClick("right", e)}
              className="absolute right-4 z-10 p-2 bg-white/80 dark:bg-gray-900/80 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-colors overflow-hidden"
              aria-label="Scroll right"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              {isRippling && (
                <motion.span
                  variants={rippleVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute bg-gray-400/20 rounded-full"
                  style={{
                    width: 40,
                    height: 40,
                    left: ripplePosition.x - 20,
                    top: ripplePosition.y - 20,
                  }}
                />
              )}
            </motion.button>
          )}
        </nav>
      </div>
    </div>
  );
}
