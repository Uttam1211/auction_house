import { Category, Subcategory, Lot } from "@prisma/client";

export interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

export interface LotWithCategories extends Lot {
  categories: CategoryWithSubcategories[];
}
