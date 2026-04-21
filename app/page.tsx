"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./components/ui/button";
import API from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const slides = [
  {
    title: "Discover Timeless Luxury",
    text: "Curated fashion, modern silhouettes, and premium craftsmanship.",
    image: "/images/raw-denim-fabric.jpg",
  },
  {
    title: "Elegance Redefined",
    text: "Experience fashion that blends tradition with modern design.",
    image: "/images/natural-linen-blend-fabric.jpg",
  },
  {
    title: "Crafted for You",
    text: "Premium materials tailored for comfort and style.",
    image: "/images/tencel-twill-fabric.jpg",
  },
  {
    title: "Style Meets Identity",
    text: "Express yourself through bold and timeless fashion.",
    image: "/images/belgian-linen-fabric.jpg",
  },
  {
    title: "Luxury That Lasts",
    text: "Designed to stand the test of time.",
    image: "/images/charcoal-wool-felt-fabric.jpg",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [journalPosts, setJournalPosts] = useState<any[]>([]);
  const [loadingNewArrivals, setLoadingNewArrivals] = useState(true);
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    fetchNewArrivals();
    fetchRecommended();
    fetchJournalPosts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // change every 5s

    return () => clearInterval(interval);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = 250;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFindFabric = async () => {
    if (!image) {
      toast.error("Upload a fabric image first");
      return;
    }

    // 🔥 TEMP LOGIC (replace with API later)
    const hasMatch = Math.random() > 0.5;

    if (!hasMatch) {
      toast.error("No matching fabric found");
      setShowModal(true);
    } else {
      toast.success("Matching fabrics found");
    }
  };

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
      <header className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between sticky top-0 z-40 bg-background border-b border-neutral-600">
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
      <section className="relative h-[80vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <img
              src={slides[index].image}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center px-6">
              <div className="max-w-xl text-left">
                <h2 className="text-3xl md:text-3xl font-bold tracking-tight mb-4">
                  {slides[index].title}
                </h2>

                <p className="text-lg mb-6 text-neutral-700 dark:text-neutral-300">
                  {slides[index].text}
                </p>

                <button
                  onClick={() => router.push("/auth/login")}
                  className="bg-neutral-900 text-white px-6 py-2 rounded-lg hover:bg-neutral-800 dark:bg-neutral-100 dark:text-black"
                >
                  Explore Profile
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
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
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <span className="text-sm uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Smart Tool
          </span>

          <h2 className="text-3xl md:text-5xl font-semibold text-neutral-900 dark:text-white">
            Fabric Finder
          </h2>

          <p className="text-neutral-600 dark:text-neutral-300 max-w-md">
            Upload a fabric image and we’ll help you find the closest match
            instantly.
          </p>

          {/* UPLOAD */}
          <div className="space-y-4 pt-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-transparent file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-neutral-900 file:text-white file:rounded-md"
            />

            <button
              onClick={handleFindFabric}
              className="w-full bg-neutral-900 text-white py-3 rounded-lg hover:bg-neutral-800 dark:bg-white dark:text-black transition"
            >
              Find Fabric
            </button>
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative h-[320px] md:h-[380px] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
        >
          {preview ? (
            <Image src={preview} alt="preview" fill className="object-cover" />
          ) : (
            <span className="text-neutral-500 text-sm">
              Image preview will appear here
            </span>
          )}

          {preview && (
            <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-black/60 px-4 py-2 rounded-lg text-sm">
              Your Uploaded Fabric
            </div>
          )}
        </motion.div>

        {/* MODAL */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)} // click outside closes
          >
            <form
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
              onSubmit={(e) => {
                e.preventDefault();

                if (!name.trim() || !phone.trim()) {
                  toast.error("Please fill all fields");
                  return;
                }

                // success
                toast.success("Request submitted successfully!");

                setName("");
                setPhone("");
                setShowModal(false);
              }}
              className="bg-white dark:bg-neutral-900 p-6 rounded-xl w-full max-w-md space-y-4 relative"
            >
              {/* CLOSE BUTTON */}
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-lg"
              >
                ✕
              </button>

              <h3 className="text-xl font-semibold">Didn’t find a match?</h3>

              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Drop your details and we’ll help you source your perfect
                textile.
              </p>

              {/* NAME */}
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 border rounded-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* PHONE */}
              <input
                type="tel"
                placeholder="WhatsApp Number (e.g. 08012345678)"
                className="w-full px-4 py-3 border rounded-lg"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg"
              >
                Submit Request
              </button>
            </form>
          </div>
        )}
      </section>

      {/* RECOMMENDED PRODUCTS */}
      <section className="max-w-7xl mx-auto py-16 relative">
        <div className="px-6 mb-8">
          <h2 className="text-2xl font-bold">Currently Selling</h2>
        </div>

        {/* LEFT ARROW */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/60 p-2 rounded-full shadow hover:scale-110 transition"
        >
          ←
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/60 p-2 rounded-full shadow hover:scale-110 transition"
        >
          →
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-hide"
        >
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
