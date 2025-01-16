import { Category, Subcategory } from "@prisma/client";

import { Lot } from "@prisma/client";

export interface LotWithCategories extends Lot {
  categories: Category[];
  subcategories?: Subcategory[];
}

export interface SubcategoryWithCategories extends Subcategory {
  categories: Category[];
}

export interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}