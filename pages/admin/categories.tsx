import Loading from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PrismaClient } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, FilePenLine, PencilIcon } from "lucide-react";
import { TrashIcon } from "lucide-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { FolderIcon, PlusIcon, CheckIcon, AlertCircleIcon } from "lucide-react";
import { ImageIcon, UploadIcon, Loader2Icon, SaveIcon } from "lucide-react";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const prisma = new PrismaClient();

  try {
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: { subcategories: true },
      }),
      prisma.category.count(),
    ]);

    return {
      props: {
        categoriesData: JSON.parse(JSON.stringify(categories)),
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return {
      props: {
        categoriesData: [],
        totalPages: 0,
        currentPage: 1,
      },
    };
  } finally {
    await prisma.$disconnect();
  }
};

export default function CategoriesPage({
  categoriesData,
  totalPages,
  currentPage,
}: {
  categoriesData: any;
  totalPages: number;
  currentPage: number;
  limit: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [openRow, setOpenRow] = useState<string | null>(null);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        return (
          <Image
            src={row.original.image}
            alt={row.original.name}
            width={50}
            height={50}
            className="rounded-lg object-cover"
          />
        );
      },
    },
    {
      accessorKey: "subcategories",
      header: "Subcategories",
      cell: ({ row }) => {
        return row.original.subcategories.map((subcategory: any) => {
          return (
            <Badge key={subcategory.id} className="text-xs" variant="outline">
              {subcategory.name}
            </Badge>
          );
        });
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            <Dialog
              open={openRow === row.original.id} // Open dialog for the specific row
              onOpenChange={(open) => {
                setOpenRow(open ? row.original.id : null); // Open dialog for this row or reset
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <FilePenLine className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>
                    {row.original.subcategories.length > 0
                      ? "Update Subcategories"
                      : "Add Subcategories"}
                  </DialogTitle>
                </DialogHeader>
                <SubcategoryForm
                  subcategories={row.original.subcategories} // Pass the correct subcategories for this row
                  categoryId={row.original.id}
                  onSuccess={() => {
                    setOpenRow(null); // Close the dialog after success
                    refreshData(); // Refresh the table
                  }}
                />
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setEditingCategory(row.original);
                setIsOpen(true);
              }}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={async () => {
                if (
                  confirm(
                    "It will delete all subcategories as well, are you sure?"
                  )
                ) {
                  try {
                    const categoryId = row.original.id as string;
                    toast.promise(
                      fetch(`/api/categories/${categoryId}`, {
                        method: "DELETE",
                      }),
                      {
                        loading: "Deleting category and subcategories...",
                        success:
                          "Category and subcategories deleted successfully",
                        error: "Failed to delete category and subcategories",
                      }
                    );
                    refreshData();
                  } catch (error) {
                    toast.error("Failed to delete category and subcategories");
                  }
                }
              }}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
  const router = useRouter();

  if (router.isFallback || !router.isReady) {
    return <Loading />;
  }

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handlePageChange = (page: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page },
    });
  };

  return (
    <div className="flex-1 space-y-4 p-8 h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open); // Update dialog open state
            if (!open) {
              // Reset editingCategory when the dialog is closed
              setEditingCategory(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>Add Category</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Create New Category"}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm
              category={editingCategory}
              onSuccess={() => {
                setIsOpen(false);
                setEditingCategory(null);
                refreshData();
              }}
              setIsOpen={setIsOpen}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <div className="overflow-x-auto p-4">
          <DataTable
            key={currentPage}
            columns={columns}
            data={categoriesData}
            searchKey="name"
            totalPages={totalPages}
            cp={currentPage}
          />
        </div>
        <div className="flex items-center justify-center space-x-2 py-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CategoryForm({
  category,
  onSuccess,
  setIsOpen,
}: {
  category?: any;
  onSuccess: () => void;
  setIsOpen: (open: boolean) => void;
}) {
  const [image, setImage] = useState<string | null>(category?.image || null); // Store a single image URL
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`
    ); // Replace with your Cloudinary preset

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, // Replace with your Cloudinary cloud name
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setImage(data.secure_url); // Save the Cloudinary URL
      } else {
        throw new Error(data.error.message);
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const categoryData = {
      name: formData.get("name"),
      image, // Include the single image URL
    };

    try {
      const response = await fetch(
        `/api/categories${category ? `/${category.id}` : ""}`,
        {
          method: category ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        }
      );

      if (!response.ok) throw new Error("Failed to save category");

      toast.success(
        `Category ${category ? "updated" : "created"} successfully`
      );
      onSuccess();
    } catch (error) {
      toast.error(`Failed to ${category ? "update" : "create"} category`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      {/* Name Field */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
        >
          <span>Category Name</span>
          <span className="text-xs text-red-500">*</span>
        </label>
        <Input
          type="text"
          id="name"
          name="name"
          defaultValue={category?.name}
          required
          placeholder="Enter category name"
          className="w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Image Upload Field */}
      <div className="space-y-4">
        <label
          htmlFor="image"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Category Image
        </label>

        <div className="flex items-start space-x-4">
          {/* Current/Preview Image */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-700">
              {image ? (
                <Image
                  src={image}
                  alt="Category"
                  className="w-full h-full object-cover"
                  width={100}
                  height={100}
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <UploadIcon className="w-4 h-4 mr-2" />
                Choose Image
              </label>
              {image && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setImage(null)}
                  className="h-9"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              )}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Recommended: 400x400px or larger, PNG or JPG
            </p>

            {loading && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <Loader2Icon className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="text-red-500">*</span> Required fields
        </p>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="min-w-[100px]">
            {loading ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <SaveIcon className="w-4 h-4 mr-2" />
                {category ? "Update" : "Save"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

function SubcategoryForm({ subcategories, onSuccess, categoryId }: any) {
  const [subcategoryList, setSubcategoryList] = useState<any[]>([]);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setSubcategoryList(subcategories || []);
  }, [subcategories]);

  useEffect(() => {
    const initialData = JSON.stringify(subcategories);
    const currentData = JSON.stringify(subcategoryList);
    setIsChanged(initialData !== currentData);
  }, [subcategoryList, subcategories]);

  const handleAddField = () => {
    setSubcategoryList([
      ...subcategoryList,
      { id: null, name: "", categoryId, isNew: true }, // Add a new empty subcategory
    ]);
  };

  const handleRemoveField = async (
    index: number,
    subcategoryId: string | null
  ) => {
    if (subcategoryId) {
      if (confirm("Are you sure you want to delete this subcategory?")) {
        try {
          const response = await fetch(
            `/api/categories/subcategories/${subcategoryId}`,
            {
              method: "DELETE",
            }
          );
          if (!response.ok) throw new Error("Failed to delete subcategory");
          toast.success("Subcategory deleted successfully!");
          const updatedList = subcategoryList.filter((_, i) => i !== index);
          setSubcategoryList(updatedList);
        } catch (error) {
          toast.error("Failed to delete subcategory");
        }
      }
    } else {
      const updatedList = subcategoryList.filter((_, i) => i !== index);
      setSubcategoryList(updatedList);
    }
  };

  const handleFieldChange = (index: number, value: string) => {
    const updatedList = [...subcategoryList];
    updatedList[index].name = value;
    setSubcategoryList(updatedList);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const newSubcategories = subcategoryList.filter(
        (sub: any) => sub.isNew && sub.name.trim() !== ""
      );
      const updatedSubcategories = subcategoryList.filter(
        (sub: any) => !sub.isNew
      );

      if (newSubcategories.length > 0) {
        await fetch(`/api/categories/subcategories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            newSubcategories.map((sub: any) => ({ name: sub.name, categoryId }))
          ),
        });
      }

      if (updatedSubcategories.length > 0) {
        await Promise.all(
          updatedSubcategories.map((sub: any) =>
            fetch(`/api/categories/subcategories/${sub.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: sub.name }),
            })
          )
        );
      }

      toast.success("Subcategories updated successfully!");
      onSuccess();
    } catch (error) {
      toast.error("Failed to update subcategories");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="space-y-4">
        {subcategoryList.map((subcategory: any, index: number) => (
          <div
            key={index}
            className="group flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-100 dark:border-gray-600 transition-all hover:shadow-md"
          >
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-8">
              {index + 1}.
            </span>
            <div className="flex-1">
              <Input
                type="text"
                value={subcategory.name}
                onChange={(e) => handleFieldChange(index, e.target.value)}
                placeholder="Enter subcategory name"
                required
                className="w-full bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveField(index, subcategory.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            >
              <TrashIcon className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        ))}
      </div>

      {subcategoryList.length === 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <FolderIcon className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No subcategories added yet
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          onClick={handleAddField}
          variant="outline"
          className="flex-1 sm:flex-none"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Subcategory
        </Button>
        <Button
          type="submit"
          disabled={!isChanged}
          className="flex-1 sm:flex-none"
        >
          {subcategoryList.length > 0 ? (
            <>
              <CheckIcon className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            "Update Subcategories"
          )}
        </Button>
      </div>

      {isChanged && (
        <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
          <AlertCircleIcon className="h-4 w-4" />
          You have unsaved changes
        </p>
      )}
    </form>
  );
}
