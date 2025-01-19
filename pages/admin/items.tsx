import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PlusIcon,
  TrashIcon,
  MoreVerticalIcon,
  ImageIcon,
  SaveIcon,
  EyeIcon,
  DollarSignIcon,
  TagIcon,
  UserIcon,
  Loader2Icon,
  PencilIcon,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Lot {
  id: string;
  title: string;
  lotNumber: string;
  startingPrice: number;
  estimatedPrice: number;
  currentBid?: number;
  images: string[];
  auction: {
    id: string;
    title: string;
  };
  categories: {
    id: string;
    name: string;
  }[];
  _count: {
    bidHistory: number;
  };
}

export default function ItemsPage() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);

  const fetchLots = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/lots");
      const data = await response.json();
      setLots(data);
    } catch (error) {
      console.error("Error fetching lots:", error);
      toast.error("Failed to fetch lots");
    } finally {
      setIsLoading(false);
    }
  };

  // Add useEffect to fetch lots on component mount
  useEffect(() => {
    fetchLots();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/lots/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      setLots(lots.filter((lot) => lot.id !== id));
      toast.success("Item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  // Table columns definition
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "lotNumber",
      header: "Lot #",
      cell: ({ row }) => {
        const value = row.original.lotNumber;
        return <span>{value}</span>;
      },
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "auction.title",
      header: "Auction",
    },
    {
      accessorKey: "startingBid",
      header: "Starting Bid",
      cell: ({ row }) => {
        const value = row.original.startingBid;
        return value ? (
          <span>${parseFloat(value).toLocaleString()}</span>
        ) : (
          <span>-</span>
        );
      },
    },
    {
      accessorKey: "estimatedPrice",
      header: "Estimated Price",
      cell: ({ row }) => {
        const value = row.original.estimatedPrice;
        return value ? (
          <span>${parseFloat(value).toLocaleString()}</span>
        ) : (
          <span>-</span>
        );
      },
    },
    {
      accessorKey: "categories",
      header: "Categories",
      cell: ({ row }) => (
        <div className="flex gap-1 flex-wrap">
          {row.original.categories.map((cat: any) => (
            <Badge key={cat.id} variant="secondary">
              {cat.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "bidHistory",
      header: "Bids",
      cell: ({ row }) => {
        const [isDialogOpen, setIsDialogOpen] = useState(false);

        return (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
            >
              {row.original._count.bidHistory} bids
            </Button>

            <BidHistoryDialog
              lot={row.original}
              open={isDialogOpen}
              setOpen={setIsDialogOpen}
            />
          </>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSelectedLot(row.original);
                setIsDialogOpen(true);
              }}
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => handleDelete(row.original.id)}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Auction Items</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items Management</CardTitle>
          <CardDescription>
            Manage all auction items across different auctions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={lots}
            isLoading={isLoading}
            searchKey="lotNumber"
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedLot ? "Edit Item" : "Add New Item"}
            </DialogTitle>
          </DialogHeader>
          <LotForm
            lot={selectedLot}
            onSuccess={() => {
              setIsDialogOpen(false);
              setSelectedLot(null);
              fetchLots();
            }}
            setIsOpen={setIsDialogOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LotForm({
  lot,
  onSuccess,
  setIsOpen,
}: {
  lot?: any;
  onSuccess: () => void;
  setIsOpen: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState({
    title: lot?.title || "",
    description: lot?.description || "",
    startingBid: lot?.startingBid || "",
    estimatedPrice: lot?.estimatedPrice || "",
    lotNumber: lot?.lotNumber || "",
    auctionId: lot?.auction?.id || "",
    categories: lot?.categories?.map((cat: any) => cat.id) || [],
    images: lot?.images || [],
    artist: lot?.artist || "",
    year: lot?.year || "",
    medium: lot?.medium || "",
    height: lot?.height || "",
    width: lot?.width || "",
    condition: lot?.condition || "",
    provenance: lot?.provenance || "",
    signature: lot?.signature || "",
    edition: lot?.edition || "",
    literature: lot?.literature || "",
    exhibition: lot?.exhibition || "",
    notes: lot?.notes || "",
  });

  const [auctions, setAuctions] = useState<Array<any>>([]);
  const [categories, setCategories] = useState<Array<any>>([]);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [auctionsRes, categoriesRes] = await Promise.all([
          fetch("/api/auctions"),
          fetch("/api/categories"),
        ]);

        const [auctionsData, categoriesData] = await Promise.all([
          auctionsRes.json(),
          categoriesRes.json(),
        ]);

        // Extract the auctions array from the nested structure
        setAuctions(auctionsData.data || []);
        setCategories(categoriesData || []); // Categories API might not be nested

        console.log("Processed auctions:", auctionsData.data);
        console.log("Processed categories:", categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch form data");
      }
    };

    fetchData();
  }, []);

  // Add debug renders
  useEffect(() => {
    console.log("Current auctions state:", auctions);
    console.log("Current categories state:", categories);
  }, [auctions, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate only mandatory fields
    if (!formData.title || !formData.auctionId || !formData.lotNumber) {
      toast.error("Please fill in title, auction and lot number");
      return;
    }

    try {
      const payload = {
        // Mandatory fields
        title: formData.title,
        auctionId: formData.auctionId,
        lotNumber: formData.lotNumber as string,

        // Optional fields - will be null/empty if not provided
        description: formData.description,
        startingBid: parseFloat(formData.startingBid),
        estimatedPrice: formData.estimatedPrice as string,
        categories: formData.categories,
        images: formData.images,
        artist: formData.artist as string,
        year: formData.year as string,
        medium: formData.medium as string,
        height: parseFloat(formData.height),
        width: parseFloat(formData.width),
        condition: formData.condition as string,
        provenance: formData.provenance as string,
        signature: formData.signature as string,
        edition: formData.edition as string,
      };

      const response = await fetch("/api/lots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to save lot");
      }

      toast.success("Lot created successfully");
      onSuccess();
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving lot:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save lot"
      );
    }
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
        toast.success("Image uploaded successfully");
      } else {
        throw new Error(data.error.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6">
      {/* Mandatory Fields */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Mandatory Fields
          </h3>
          <span className="text-xs text-red-500">*</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
              className="w-full"
              placeholder="Enter lot title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Auction <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.auctionId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, auctionId: value }))
              }
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select auction" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(auctions) &&
                  auctions.map((auction) => (
                    <SelectItem key={auction.id} value={auction.id}>
                      {auction.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lot Number <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.lotNumber}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lotNumber: e.target.value }))
              }
              className="w-full"
              placeholder="Enter lot number"
            />
          </div>
        </div>
      </div>

      {/* Optional Fields */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Additional Details
          </h3>
          <Badge variant="secondary">Optional</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Artist & Year */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Artist
              </label>
              <Input
                value={formData.artist}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, artist: e.target.value }))
                }
                className="w-full"
                placeholder="Artist name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Year
              </label>
              <Input
                value={formData.year}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, year: e.target.value }))
                }
                className="w-full"
                placeholder="Year of creation"
              />
            </div>
          </div>

          {/* Medium & Dimensions */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Medium
              </label>
              <Input
                value={formData.medium}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, medium: e.target.value }))
                }
                className="w-full"
                placeholder="e.g., Oil on canvas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Height
              </label>
              <Input
                value={formData.height}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, height: e.target.value }))
                }
                className="w-full"
                placeholder="Enter height"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Width
              </label>
              <Input
                value={formData.width}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, width: e.target.value }))
                }
                className="w-full"
                placeholder="Enter width"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categories
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={category.id}
                      checked={formData.categories.includes(category.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData((prev) => ({
                            ...prev,
                            categories: [...prev.categories, category.id],
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            categories: prev.categories.filter(
                              (id: any) => id !== category.id
                            ),
                          }));
                        }
                      }}
                    />
                    <label
                      htmlFor={category.id}
                      className="text-sm text-gray-600 dark:text-gray-400"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
            </div>
          </div>

          {/* Condition & Provenance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Condition
            </label>
            <Textarea
              value={formData.condition}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, condition: e.target.value }))
              }
              className="min-h-[100px]"
              placeholder="Describe the condition of the item"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Provenance
            </label>
            <Textarea
              value={formData.provenance}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, provenance: e.target.value }))
              }
              className="min-h-[100px]"
              placeholder="History of ownership"
            />
          </div>

          {/* Literature & Exhibition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Literature
            </label>
            <Textarea
              value={formData.literature}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  literature: e.target.value,
                }))
              }
              className="min-h-[100px]"
              placeholder="Published references"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Exhibition History
            </label>
            <Textarea
              value={formData.exhibition}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  exhibition: e.target.value,
                }))
              }
              className="min-h-[100px]"
              placeholder="Previous exhibitions"
            />
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Images
            </label>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e: any) => handleImageUpload(e.target.files?.[0])}
                  className="flex-1"
                />
                {imageUploading && (
                  <div className="flex items-center gap-2">
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-500">Uploading...</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.images.map((img: any, index: any) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={img}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          const newImages = [...formData.images];
                          newImages.splice(index, 1);
                          setFormData((prev) => ({
                            ...prev,
                            images: newImages,
                          }));
                        }}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notes & Additional Info */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Notes
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="min-h-[100px]"
              placeholder="Any additional information"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500">
          <span className="text-red-500">*</span> Required fields
        </p>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={imageUploading}
            className="min-w-[100px]"
          >
            {imageUploading ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <SaveIcon className="h-4 w-4 mr-2" />
                {lot ? "Update" : "Create"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

// Bid History Dialog Component
function BidHistoryDialog({
  lot,
  open,
  setOpen,
}: {
  lot: Lot | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [bidHistory, setBidHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBidHistory = async () => {
      if (!lot) return;
      setLoading(true);

      try {
        const response = await fetch(`/api/lots/${lot.id}/bids`);
        if (!response.ok) throw new Error("Failed to fetch bid history");

        const data = await response.json();
        setBidHistory(data);
      } catch (error) {
        console.error("Error fetching bid history:", error);
        toast.error("Failed to fetch bid history");
      } finally {
        setLoading(false);
      }
    };

    if (open && lot) {
      fetchBidHistory();
    }
  }, [lot, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bid History - {lot?.title}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {bidHistory.length > 0 ? (
              bidHistory.map((bid) => (
                <div
                  key={bid.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{bid.bidder}</p>
                      <p className="text-sm text-gray-500">{bid.bidder}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${parseFloat(bid.amount || "0").toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(bid.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No bids yet</div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
