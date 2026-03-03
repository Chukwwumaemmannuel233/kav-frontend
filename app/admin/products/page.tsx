"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Plus, Pencil } from "lucide-react";
import API from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  category: string;
  image_url: string;
  stock_quantity: number;
  variants: { type: string; price: number }[];
}

export default function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCategory, setShowCategory] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const close = () => setShowCategory(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/admin/products?limit=50");

      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="p-10">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0">
      <div className="px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/admin/dashboard"
            className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center hover:bg-neutral-300 transition"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Product Management</h1>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex-1 relative mb-8">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            size={20}
          />

          <input
            type="text"
            onClick={(e) => e.stopPropagation()}
            placeholder="Search products..."
            value={searchQuery}
            onFocus={() => setShowCategory(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          {/* CATEGORY DROPDOWN */}
          {showCategory && (
            <div className="absolute w-full bg-white border rounded-lg shadow-lg mt-2 z-50">
              {["all", "cotton", "silk", "linen", "wool"].map((cat) => (
                <div
                  key={cat}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(cat);
                    setShowCategory(false);
                  }}
                  className="px-4 py-3 hover:bg-neutral-100 cursor-pointer capitalize"
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Table */}
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          {/* Table Header - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 bg-neutral-100 border-b border-neutral-200 font-semibold">
            <div>Product Name</div>
            <div>Price</div>
            <div>Stock</div>
            <div>Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-neutral-200">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 px-4 md:px-6 py-4 hover:bg-neutral-50 transition"
              >
                {/* PRODUCT */}
                <div className="flex items-center justify-between md:block">
                  <span className="text-xs text-neutral-500 md:hidden">
                    Product
                  </span>

                  <div className="flex items-center gap-3">
                    <img
                      src={product.image_url}
                      className="w-12 h-12 rounded object-cover border"
                    />
                    <span className="font-medium max-w-[160px] truncate">
                      {product.name}
                    </span>
                  </div>
                </div>

                {/* PRICE */}
                <div className="flex justify-between md:block">
                  <span className="text-xs text-neutral-500 md:hidden">
                    Price
                  </span>
                  <span>
                    ₦
                    {Number(product.variants?.[0]?.price || 0).toLocaleString()}
                  </span>
                </div>

                {/* STOCK */}
                <div className="flex justify-between md:block">
                  <span className="text-xs text-neutral-500 md:hidden">
                    Stock
                  </span>
                  <span>{product.stock_quantity} units</span>
                </div>

                {/* ACTION */}
                <div className="flex justify-between md:block">
                  <span className="text-xs text-neutral-500 md:hidden">
                    Actions
                  </span>
                  <Link href={`/admin/products/${product.id}`}>
                    <button className="flex items-center gap-2 text-sm hover:text-black">
                      View
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No results message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            No products found matching your search.
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => router.push("/admin/add-product")}
        className="fixed bottom-24 md:bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-neutral-800 transition z-40"
      >
        <Plus size={24} />
      </button>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowAddModal(false);
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price (per meter)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stock (units)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400">
                    <option value="cotton">Cotton</option>
                    <option value="silk">Silk</option>
                    <option value="linen">Linen</option>
                    <option value="wool">Wool</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800 transition"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
