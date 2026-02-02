"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getNewArrivals } from "@/lib/products";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
  isFavorited?: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const router = useRouter();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const productsRef = useRef<Product[]>([]);

  /* ========================
     FETCH FAVORITES
  ======================== */
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!data.success) return;

      const favoriteIds = data.favorites.map((f: any) => f.id);

      productsRef.current = productsRef.current.map((p) => ({
        ...p,
        isFavorited: favoriteIds.includes(p.id),
      }));

      setProducts([...productsRef.current]);
    } catch (err) {
      console.error("Failed to fetch favorites");
    }
  };

  /* ========================
     FETCH NEW ARRIVALS
  ======================== */
  const fetchProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const data = await getNewArrivals(8, page);

      const uniqueNew = data.products
        .filter((p: Product) => !productsRef.current.some((x) => x.id === p.id))
        .map((p: Product) => ({
          ...p,
          isFavorited: false,
        }));

      if (uniqueNew.length === 0) {
        setHasMore(false);
      } else {
        productsRef.current = [...productsRef.current, ...uniqueNew];
        setProducts(productsRef.current);
        setPage((prev) => prev + 1);
        fetchFavorites(); // 🔥 sync favorites
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  /* ========================
     INITIAL FETCH
  ======================== */
  useEffect(() => {
    fetchProducts();
  }, []);

  /* ========================
     INFINITE SCROLL
  ======================== */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchProducts();
      },
      { rootMargin: "200px" }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchProducts]);

  /* ========================
     TOGGLE FAVORITE
  ======================== */
  const toggleFavorite = async (productId: number, currentStatus: boolean) => {
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

      productsRef.current = productsRef.current.map((p) =>
        p.id === productId ? { ...p, isFavorited: !currentStatus } : p
      );

      setProducts([...productsRef.current]);
    } catch (err) {
      console.error("Failed to toggle favorite");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">New Arrivals</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative border rounded-lg p-3 hover:shadow-md transition"
          >
            {/* ❤️ FAVORITE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(product.id, product.isFavorited || false);
              }}
              disabled={loadingIds.includes(product.id)}
              className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow hover:bg-neutral-100 transition disabled:opacity-50"
            >
              <Heart
                size={20}
                className={
                  product.isFavorited
                    ? "fill-red-500 text-red-500"
                    : "text-neutral-600"
                }
              />
            </button>

            {/* CARD CLICK */}
            <div
              onClick={() =>
                router.push(`/pages/user/fabrics/${product.id}`)
              }
              className="cursor-pointer"
            >
              <span className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded">
                NEW
              </span>

              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="h-40 w-full object-cover rounded"
              />

              <h3 className="mt-2 font-semibold truncate">
                {product.name}
              </h3>

              <p className="text-sm text-neutral-600 line-clamp-2">
                {product.description}
              </p>

              <p className="mt-1 font-semibold text-sm">
                ₦{Number(product.price || 0).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div ref={observerRef} className="mt-8 text-center">
          {loading && <p className="animate-pulse">Loading more…</p>}
        </div>
      )}

      {!hasMore && (
        <p className="mt-8 text-center text-neutral-500">
          You’ve reached the end 👋
        </p>
      )}
    </div>
  );
}
