import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import router, { useRouter } from "next/router";
import { Auction, Category } from "@prisma/client";
import { format } from "date-fns";
import Loading from "@/components/Loading";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDownIcon,
  Images,
  ListIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  StarIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { IMAGES } from "@/config/images";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CalendarIcon,
  UserIcon,
  TagIcon,
  CalendarDaysIcon,
  ImageIcon,
  Loader2Icon,
  SaveIcon,
} from "lucide-react";
import { XIcon } from "lucide-react";

interface AuctionsPageProps {
  auctions: Auction[];
  totalPages: number;
  currentPage: number;
}
import Image from "next/image";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const [auctions, total] = await Promise.all([
      prisma.auction.findMany({
        skip,
        take: limit,
        orderBy: { startDate: "desc" },
        include: {
          categories: true,
          lots: {
            select: {
              id: true,
            },
          },
        },
      }),
      prisma.auction.count(),
    ]);

    return {
      props: {
        auctions: JSON.parse(JSON.stringify(auctions)),
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Failed to fetch auctions:", error);
    return {
      props: {
        auctions: [],
        totalPages: 0,
        currentPage: 1,
      },
    };
  }
};

export default function AuctionsPage({
  auctions,
  totalPages,
  currentPage,
}: AuctionsPageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingAuction, setEditingAuction] = useState<Auction | null>(null);
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "venueType",
      header: "Venue Type",
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => format(new Date(row.original.startDate), "PPP"),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => format(new Date(row.original.endDate), "PPP"),
    },
    {
      accessorKey: "lots",
      header: "Lots",
      cell: ({ row }) => row.original.lots?.length ?? 0,
    },
    {
      accessorKey: "isPublished",
      header: "Published",
      cell: ({ row }) => {
        return (
          <Badge
            variant={row.original.isPublished ? "outline" : "destructive"}
            className="cursor-pointer"
            onClick={async () => {
              const auctionId = row.original.id as string;
              toast.promise(
                fetch(`/api/auctions/${auctionId}/status`, {
                  method: "PATCH",
                  body: JSON.stringify({ isPublished: " " }),
                }),
                {
                  loading: "Updating auction...",
                  success: "Auction updated successfully",
                  error: "Failed to update auction",
                }
              );
              refreshData();
            }}
          >
            {row.original.isPublished ? "Published" : "Draft"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isFeatured",
      header: "Featured",
      cell: ({ row }) => {
        return (
          <Badge
            variant={row.original.isFeatured ? "outline" : "secondary"}
            className="cursor-pointer"
            onClick={async () => {
              const auctionId = row.original.id as string;
              toast.promise(
                fetch(`/api/auctions/${auctionId}/feature`, {
                  method: "PATCH",
                  body: JSON.stringify({ isFeatured: " " }),
                }),
                {
                  loading: "Updating auction...",
                  success: "Auction updated successfully",
                  error: "Failed to update auction",
                }
              );
              refreshData();
            }}
          >
            {row.original.isFeatured ? (
              <div className="flex items-center gap-2">
                <StarIcon className="h-4 w-4 text-yellow-400" />
                <span>Featured</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <StarIcon className="h-4 w-4 text-gray-400" />
                <span>Not Featured</span>
              </div>
            )}
          </Badge>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions (edit | lots | delete)",
      cell: ({ row }) => {
        return (
          <div className="space-x-2 flex items-center justify-center md:flex-row flex-col gap-2 ">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditingAuction(row.original);
                setIsOpen(true);
              }}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(`/admin/auctions/${row.original.id}/lots`)
                    }
                  >
                    <ListIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Lots</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                if (confirm("Are you sure you want to delete this auction?")) {
                  try {
                    const auctionId = row.original.id as string;
                    toast.promise(
                      fetch(`/api/auctions/${auctionId}`, {
                        method: "DELETE",
                      }),
                      {
                        loading: "Deleting auction...",
                        success: "Auction deleted successfully",
                        error: "Failed to delete auction",
                      }
                    );
                    refreshData();
                  } catch (error) {
                    toast.error("Failed to delete auction");
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
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Auctions</h2>
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setEditingAuction(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>Create Auction</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>
                {editingAuction ? "Edit Auction" : "Create New Auction"}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[600px]">
              <AuctionForm
                auction={editingAuction}
                onSuccess={() => {
                  setIsOpen(false);
                  setEditingAuction(null);
                  refreshData();
                }}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <div className="overflow-x-auto p-4">
          <DataTable<any, ColumnDef<any>>
            columns={columns}
            data={auctions}
            totalPages={totalPages}
            cp={currentPage}
            searchKey="title"
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
function AuctionForm({ auction, onSuccess }: any) {
  const [formData, setFormData] = useState({
    title: auction?.title || "",
    startDate: auction?.startDate
      ? new Date(auction.startDate).toISOString().slice(0, 16)
      : "",
    endDate: auction?.endDate
      ? new Date(auction.endDate).toISOString().slice(0, 16)
      : "",
    description: auction?.description || "",
    auctioneer: auction?.auctioneer || "",
    contactPersonName: auction?.contactPersonName || "",
    contactPersonEmail: auction?.contactPersonEmail || "",
    contactPersonPhone: auction?.contactPersonPhone || "",
    registrationDeadline: auction?.registrationDeadline
      ? new Date(auction.registrationDeadline).toISOString().slice(0, 16)
      : "",
    categories: auction?.categories?.map((cat: any) => cat.id) || [],
    images: Array.isArray(auction?.images) ? auction.images : [],
    viewingDates:
      auction?.viewingDates?.map((date: any) => ({
        start: new Date(date.start).toISOString().slice(0, 16),
        end: new Date(date.end).toISOString().slice(0, 16),
      })) || [],
    location: Array.isArray(auction?.location) ? auction.location : [],
    tags: Array.isArray(auction?.tags) ? auction.tags : [],
    status: auction?.status || "UPCOMING",
    venueType: auction?.venueType || "ONLINE",
    isPublished: auction?.isPublished || false,
    isFeatured: auction?.isFeatured || false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const venueTypes = ["ONLINE", "IN_PERSON"] as const;

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (selectedValues: string[]) => {
    setFormData((prev) => ({
      ...prev,
      categories: selectedValues,
    }));
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, data.secure_url],
        }));
      } else {
        throw new Error(data.error.message);
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleAddViewingDate = () => {
    setFormData((prev) => ({
      ...prev,
      viewingDates: [...prev.viewingDates, { start: "", end: "" }],
    }));
  };

  const handleRemoveViewingDate = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      viewingDates: prev.viewingDates.filter(
        (_: any, i: number) => i !== index
      ),
    }));
  };

  const handleViewingDateChange = (
    index: number,
    key: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      viewingDates: prev.viewingDates.map((date: any, i: number) =>
        i === index ? { ...date, [key]: value } : date
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (new Date(formData.startDate) < new Date()) {
      toast.error("Start date cannot be in the past");
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error("End date cannot be before start date");
      return;
    }

    try {
      const response = await fetch(
        `/api/auctions${auction ? `/${auction.id}` : ""}`,
        {
          method: auction ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to save auction");

      toast.success(`Auction ${auction ? "updated" : "created"} successfully`);
      onSuccess();
    } catch (error) {
      toast.error(`Failed to ${auction ? "update" : "create"} auction`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Mandatory Fields Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Mandatory Fields
          </h3>
          <span className="text-xs text-red-500">*</span>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              required
              className="w-full bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary/20"
              placeholder="Enter auction title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleFieldChange("startDate", e.target.value)
                  }
                  required
                  className="w-full pl-10 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleFieldChange("endDate", e.target.value)}
                  required
                  className="w-full pl-10 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Fields Section */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <div className="group flex items-center justify-between w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Optional Fields
              </h3>
              <Badge variant="outline" className="text-xs">
                Additional Info
              </Badge>
            </div>
            <ChevronDownIcon className="h-5 w-5 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                  className="w-full min-h-[120px] bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter auction description"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  <TagIcon className="h-4 w-4" />
                  Categories
                </h4>
                {isLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center space-x-3 p-2 rounded-md hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      >
                        <Checkbox
                          id={cat.id}
                          name={cat.name}
                          checked={formData.categories.includes(cat.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleCategoryChange([
                                ...formData.categories,
                                cat.id,
                              ]);
                            } else {
                              handleCategoryChange(
                                formData.categories.filter(
                                  (id: any) => id !== cat.id
                                )
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={cat.id}
                          className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                        >
                          {cat.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="auctioneer"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Auctioneer
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="auctioneer"
                    name="auctioneer"
                    value={formData.auctioneer}
                    onChange={(e) =>
                      handleFieldChange("auctioneer", e.target.value)
                    }
                    className="w-full pl-10 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter auctioneer name"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Images
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e: any) =>
                        handleImageUpload(e.target.files?.[0])
                      }
                      className="flex-1 bg-gray-50 dark:bg-gray-700"
                    />
                    {imageUploading && (
                      <div className="flex items-center gap-2 text-primary">
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                      </div>
                    )}
                  </div>

                  {formData.images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {formData.images.map((img: any, index: number) => (
                        <div
                          key={index}
                          className="relative group aspect-square"
                        >
                          <Image
                            src={img}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                            width={100}
                            height={100}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                const newImages = [...formData.images];
                                newImages.splice(index, 1);
                                handleFieldChange("images", newImages);
                              }}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-750 rounded-lg">
                      <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        No images uploaded
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="venueType"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Venue Type
                </label>
                <Select
                  value={formData.venueType}
                  onValueChange={(value) =>
                    handleFieldChange("venueType", value)
                  }
                >
                  <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700">
                    <SelectValue placeholder="Select venue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {venueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Locations
                </label>
                <div className="space-y-3">
                  {formData.location.map((loc: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={loc}
                        onChange={(e) => {
                          const newLocations = [...formData.location];
                          newLocations[index] = e.target.value;
                          handleFieldChange("location", newLocations);
                        }}
                        placeholder="Enter location"
                        className="flex-1 bg-gray-50 dark:bg-gray-700"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newLocations = formData.location.filter(
                            (_: any, i: any) => i !== index
                          );
                          handleFieldChange("location", newLocations);
                        }}
                        className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleFieldChange("location", [...formData.location, ""]);
                    }}
                    className="w-full"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Location
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-750 rounded-lg min-h-[44px]">
                    {formData.tags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => {
                            const newTags = formData.tags.filter(
                              (_: any, i: any) => i !== index
                            );
                            handleFieldChange("tags", newTags);
                          }}
                        >
                          <XIcon className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter tag"
                      className="flex-1 bg-gray-50 dark:bg-gray-700"
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter" && e.currentTarget.value) {
                          e.preventDefault();
                          const newTag = e.currentTarget.value.trim();
                          if (newTag && !formData.tags.includes(newTag)) {
                            handleFieldChange("tags", [
                              ...formData.tags,
                              newTag,
                            ]);
                            e.currentTarget.value = "";
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget
                          .previousElementSibling as HTMLInputElement;
                        const newTag = input.value.trim();
                        if (newTag && !formData.tags.includes(newTag)) {
                          handleFieldChange("tags", [...formData.tags, newTag]);
                          input.value = "";
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Viewing Dates at the bottom */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <CalendarDaysIcon className="h-4 w-4" />
                Viewing Dates
              </h4>
              <Button
                type="button"
                onClick={handleAddViewingDate}
                variant="outline"
                size="sm"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Date
              </Button>
            </div>

            {formData.viewingDates.length > 0 ? (
              <div className="space-y-3">
                {formData.viewingDates.map((date: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-750 rounded-lg group"
                  >
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                      {index + 1}.
                    </span>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <Input
                        type="datetime-local"
                        value={date.start}
                        onChange={(e) =>
                          handleViewingDateChange(
                            index,
                            "start",
                            e.target.value
                          )
                        }
                        required
                        className="bg-white dark:bg-gray-700"
                      />
                      <Input
                        type="datetime-local"
                        value={date.end}
                        onChange={(e) =>
                          handleViewingDateChange(index, "end", e.target.value)
                        }
                        required
                        className="bg-white dark:bg-gray-700"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveViewingDate(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 dark:bg-gray-750 rounded-lg">
                <CalendarDaysIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No viewing dates added</p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="text-red-500">*</span> Required fields
        </p>
        <Button
          type="submit"
          className="min-w-[200px]"
          disabled={imageUploading}
        >
          {imageUploading ? (
            <Loader2Icon className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <SaveIcon className="h-4 w-4 mr-2" />
              {auction ? "Update Auction" : "Create Auction"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
