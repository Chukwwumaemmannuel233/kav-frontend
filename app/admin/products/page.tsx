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
  <div className="min-h-screen bg-white dark:bg-neutral-950 pb-24 md:pb-0">
    
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/dashboard"
          className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition"
        >
          <ArrowLeft size={20} className="text-black dark:text-white" />
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
          Product Management
        </h1>
      </div>

      {/* Search */}
      <div className="flex-1 relative mb-8">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          size={20}
        />

        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onFocus={() => setShowCategory(true)}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="
            w-full pl-12 pr-4 py-3 rounded-lg border
            border-neutral-300 dark:border-neutral-700
            bg-white dark:bg-neutral-900
            text-black dark:text-white
            placeholder:text-neutral-400
            focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
          "
        />

        {/* Dropdown */}
        {showCategory && (
          <div className="absolute w-full mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-50">
            {["all", "cotton", "silk", "linen", "wool"].map((cat) => (
              <div
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowCategory(false);
                }}
                className="px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer capitalize text-black dark:text-white"
              >
                {cat}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">

        {/* Header */}
        <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 font-semibold text-black dark:text-white">
          <div>Product Name</div>
          <div>Price</div>
          <div>Stock</div>
          <div>Actions</div>
        </div>

        {/* Body */}
        <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 px-4 md:px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
            >
              
              {/* PRODUCT */}
              <div className="flex items-center justify-between md:block">
                <span className="text-xs text-neutral-500 md:hidden">
                  Product
                </span>

                <div className="flex items-center gap-3">
                  <img
                    src={product.image_url}
                    className="w-12 h-12 rounded object-cover border border-neutral-200 dark:border-neutral-700"
                  />
                  <span className="font-medium max-w-[160px] truncate text-black dark:text-white">
                    {product.name}
                  </span>
                </div>
              </div>

              {/* PRICE */}
              <div className="flex justify-between md:block text-black dark:text-white">
                <span className="text-xs text-neutral-500 md:hidden">
                  Price
                </span>
                <span>
                  ₦{Number(product.variants?.[0]?.price || 0).toLocaleString()}
                </span>
              </div>

              {/* STOCK */}
              <div className="flex justify-between md:block text-black dark:text-white">
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
                  <button className="text-sm font-medium text-black dark:text-white hover:opacity-70">
                    View
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
          No products found matching your search.
        </div>
      )}
    </div>

    {/* Floating Button */}
    <button
      onClick={() => router.push("/admin/add-product")}
      className="
        fixed bottom-24 md:bottom-8 right-8 w-14 h-14 rounded-full
        bg-black text-white hover:bg-neutral-800
        dark:bg-white dark:text-black dark:hover:bg-neutral-200
        flex items-center justify-center shadow-lg transition z-40
      "
    >
      <Plus size={24} />
    </button>

    {/* Modal */}
    {showAddModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        
        <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-md w-full p-6 border border-neutral-200 dark:border-neutral-700">

          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
            Add New Product
          </h2>

          <form onSubmit={(e) => e.preventDefault()}>

            <div className="space-y-4">

              <input className="input" placeholder="Product Name" />

              <input className="input" placeholder="Price" type="number" />

              <input className="input" placeholder="Stock" type="number" />

              <select className="input">
                <option>Cotton</option>
                <option>Silk</option>
              </select>

            </div>

            <div className="flex gap-3 mt-6">
              
              <button className="flex-1 border border-neutral-300 dark:border-neutral-700 rounded-lg py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-black dark:text-white">
                Cancel
              </button>

              <button className="flex-1 bg-black text-white dark:bg-white dark:text-black rounded-lg py-2 hover:bg-neutral-800 dark:hover:bg-neutral-200">
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
