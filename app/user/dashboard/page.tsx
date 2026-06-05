"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../components/site-header";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import API from "@/lib/api";

interface ApiProduct {
  id: number;
  name: string;
  price: number;
  image_url: string;
  isFavorited?: boolean;
}

interface Product {
  id: number;
  name: string;
  color: string;
  price: number;
  image: string;
}

interface RecommendedProduct {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

interface JournalPost {
  id: number;
  category: string;
  title: string;
  image: string;
}

interface FeaturedLookbook {
  id: number;
  title: string;
  subtitle?: string;
  image_urls: string[];
  link?: string;
}

export default function Dashboard() {
  const [newArrivals, setNewArrivals] = useState<ApiProduct[]>([]);
  const [loadingNewArrivals, setLoadingNewArrivals] = useState(true);
  const [navigating, setNavigating] = useState(false);

  const [featuredLookbook, setFeaturedLookbook] =
    useState<FeaturedLookbook | null>(null);
  const [loadingLookbook, setLoadingLookbook] = useState(true);
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>(
    [],
  );
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  const [recommendationReason, setRecommendationReason] = useState("");
  const [journalPosts, setJournalPosts] = useState<JournalPost[]>([]);
  const [loadingJournal, setLoadingJournal] = useState(true);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/user/profile");

        if (data?.user?.name) {
          setUserName(data.user.name);
        }
      } catch (error) {
        console.error("Failed to fetch user profile");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    API.get("/products/new-arrivals", { params: { limit: 4 } })
      .then((res) => {
        const products = (res.data.products || []).map((p: ApiProduct) => ({
          ...p,
          isFavorited: false,
        }));
        setNewArrivals(products);
        fetchFavorites(); // keep as-is
      })
      .catch(console.error)
      .finally(() => setLoadingNewArrivals(false));
  }, []);

  useEffect(() => {
    API.get("/lookbook/featured")
      .then((res) => {
        if (res.data.success && res.data.lookbook?.image_urls?.length) {
          setFeaturedLookbook(res.data.lookbook);
        } else {
          setFeaturedLookbook(null);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingLookbook(false));
  }, []);

  useEffect(() => {
    API.get("/recommendations")
      .then((res) => {
        if (res.data.success) {
          setRecommendations(res.data.products || []);
          setRecommendationReason(res.data.reason || "Just for you");
        }
      })
      .catch(() => {
        console.error("Failed to fetch recommendations");
      })
      .finally(() => setLoadingRecommendations(false));
  }, []);

  useEffect(() => {
    API.get("/journal", { params: { limit: 2 } })
      .then((res) => {
        if (res.data.success) {
          setJournalPosts(res.data.posts.slice(0, 2));
        }
      })
      .catch(console.error)
      .finally(() => setLoadingJournal(false));
  }, []);

  const [loadingFavIds, setLoadingFavIds] = useState<number[]>([]);

  const fetchFavorites = async () => {
    try {
      const res = await API.get("/favorites");
      const favIds = res.data.favorites.map((f: any) => f.id);

      setNewArrivals((prev) =>
        prev.map((p) => ({
          ...p,
          isFavorited: favIds.includes(p.id),
        })),
      );
    } catch (err) {
      console.error("Failed to fetch favorites");
    }
  };

  const toggleFavorite = async (productId: number, isFavorited: boolean) => {
    try {
      setLoadingFavIds((prev) => [...prev, productId]);

      if (isFavorited) {
        await API.delete(`/favorites/${productId}`);
      } else {
        await API.post(`/favorites`, { productId });
      }

      setNewArrivals((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, isFavorited: !isFavorited } : p,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle favorite");
    } finally {
      setLoadingFavIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader variant="user" />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 md:mb-16">
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 sm:p-8 lg:p-12 w-full border border-neutral-200 dark:border-neutral-700">
              <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-3">
                Member Exclusive
              </p>

              <h1 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-white sm:text-3xl lg:text-4xl xl:text-2xl">
                Welcome Back{userName ? `, ${userName}` : ""}
              </h1>

              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 sm:text-base lg:text-lg leading-relaxed max-w-2xl">
                Discover your curated style for today. Explore the latest
                additions to your favorite designers.
              </p>
            </div>
          </div>

          <div className="space-y-16">
            <section>
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                  New Arrivals
                </h2>
                <div className="flex items-center gap-3">
                  {navigating && (
                    <span className="text-sm text-neutral-500 animate-pulse">
                      Loading...
                    </span>
                  )}

                  <Link
                    href="/user/new-arrivals"
                    onClick={() => setNavigating(true)}
                    className="text-sm font-medium hover:underline"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                {loadingNewArrivals && <p>Loading new arrivals...</p>}

                {!loadingNewArrivals && newArrivals.length === 0 && (
                  <p>No new arrivals yet.</p>
                )}

                {newArrivals.map((product) => (
                  <div key={product.id} className="group relative">
                    <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-neutral-200 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(
                            product.id,
                            product.isFavorited || false,
                          );
                        }}
                        disabled={loadingFavIds.includes(product.id)}
                        className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow hover:bg-neutral-100 transition disabled:opacity-50"
                      >
                        <Heart
                          size={18}
                          className={
                            product.isFavorited
                              ? "fill-red-500 text-red-500"
                              : "text-neutral-600"
                          }
                        />
                      </button>
                      <Link href={`/user/fabrics/${product.id}`}>
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>

                      <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded">
                        NEW
                      </span>
                    </div>

                    <div className="mt-2 text-sm">
                      <h3 className="font-medium truncate">{product.name}</h3>
                      <p className="mt-1 font-medium">
                        ₦{Number(product.price || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              {loadingLookbook && (
                <div className="aspect-[16/9] rounded-lg bg-neutral-200 animate-pulse" />
              )}

              {!loadingLookbook && featuredLookbook && (
                <Link href={featuredLookbook.link || "#"} className="block">
                  <div className="relative overflow-hidden rounded-lg">
                    <div className="flex w-max animate-scroll-lookbook">
                      {[
                        ...featuredLookbook.image_urls,
                        ...featuredLookbook.image_urls,
                      ].map((img, index) => (
                        <div
                          key={index}
                          className="shrink-0 w-screen max-w-[1400px] aspect-[16/9] lg:aspect-[21/9]"
                        >
                          <img
                            src={img}
                            alt={featuredLookbook.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-10">
                      <p className="text-sm uppercase tracking-widest">
                        Featured Lookbook
                      </p>
                      <h3 className="mt-1 text-3xl font-bold sm:text-4xl">
                        {featuredLookbook.title}
                      </h3>
                      {featuredLookbook.subtitle && (
                        <p className="mt-1 text-sm">
                          {featuredLookbook.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              )}

              {!loadingLookbook && !featuredLookbook && (
                <p className="text-center text-neutral-500">
                  No featured lookbook yet.
                </p>
              )}
            </section>

            <section className="mt-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold sm:text-3xl">Just For You</h2>
                <p className="text-sm text-neutral-500">
                  {recommendationReason}
                </p>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {loadingRecommendations && <p>Loading recommendations...</p>}

                {!loadingRecommendations && recommendations.length === 0 && (
                  <p className="text-neutral-500">
                    No recommendations yet. Start exploring products.
                  </p>
                )}

                {recommendations.map((product) => (
                  <Link
                    key={product.id}
                    href={`/user/products/${product.id}`}
                    className="group flex min-w-[260px] items-center gap-4 rounded-xl 
        bg-neutral-100 dark:bg-neutral-800 p-4
        hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                  >
                    <div className="aspect-square w-16 flex-shrink-0 overflow-hidden rounded-md bg-neutral-200 dark:bg-neutral-700">
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium leading-tight group-hover:underline">
                        {product.name}
                      </h3>

                      <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        ₦{Number(product.price).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-2xl">
                  From the Journal
                </h2>
                <Link
                  href="/user/Journal"
                  className="text-sm font-medium hover:underline"
                >
                  Read All
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {journalPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/user/Journal/${post.id}`}
                    className="group"
                  >
                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-neutral-200">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm uppercase tracking-wider text-neutral-600">
                        {post.category}
                      </p>
                      <h3 className="mt-1 text-lg font-medium leading-tight group-hover:underline">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
