"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import SiteHeader from "../../components/site-header";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-context";
import API from "@/lib/api"; // use axios instance

interface FavoriteItem {
  id: string;
  name: string;
  description: string;
  image: string;
  isFavorited: boolean;
  price: number;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const { addToCart, items } = useCart();

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data } = await API.get("/favorites");
        if (data.success) {
          setFavorites(
            data.favorites.map((item: any) => ({
              id: item.id,
              name: item.name,
              description: item.description,
              image: item.image_url || "/placeholder.svg",
              price: item.price,
              isFavorited: true,
            }))
          );
        }
      } catch (err: any) {
        console.error("Failed to fetch favorites:", err);
        toast.error("Failed to load favorites.");
      }
    };

    fetchFavorites();
  }, []);

  // Toggle favorite
  const toggleFavorite = async (id: string) => {
    const item = favorites.find((f) => f.id === id);
    if (!item) return;

    setLoadingIds((prev) => [...prev, id]);

    try {
      if (item.isFavorited) {
        const { data } = await API.delete(`/favorites/${id}`);
        if (data.success) {
          setFavorites((prev) => prev.filter((f) => f.id !== id));
          toast.success("Removed from favorites.");
        }
      } else {
        const { data } = await API.post(`/favorites`, { productId: id });
        if (data.success) {
          setFavorites((prev) =>
            prev.map((f) =>
              f.id === id ? { ...f, isFavorited: true } : f
            )
          );
          toast.success("Added to favorites.");
        }
      }
    } catch (err: any) {
      console.error("Failed to toggle favorite:", err);
      toast.error("Could not update favorite.");
    } finally {
      setLoadingIds((prev) => prev.filter((i) => i !== id));
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <SiteHeader variant="user" />

      {/* Hero Section */}
      <section className="px-6 md:px-16 py-16 md:py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">My Favorites</h1>
      </section>

      {/* Favorites Grid */}
      <section className="px-6 md:px-16 py-12 pb-24">
        <div className="max-w-7xl mx-auto">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {favorites.map((item) => {
                const isInCart = items.some(
                  (cartItem) => cartItem.productId === Number(item.id)
                );

                return (
                  <div key={item.id} className="group relative">
                    {/* Image */}
                    <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        disabled={loadingIds.includes(item.id)}
                        className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-neutral-100 transition-colors disabled:opacity-50"
                      >
                        <Heart
                          size={22}
                          className={`${
                            item.isFavorited
                              ? "fill-red-500 text-red-500"
                              : "text-neutral-400"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Info */}
                    <h3 className="font-semibold text-base md:text-lg mb-1 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-2">
                       ₦{Number(item.price).toLocaleString()} / yard
                    </p>

                    <Link
                      href={`/user/fabrics/${item.id}`}
                      className="text-sm text-neutral-600 hover:text-black transition-colors mb-3 inline-block"
                    >
                      View Details
                    </Link>

                    {/* Add to Cart */}
                    <Button
                      onClick={() => addToCart(Number(item.id), 1)}
                      disabled={isInCart}
                      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        isInCart
                          ? "bg-neutral-300 text-neutral-600 cursor-not-allowed"
                          : "bg-black text-white hover:bg-neutral-900"
                      }`}
                    >
                      {isInCart ? "In Cart" : "Add to Cart"}
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-neutral-600 text-lg mb-6">
                No favorite items yet
              </p>
              <Link href="/shop">
                <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-neutral-900 transition-colors">
                  Continue Shopping
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
