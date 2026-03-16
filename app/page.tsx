"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./components/ui/button";
import API from "@/lib/api";

export default function LandingPage() {
  const router = useRouter();
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [journalPosts, setJournalPosts] = useState<any[]>([]);
  const [loadingNewArrivals, setLoadingNewArrivals] = useState(true);

  useEffect(() => {
    fetchNewArrivals();
    fetchRecommended();
    fetchJournalPosts();
  }, []);

  const fetchJournalPosts = async () => {
    try {
      const res = await API.get("/journal", { params: { limit: 2 } });
      setJournalPosts(res.data.posts || []); // adjust based on your API response
    } catch (err) {
      console.error("Failed to fetch journal posts", err);
    }
  };

  // Fetch New Arrivals
  const fetchNewArrivals = async () => {
    try {
      setLoadingNewArrivals(true);

      const res = await API.get("/products/new-arrivals", {
        params: { limit: 4 },
      });

      setNewArrivals(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch new arrivals", err);
    } finally {
      setLoadingNewArrivals(false);
    }
  };

  // Fetch Recommended Products
  const fetchRecommended = async () => {
    try {
      const res = await API.get("/products", { params: { limit: 6 } });
      setRecommended(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch recommended products", err);
    }
  };

  // Helper to format price safely
  const formatPrice = (price: number | string) => {
    if (!price) return "N/A";
    return typeof price === "number"
      ? `₦${price.toLocaleString()}`
      : `₦${price}`;
  };

  return (
    <main className="bg-background">
      {/* HEADER */}
      <header className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold">
          <Link href="/" className="hover:opacity-80 transition">
            <Image
              src="/images/logo1.png"
              alt="Fabric Logo"
              width={200}
              height={10}
              className="w-15 h-auto h-8 dark:invert"
            />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/auth/signup")}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            Join Now
          </button>

          <Button
            onClick={() => router.push("/auth/login")}
           className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-black dark:hover:bg-neutral-200 transition-colors"
          >
            Login
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
          Discover Timeless Luxury
        </h1>
        <p className="text-lg max-w-xl mx-auto md:mx-0">
          Curated fashion, modern silhouettes, and premium craftsmanship
          designed for the modern wardrobe.
        </p>

        <div className="mt-6 flex justify-center md:justify-start gap-4">
          <Button
            onClick={() => router.push("/auth/login")}
            className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-black dark:hover:bg-neutral-200 transition-colors"
          >
            Explore Profile
          </Button>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between mb-8">
          <h2 className="text-2xl font-bold">New Arrivals</h2>
          <Link href="/auth/login" className="text-primary font-semibold">
            View All →
          </Link>
        </div>

        {loadingNewArrivals && (
          <p className="text-neutral-500">Loading new arrivals...</p>
        )}

        {!loadingNewArrivals && newArrivals.length === 0 && (
          <p className="text-neutral-500">No new arrivals yet.</p>
        )}

        {!loadingNewArrivals && newArrivals.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <Link key={product.id} href={`/auth/login`}>
                <div className="group cursor-pointer transition-transform hover:scale-105">
                  <div className="aspect-[3/4] bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={product.image_url || "/images/placeholder.jpg"}
                      alt={product.name}
                      width={400}
                      height={500}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <h4 className="font-semibold text-sm">{product.name}</h4>
                  <p className="text-neutral-500 text-sm">
                    ₦{Number(product.price).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* FULL WIDTH BANNER */}
      <section className="relative h-[420px] w-full overflow-hidden">
        <Image
          src="/images/blush-silk-dupioni-fabric.jpg"
          alt="collection"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-white text-4xl md:text-6xl font-light mb-4">
            The Sculpture Series
          </h2>
          <p className="text-white/90 max-w-xl mb-6">
            Architectural lines meet fluid textures in our most ambitious
            collection yet.
          </p>
          <Link
            href="/auth/login"
            className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition"
          >
            Shop Collection
          </Link>
        </div>
      </section>

      {/* RECOMMENDED PRODUCTS */}
      <section className="max-w-7xl mx-auto py-16">
        <div className="px-6 mb-8">
          <h2 className="text-2xl font-bold">Recommended For You</h2>
        </div>

        <div className="flex gap-6 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-hide">
          {recommended.map((product) => (
            <Link key={product.id} href={`/auth/login`}>
              <div className="snap-start min-w-[220px] flex-shrink-0 transition-transform hover:scale-105">
                <div className="aspect-square rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 mb-4">
                  <Image
                    src={product.image_url || "/images/placeholder.jpg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="text-center">
                  <h4 className="font-semibold text-sm">{product.name}</h4>
                  <p className="text-primary font-bold">
                    ₦{Number(product.yard_price).toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* JOURNAL */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold mb-8">Trending in the Journal</h2>

        <div className="grid md:grid-cols-2 gap-10">
          {journalPosts.map((post) => (
            <article key={post.id} className="space-y-4">
              <Link href={`/auth/login`}>
                <div className="aspect-video rounded-xl overflow-hidden bg-neutral-200 cursor-pointer">
                  <Image
                    src={post.image || "/images/placeholder.jpg"}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
              </Link>

              <span className="text-xs uppercase text-primary font-bold tracking-widest">
                {post.category || "Style Report"}
              </span>

              <h3 className="text-xl font-bold">{post.title}</h3>

              <p className="text-neutral-500">
                {post.excerpt ||
                  "Read our latest fashion insights and style tips."}
              </p>

              <Link
                href={`/auth/login`}
                className="font-semibold border-b border-black dark:border-white"
              >
                Read More
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
