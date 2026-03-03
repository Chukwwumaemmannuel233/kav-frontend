"use client";

import { useEffect, useState } from "react";
import SiteHeader from "../../components/site-header";
import { getProducts } from "@/lib/products.api";
import Link from "next/link";
import { Heart } from "lucide-react";
import API from "@/lib/api";
import { toast } from "sonner";
import FabricRequestModal from "../../components/FabricRequestModal"; // ✅ IMPORT MODAL

interface Product {
  id: string;
  name: string;
  yard_price: number;
  image_url: string;
  isFavorited?: boolean;
}

export default function FabricsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showCategories, setShowCategories] = useState(false);

  // ✅ ONLY THIS STATE NEEDED NOW
  const [open, setOpen] = useState(false);

  const LIMIT = 12;

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts({
        page,
        limit: LIMIT,
        search,
        category,
      });

      setProducts(
        data.products.map((p: any) => ({
          ...p,
          isFavorited: false,
        })),
      );
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH FAVORITES =================
  const fetchFavorites = async () => {
    try {
      const res = await API.get("/favorites");
      const favoriteIds = res.data.favorites.map((f: any) => f.id);

      setProducts((prev) =>
        prev.map((p) => ({
          ...p,
          isFavorited: favoriteIds.includes(p.id),
        })),
      );
    } catch (err) {
      console.error("Failed to fetch favorites");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, category]);

  useEffect(() => {
    if (products.length) fetchFavorites();
  }, [products.length]);

  // ================= FAVORITE =================
  const toggleFavorite = async (productId: string, currentStatus: boolean) => {
    try {
      setLoadingIds((prev) => [...prev, productId]);

      if (currentStatus) {
        await API.delete(`/favorites/${productId}`);
      } else {
        await API.post("/favorites", { productId });
      }

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, isFavorited: !currentStatus } : p,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle favorite");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  return (
    <>
      <SiteHeader variant="user" />

      <main className="px-6 md:px-16 py-10 pb-24">

        {/* FABRIC FINDER BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="bg-black text-white px-6 py-3 rounded-lg mb-6"
        >
          Can't find fabric? Send sample
        </button>

        {/* TITLE + SEARCH */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold">Fabrics</h1>

          {/* SEARCH */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search fabrics..."
              value={search}
              onFocus={() => setShowCategories(true)}
              onBlur={() => setTimeout(() => setShowCategories(false), 150)}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="border px-3 py-2 rounded-md w-full text-sm"
            />

            {showCategories && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-md z-20 mt-1">
                {["All", "Cotton", "Silk", "Linen"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat === "All" ? "" : cat.toLowerCase());
                      setSearch(cat === "All" ? "" : cat);
                      setPage(1);
                      setShowCategories(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-100"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PRODUCTS */}
        {loading ? (
          <div className="text-center py-20">Loading fabrics...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">No products found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="relative group">
                <button
                  onClick={() =>
                    toggleFavorite(product.id, product.isFavorited || false)
                  }
                  disabled={loadingIds.includes(product.id)}
                  className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow"
                >
                  <Heart
                    size={22}
                    className={
                      product.isFavorited
                        ? "fill-red-500 text-red-500"
                        : "text-neutral-600"
                    }
                  />
                </button>

                <Link href={`/pages/user/fabrics/${product.id}`}>
                  <div className="relative bg-neutral-100 rounded-lg aspect-square overflow-hidden mb-3 cursor-pointer">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                <h3 className="font-semibold text-sm">{product.name}</h3>
                <p className="text-neutral-600 text-sm">
                  ₦{Number(product.yard_price).toLocaleString()} / yard
                </p>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="border px-3 py-1.5 rounded text-sm disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="border px-3 py-1.5 rounded text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </main>

      {/* ✅ USE COMPONENT MODAL HERE */}
      <FabricRequestModal
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
