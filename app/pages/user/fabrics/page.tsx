"use client";

import { useEffect, useState } from "react";
import SiteHeader from "../../../components/site-header";
import { getProducts } from "@/lib/products.api";
import Link from "next/link";
import { Heart } from "lucide-react";

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

  const LIMIT = 12;
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch products
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
        }))
      );
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorites
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        const favoriteIds = data.favorites.map((f: any) => f.id);
        setProducts((prev) =>
          prev.map((p) => ({
            ...p,
            isFavorited: favoriteIds.includes(p.id),
          }))
        );
      }
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

  // Toggle favorite
  const toggleFavorite = async (productId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoadingIds((prev) => [...prev, productId]);

      await fetch(
        currentStatus
          ? `${API_BASE}/favorites/${productId}`
          : `${API_BASE}/favorites`,
        {
          method: currentStatus ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: currentStatus ? null : JSON.stringify({ productId }),
        }
      );

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, isFavorited: !currentStatus } : p
        )
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
        {/* TITLE + SEARCH */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold">Fabrics</h1>

          {/* SEARCH + CATEGORY DROPDOWN */}
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

        {/* PRODUCTS GRID */}
        {loading ? (
          <div className="text-center py-20">Loading fabrics...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">No products found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="relative group">
                {/* Favorite button */}
                <button
                  onClick={() =>
                    toggleFavorite(product.id, product.isFavorited || false)
                  }
                  disabled={loadingIds.includes(product.id)}
                  className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow hover:bg-neutral-100 transition disabled:opacity-50"
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

                {/* IMAGE LINK */}
                <Link href={`/pages/user/fabrics/${product.id}`}>
                  <div className="relative bg-neutral-100 rounded-lg aspect-square overflow-hidden mb-3 cursor-pointer group">
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        View Product
                      </span>
                    </div>

                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <h3 className="font-semibold text-sm">{product.name}</h3>
                <p className="text-neutral-600 text-sm">
                ₦{product.yard_price} / yard
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
    </>
  );
}
