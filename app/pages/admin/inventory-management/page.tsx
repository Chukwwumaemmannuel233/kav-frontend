"use client";

import { useState } from "react";
import { Search, Filter, Plus, Minus, AlertCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation"; // ✅ INITIALIZE ROUTER

type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  sku: string;
  variant: {
    color: string;
    unit: string;
  };
  stockLevel: number;
  maxStock: number;
  status: StockStatus;
};

export default function InventoryManagement() {
  const router = useRouter(); // ✅ INITIALIZE ROUTER
  const [isUpdate, setUpdate] = useState(false);
  const [isDiscard, setDiscard] = useState(false);
  const [filterTab, setFilterTab] = useState<
    "all" | "low-stock" | "out-of-stock"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [unsavedChanges, setUnsavedChanges] = useState(2);

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Organic Linen Blend",
      category: "Natural Fabrics",
      image: "/beige-linen-fabric-texture.jpg",
      sku: "LIN-001-NVY",
      variant: { color: "Navy", unit: "50m Roll" },
      stockLevel: 124,
      maxStock: 500,
      status: "in-stock",
    },
    {
      id: "2",
      name: "Premium Cotton Voile",
      category: "Sheer Fabrics",
      image: "/white-cotton-fabric-texture.jpg",
      sku: "COT-V-WHT",
      variant: { color: "White", unit: "10m Bolt" },
      stockLevel: 5,
      maxStock: 500,
      status: "low-stock",
    },
    {
      id: "3",
      name: "Silk Charmeuse",
      category: "Luxury Silks",
      image: "/red-silk-fabric-texture.jpg",
      sku: "SLK-CH-RED",
      variant: { color: "Ruby Red", unit: "Yard" },
      stockLevel: 0,
      maxStock: 500,
      status: "out-of-stock",
    },
    {
      id: "4",
      name: "Merino Wool Felt",
      category: "Heavyweights",
      image: "/charcoal-wool-fabric-texture.jpg",
      sku: "WOOL-GRY-100",
      variant: { color: "Charcoal", unit: "Meter" },
      stockLevel: 86,
      maxStock: 500,
      status: "in-stock",
    },
    {
      id: "5",
      name: "Heavy Duty Canvas",
      category: "Utility",
      image: "/natural-canvas-fabric-texture.jpg",
      sku: "CNV-NAT-10",
      variant: { color: "Natural", unit: "Yard" },
      stockLevel: 230,
      maxStock: 500,
      status: "in-stock",
    },
  ]);

  const updateStock = (id: string, change: number) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? {
              ...p,
              stockLevel: Math.max(
                0,
                Math.min(p.maxStock, p.stockLevel + change)
              ),
            }
          : p
      )
    );
    setUnsavedChanges((prev) => prev + 1);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterTab === "low-stock")
      return matchesSearch && product.status === "low-stock";
    if (filterTab === "out-of-stock")
      return matchesSearch && product.status === "out-of-stock";
    return matchesSearch;
  });

  const getStatusBadge = (status: StockStatus) => {
    switch (status) {
      case "in-stock":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
            In Stock
          </span>
        );
      case "low-stock":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
            Low Stock!
          </span>
        );
      case "out-of-stock":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium">
            <AlertCircle size={12} />
            Out of Stock
          </span>
        );
    }
  };

  const handleDiscard = async (e:React.FormEvent) => {
    // Reset to original state or refetch data
     e.preventDefault();
    setDiscard(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800));


    setUnsavedChanges(0);

    setDiscard(false);

  };

  const handleUpdateInventory = async (e: React.FormEvent) => {
    // Save changes to backend
    e.preventDefault();
    setUpdate(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Redirect after login
    // router.push("/pages/admin/notification-details");
    setUnsavedChanges(0);

    setUpdate(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f1ed]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-32 md:pb-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-4">
          <a
            href="/pages/admin/dashboard"
            className="text-[#d97638] hover:underline"
          >
            Dashboard
          </a>
          <span className="text-gray-400">›</span>
          <span className="text-gray-900">Inventory</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Inventory Management
          </h1>
          <p className="text-[#a67c52] text-sm sm:text-base">
            Track stock levels, variants, and update quantities.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a67c52]"
                size={20}
              />
              <input
                type="text"
                placeholder="Search product name, SKU, or variant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f6] border border-[#e8dfd6] rounded-lg text-sm placeholder:text-[#a67c52] focus:outline-none focus:ring-2 focus:ring-[#d97638]"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterTab("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterTab === "all"
                    ? "bg-[#d97638] text-white"
                    : "bg-[#faf8f6] text-gray-700 hover:bg-[#e8dfd6]"
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => setFilterTab("low-stock")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  filterTab === "low-stock"
                    ? "bg-orange-100 text-orange-700 border border-orange-300"
                    : "bg-[#faf8f6] text-gray-700 hover:bg-[#e8dfd6]"
                }`}
              >
                Low Stock
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              </button>
              <button
                onClick={() => setFilterTab("out-of-stock")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  filterTab === "out-of-stock"
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : "bg-[#faf8f6] text-gray-700 hover:bg-[#e8dfd6]"
                }`}
              >
                Out of Stock
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium bg-[#faf8f6] text-gray-700 hover:bg-[#e8dfd6] transition flex items-center gap-2">
                <Filter size={16} />
                Category
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-[#faf8f6] border-b border-[#e8dfd6]">
            <div className="col-span-4 text-xs font-semibold text-[#a67c52] uppercase tracking-wider">
              Product Details
            </div>
            <div className="col-span-3 text-xs font-semibold text-[#a67c52] uppercase tracking-wider">
              SKU / Variant
            </div>
            <div className="col-span-3 text-xs font-semibold text-[#a67c52] uppercase tracking-wider">
              Stock Level
            </div>
            <div className="col-span-2 text-xs font-semibold text-[#a67c52] uppercase tracking-wider">
              Status
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#e8dfd6]">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 sm:px-6 py-4 hover:bg-[#faf8f6] transition"
              >
                {/* Product Details */}
                <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#a67c52]">
                      Category: {product.category}
                    </p>
                    <div className="mt-2 md:hidden">
                      {getStatusBadge(product.status)}
                    </div>
                  </div>
                </div>

                {/* SKU / Variant */}
                <div className="col-span-1 md:col-span-3 flex flex-col justify-center">
                  <p className="font-medium text-gray-900 mb-1">
                    {product.sku}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-[#a67c52]">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        product.variant.color === "Navy"
                          ? "bg-blue-900"
                          : product.variant.color === "White"
                          ? "bg-gray-100 border border-gray-300"
                          : product.variant.color === "Ruby Red"
                          ? "bg-red-600"
                          : product.variant.color === "Charcoal"
                          ? "bg-gray-700"
                          : "bg-amber-100 border border-amber-300"
                      }`}
                    ></span>
                    <span>
                      {product.variant.color} / {product.variant.unit}
                    </span>
                  </div>
                </div>

                {/* Stock Level Controls */}
                <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                  <button
                    onClick={() => updateStock(product.id, -1)}
                    className="w-8 h-8 rounded-lg border border-[#e8dfd6] hover:bg-[#faf8f6] flex items-center justify-center transition"
                    disabled={product.stockLevel === 0}
                  >
                    <Minus size={16} className="text-gray-600" />
                  </button>
                  <div className="flex-1 text-center">
                    <span className="font-semibold text-gray-900 text-lg">
                      {product.stockLevel}
                    </span>
                  </div>
                  <button
                    onClick={() => updateStock(product.id, 1)}
                    className="w-8 h-8 rounded-lg border border-[#e8dfd6] hover:bg-[#faf8f6] flex items-center justify-center transition"
                    disabled={product.stockLevel >= product.maxStock}
                  >
                    <Plus size={16} className="text-gray-600" />
                  </button>
                  <span className="text-sm text-[#a67c52] whitespace-nowrap">
                    / {product.maxStock} max
                  </span>
                </div>

                {/* Status */}
                <div className="hidden md:flex col-span-2 items-center">
                  {product.status === "low-stock" ? (
                    <span className="text-[#d97638] font-medium text-sm">
                      Low Stock!
                    </span>
                  ) : (
                    getStatusBadge(product.status)
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-[#e8dfd6] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#a67c52]">
              Showing <span className="font-medium text-gray-900">1-5</span> of{" "}
              <span className="font-medium text-gray-900">128</span> items
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg border border-[#e8dfd6] text-sm font-medium text-gray-700 hover:bg-[#faf8f6] transition">
                Previous
              </button>
              <button className="px-4 py-2 rounded-lg border border-[#e8dfd6] text-sm font-medium text-gray-700 hover:bg-[#faf8f6] transition">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Bar */}
      {unsavedChanges > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#d97638] shadow-lg z-50 md:mb-0 mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm">
              <AlertCircle className="text-[#d97638]" size={20} />
              <span className="text-gray-900">
                You have{" "}
                <span className="font-semibold text-[#d97638]">
                  {unsavedChanges} unsaved changes
                </span>{" "}
                to your inventory.
              </span>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                onClick={handleDiscard}
                isLoading={isDiscard}
                loadingText="Discarding..."
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-[#e8dfd6] text-sm font-medium text-gray-700 hover:bg-[#faf8f6] transition"
              >
                Discard
              </Button>
              <Button
                onClick={handleUpdateInventory}
                isLoading={isUpdate}
                loadingText="Updating..."
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-[#d97638] text-white text-sm font-medium hover:bg-[#c4671f] transition flex items-center justify-center gap-2"
              >
                Update Inventory
                <span>→</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
