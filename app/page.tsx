"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Menu,
  Ruler,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import API from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

type Product = {
  id: string | number;
  name: string;
  price?: number | string;
  yard_price?: number | string;
  image_url?: string;
  category?: string;
};

type JournalPost = {
  id: string | number;
  title: string;
  excerpt?: string;
  category?: string;
  image?: string;
};

const heroSlides = [
  {
    title: "Premium fabrics for intentional design.",
    text: "Source refined textiles, dependable yardage, and custom support for fashion, interiors, and special projects.",
    image: "/images/luxury-fabric-textile-close-up-neutral-beige-woven.jpg",
  },
  {
    title: "Textures that make every piece feel considered.",
    text: "From linen blends to silk charmeuse, discover materials selected for drape, finish, and everyday elegance.",
    image: "/images/fabric-weaving-texture.jpg",
  },
  {
    title: "Find the fabric, match the mood, start the work.",
    text: "Explore new arrivals, request hard-to-find textiles, and build your next collection with confidence.",
    image: "/images/fabric-draping-form-art.jpg",
  },
];

const curatedProducts: Product[] = [
  {
    id: "curated-linen",
    name: "Belgian Linen",
    price: 18500,
    yard_price: 18500,
    category: "Linen",
    image_url: "/images/belgian-linen-fabric.jpg",
  },
  {
    id: "curated-silk",
    name: "Ivory Silk Charmeuse",
    price: 32000,
    yard_price: 32000,
    category: "Silk",
    image_url: "/images/ivory-silk-charmeuse-fabric.jpg",
  },
  {
    id: "curated-hemp",
    name: "Olive Hemp Canvas",
    price: 14500,
    yard_price: 14500,
    category: "Canvas",
    image_url: "/images/olive-green-hemp-canvas-fabric.jpg",
  },
  {
    id: "curated-wool",
    name: "Heather Grey Wool Tweed",
    price: 27000,
    yard_price: 27000,
    category: "Wool",
    image_url: "/images/heather-grey-wool-tweed-fabric.jpg",
  },
  {
    id: "curated-tencel",
    name: "Tencel Twill",
    price: 16500,
    yard_price: 16500,
    category: "Twill",
    image_url: "/images/tencel-twill-fabric.jpg",
  },
  {
    id: "curated-velvet",
    name: "Deep Navy Velvet",
    price: 24500,
    yard_price: 24500,
    category: "Velvet",
    image_url: "/images/deep-navy-velvet-fabric.jpg",
  },
];

const journalFallback: JournalPost[] = [
  {
    id: "journal-drape",
    title: "How to choose fabric by drape, not just color",
    excerpt: "A practical guide to matching textile movement with the garment or space you want to create.",
    category: "Fabric Notes",
    image: "/images/designer-woman-working.jpg",
  },
  {
    id: "journal-natural",
    title: "Why natural fibers still feel unmistakably premium",
    excerpt: "Cotton, linen, silk, wool, and hemp each bring a different kind of structure and softness.",
    category: "Material Guide",
    image: "/images/natural-fibers-linen-cotton.jpg",
  },
];

const trustItems = [
  { icon: ShieldCheck, title: "Quality checked", text: "Curated textures, weight, and finish." },
  { icon: Truck, title: "Reliable delivery", text: "Clear fulfillment for local orders." },
  { icon: Ruler, title: "Sold by the yard", text: "Order only what your project needs." },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/Guest/shop" },
  { label: "About", href: "/Guest/About" },
];

function formatPrice(value?: number | string) {
  if (!value) return "Price on request";
  const amount = Number(value);
  return Number.isNaN(amount) ? `NGN ${value}` : `NGN ${amount.toLocaleString()}`;
}

function productImage(product: Product, fallbackIndex = 0) {
  return product.image_url || curatedProducts[fallbackIndex % curatedProducts.length].image_url || "/images/belgian-linen-fabric.jpg";
}

export default function LandingPage() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [journalPosts, setJournalPosts] = useState<JournalPost[]>([]);
  const [loadingNewArrivals, setLoadingNewArrivals] = useState(true);
  const [index, setIndex] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [sourcingImage, setSourcingImage] = useState<File | null>(null);
  const [submittingSourcing, setSubmittingSourcing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const displayNewArrivals = useMemo(
    () => (newArrivals.length ? newArrivals.slice(0, 4) : curatedProducts.slice(0, 4)),
    [newArrivals]
  );

  const displayRecommended = useMemo(
    () => (recommended.length ? recommended.slice(0, 8) : curatedProducts),
    [recommended]
  );

  const displayJournal = useMemo(
    () => (journalPosts.length ? journalPosts.slice(0, 2) : journalFallback),
    [journalPosts]
  );

  useEffect(() => {
    fetchNewArrivals();
    fetchRecommended();
    fetchJournalPosts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  const fetchJournalPosts = async () => {
    try {
      const res = await API.get("/journal", { params: { limit: 2 } });
      setJournalPosts(res.data.posts || []);
    } catch (err) {
      console.error("Failed to fetch journal posts", err);
    }
  };

  const fetchNewArrivals = async () => {
    try {
      setLoadingNewArrivals(true);
      const res = await API.get("/products/new-arrivals", { params: { limit: 4 } });
      setNewArrivals(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch new arrivals", err);
    } finally {
      setLoadingNewArrivals(false);
    }
  };

  const fetchRecommended = async () => {
    try {
      const res = await API.get("/products", { params: { limit: 8 } });
      setRecommended(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch recommended products", err);
    }
  };

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const handlePointerMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    });
  };

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#171412] transition-colors dark:bg-neutral-950 dark:text-neutral-100">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#fbfaf7]/92 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-neutral-950/92">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6">
          <Link href="/" className="flex items-center">
            <Image src="/images/logo1.png" alt="KAV Textile" width={180} height={44} className="h-8 w-auto object-contain dark:brightness-0 dark:invert sm:h-9" priority />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#514942] dark:text-neutral-300 md:flex">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-[#171412] dark:hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.push("/auth/login")}
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[#514942] transition hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10 sm:inline-flex"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/auth/signup")}
              className="hidden rounded-full bg-[#171412] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2a241f] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 sm:inline-flex"
            >
              Join Now
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 text-[#171412] transition hover:bg-black hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white dark:hover:text-neutral-950 md:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="border-t border-black/10 bg-[#fbfaf7]/98 px-4 py-4 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-neutral-950/98 md:hidden"
            >
              <nav className="grid gap-2 text-sm font-semibold text-[#514942] dark:text-neutral-200">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3 transition hover:bg-black hover:text-white dark:border-white/10 dark:bg-white/8 dark:hover:bg-white dark:hover:text-neutral-950"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/auth/login");
                  }}
                  className="rounded-full border border-black/10 px-4 py-3 text-sm font-bold dark:border-white/10"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/auth/signup");
                  }}
                  className="rounded-full bg-[#171412] px-4 py-3 text-sm font-bold text-white dark:bg-white dark:text-neutral-950"
                >
                  Join Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section
        onMouseMove={handlePointerMove}
        className="relative isolate min-h-[calc(100svh-6.6rem)] overflow-hidden bg-[#181512] text-white sm:min-h-[calc(100vh-5rem)]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={heroSlides[index].image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{
                transform: `translate3d(${pointer.x * -18}px, ${pointer.y * -12}px, 0) scale(1.06)`,
              }}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,12,10,0.78),rgba(15,12,10,0.72),rgba(15,12,10,0.56))] sm:bg-[linear-gradient(90deg,rgba(15,12,10,0.92),rgba(15,12,10,0.62),rgba(15,12,10,0.24))]" />

        <div className="relative z-10 mx-auto grid min-h-[calc(100svh-6.6rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:min-h-[calc(100vh-5rem)] sm:px-6 sm:py-14 lg:grid-cols-[1fr_0.85fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur sm:mb-6 sm:px-4 sm:text-xs sm:tracking-[0.22em]">
              <Sparkles size={14} />
              Textile sourcing studio
            </div>
            <h1 className="max-w-4xl text-[2.7rem] font-semibold leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-7xl">
              {heroSlides[index].title}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/78 sm:mt-6 sm:text-lg sm:leading-8">
              {heroSlides[index].text}
            </p>
            <div className="mt-8 grid gap-3 sm:mt-9 sm:flex sm:flex-row">
              <button
                onClick={() => router.push("/auth/signup")}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#171412] transition hover:bg-[#f0e7da]"
              >
                Start Sourcing
                <ArrowRight size={17} />
              </button>
              <Link
                href="/Guest/shop"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Explore Fabrics
              </Link>
            </div>
          </motion.div>

          <div className="relative hidden min-h-[560px] perspective-[1200px] lg:block">
            {curatedProducts.slice(0, 3).map((item, cardIndex) => (
              <motion.div
                key={item.id}
                animate={{ y: [0, cardIndex % 2 ? -16 : 16, 0] }}
                transition={{ duration: 6 + cardIndex, repeat: Infinity, ease: "easeInOut" }}
                className="absolute overflow-hidden rounded-[2rem] border border-white/18 bg-white/10 shadow-2xl shadow-black/40 backdrop-blur"
                style={{
                  width: cardIndex === 0 ? 260 : 220,
                  height: cardIndex === 0 ? 360 : 300,
                  right: cardIndex === 0 ? 120 : cardIndex === 1 ? 0 : 250,
                  top: cardIndex === 0 ? 60 : cardIndex === 1 ? 190 : 250,
                  transform: `translate3d(${pointer.x * (cardIndex + 1) * 18}px, ${pointer.y * (cardIndex + 1) * 14}px, 0) rotateY(${pointer.x * 14}deg) rotateX(${pointer.y * -10}deg) rotate(${cardIndex === 1 ? 8 : cardIndex === 2 ? -10 : 0}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <Image src={item.image_url || ""} alt={item.name} fill sizes="260px" className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">{item.category}</p>
                  <h3 className="mt-1 font-semibold text-white">{item.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white transition-colors dark:border-white/10 dark:bg-neutral-900">
        <div className="mx-auto grid max-w-7xl gap-0 px-4 sm:px-6 md:grid-cols-3">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-4 border-black/10 py-6 md:border-r md:py-7 md:last:border-r-0 dark:border-white/10">
                <span className="rounded-full bg-[#f3ebe1] p-3 text-[#8e4f25] dark:bg-white/10 dark:text-[#e4b989]">
                  <Icon size={20} />
                </span>
                <div>
                  <h2 className="font-semibold text-[#171412] dark:text-white">{item.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-[#70665d] dark:text-neutral-400">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="new-arrivals" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#9c653d] dark:text-[#e4b989]">Fresh yardage</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">New Arrivals</h2>
          </div>
          <Link href="/Guest/shop" className="inline-flex items-center gap-2 text-sm font-bold text-[#171412] dark:text-white">
            View all fabrics
            <ArrowRight size={16} />
          </Link>
        </div>

        {loadingNewArrivals && !newArrivals.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-[280px] animate-pulse rounded-2xl bg-black/5 dark:bg-white/10 sm:h-[360px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {displayNewArrivals.map((product, itemIndex) => (
              <Link key={product.id} href="/auth/login" className="group">
                <article className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-neutral-900 dark:shadow-black/20">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#ede6de]">
                    <Image
                      src={productImage(product, itemIndex)}
                      alt={product.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/88 px-3 py-1 text-[11px] font-bold text-[#171412] backdrop-blur sm:left-4 sm:top-4 sm:text-xs">New</span>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="min-h-10 text-sm font-semibold leading-5 sm:text-base">{product.name}</h3>
                    <p className="mt-3 text-xs font-bold sm:text-sm">{formatPrice(product.price || product.yard_price)} / yard</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section id="sourcing" className="relative overflow-hidden bg-[#171412] py-14 text-white sm:py-20">
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/thread-and-yarn-shelves.jpg" alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:gap-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#e4b989]">Personal sourcing</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">Need a specific fabric?</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
              Send a simple request and the team can help confirm availability, suggest close alternatives, and guide you toward the right yardage.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["01", "Describe the fabric"],
                ["02", "Share quantity or use"],
                ["03", "Get guided options"],
              ].map(([number, title]) => (
                <div key={number} className="rounded-2xl border border-white/14 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-bold text-[#e4b989]">{number}</p>
                  <p className="mt-3 text-sm font-semibold leading-6">{title}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-[#171412] transition hover:bg-[#f0e7da]"
              >
                Request Sourcing
              </button>
              <Link
                href="/Guest/shop"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/24 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Browse Available Fabrics
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotateX: 10, y: 35 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative min-h-[360px] overflow-hidden rounded-[1.4rem] border border-white/14 bg-[#241f1b] shadow-2xl sm:min-h-[470px] sm:rounded-[2rem]"
          >
            <Image src="/images/fabric-weaving-process-hands.jpg" alt="Fabric sourcing process" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/18 to-transparent" />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/16 bg-black/48 p-4 backdrop-blur sm:inset-x-5 sm:bottom-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/58">Sourcing support</p>
              <p className="mt-2 text-lg font-semibold">Human guidance for rare textures, bulk needs, and close alternatives.</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-white/72">
                <span className="rounded-full bg-white/10 px-3 py-2">Texture</span>
                <span className="rounded-full bg-white/10 px-3 py-2">Color</span>
                <span className="rounded-full bg-white/10 px-3 py-2">Yardage</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#9c653d] dark:text-[#e4b989]">In demand</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">Currently Selling</h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => scroll("left")} className="rounded-full border border-black/10 bg-white p-3 transition hover:bg-black hover:text-white dark:border-white/10 dark:bg-neutral-900 dark:hover:bg-white dark:hover:text-neutral-950" aria-label="Scroll left">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll("right")} className="rounded-full border border-black/10 bg-white p-3 transition hover:bg-black hover:text-white dark:border-white/10 dark:bg-neutral-900 dark:hover:bg-white dark:hover:text-neutral-950" aria-label="Scroll right">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide sm:gap-5">
          {displayRecommended.map((product, itemIndex) => (
            <Link key={product.id} href="/auth/login" className="group min-w-[72vw] snap-start sm:min-w-[240px]">
              <article className="relative overflow-hidden rounded-2xl bg-[#ede6de] dark:bg-neutral-900">
                <div className="relative aspect-square overflow-hidden">
                  <Image src={productImage(product, itemIndex)} alt={product.name} fill sizes="260px" className="object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="bg-white p-4 dark:bg-neutral-900">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="mt-3 text-sm font-bold">{formatPrice(product.price || product.yard_price)} / yard</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <section id="journal" className="bg-white py-14 transition-colors dark:bg-neutral-900 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-9 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#9c653d] dark:text-[#e4b989]">Journal</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">Material notes and styling ideas</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {displayJournal.map((post) => (
              <article key={post.id} className="group grid overflow-hidden rounded-2xl border border-black/10 bg-[#fbfaf7] shadow-sm dark:border-white/10 dark:bg-neutral-950 md:grid-cols-[0.9fr_1fr]">
                <Link href="/auth/login" className="relative min-h-[220px] overflow-hidden sm:min-h-[260px]">
                  <Image src={post.image || "/images/designer-woman-working.jpg"} alt={post.title} fill sizes="(min-width: 768px) 35vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                </Link>
                <div className="p-5 sm:p-6">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#9c653d] dark:text-[#e4b989]">{post.category || "Style Report"}</span>
                  <h3 className="mt-4 text-xl font-semibold leading-tight sm:text-2xl">{post.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#70665d] dark:text-neutral-400 sm:text-base">{post.excerpt || "Read our latest fabric insights and sourcing notes."}</p>
                  <Link href="/auth/login" className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
                    Read More
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#171412] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Image src="/images/logo1.png" alt="KAV Textile" width={170} height={44} className="h-9 w-auto object-contain brightness-0 invert" />
            <p className="mt-5 max-w-md leading-7 text-white/64">
              Quality fabrics for designers, makers, decorators, and fabric lovers who care about finish, feel, and detail.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Explore</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/64">
              <Link href="/Guest/shop" className="hover:text-white">Shop fabrics</Link>
              <Link href="/Guest/About" className="hover:text-white">About</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Support</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/64">
              <Link href="/user/shipping-info" className="hover:text-white">Shipping info</Link>
            </div>
          </div>
        </div>
      </footer>

      {showModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-4" onClick={() => setShowModal(false)}>
          <form
            onClick={(event) => event.stopPropagation()}
            onSubmit={async (event) => {
              event.preventDefault();
              if (!name.trim() || !phone.trim()) {
                toast.error("Please enter your name and WhatsApp number");
                return;
              }

              try {
                setSubmittingSourcing(true);
                const formData = new FormData();
                formData.append("name", name.trim());
                formData.append("whatsapp", phone.trim());
                if (note.trim()) formData.append("note", note.trim());
                if (sourcingImage) formData.append("image", sourcingImage);

                await API.post("/sourcing-requests", formData, {
                  headers: { "Content-Type": "multipart/form-data" },
                });

                toast.success("Request submitted successfully");
                setName("");
                setPhone("");
                setNote("");
                setSourcingImage(null);
                setShowModal(false);
              } catch (err) {
                console.error("Failed to submit sourcing request", err);
                toast.error("Could not submit your request. Please try again.");
              } finally {
                setSubmittingSourcing(false);
              }
            }}
            className="relative w-full max-w-md rounded-2xl bg-white p-5 text-[#171412] shadow-2xl dark:bg-neutral-950 dark:text-white sm:p-6"
          >
            <button type="button" onClick={() => setShowModal(false)} className="absolute right-4 top-4 rounded-full p-2 hover:bg-black/5" aria-label="Close request form">
              <X size={18} />
            </button>
            <h3 className="pr-10 text-2xl font-semibold">Request custom sourcing</h3>
            <p className="mt-3 text-sm leading-6 text-[#70665d] dark:text-neutral-400">
              Leave your details and the team will help source the fabric or recommend the closest available option.
            </p>
            <div className="mt-6 space-y-3">
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[#171412] outline-none transition focus:border-[#9c653d] dark:border-white/10 dark:bg-neutral-900 dark:text-white"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <input
                type="tel"
                placeholder="WhatsApp number"
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[#171412] outline-none transition focus:border-[#9c653d] dark:border-white/10 dark:bg-neutral-900 dark:text-white"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
              <textarea
                placeholder="What fabric are you looking for? Color, texture, quantity, or deadline"
                rows={4}
                className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-[#171412] outline-none transition focus:border-[#9c653d] dark:border-white/10 dark:bg-neutral-900 dark:text-white"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
              <label className="block rounded-xl border border-dashed border-black/20 bg-black/[0.02] px-4 py-3 text-sm text-[#70665d] transition hover:border-[#9c653d] dark:border-white/15 dark:bg-white/5 dark:text-neutral-300">
                <span className="font-semibold text-[#171412] dark:text-white">Upload reference image</span>
                <span className="mt-1 block text-xs">{sourcingImage ? sourcingImage.name : "Optional JPG, PNG, or WEBP sample"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => setSourcingImage(event.target.files?.[0] || null)}
                />
              </label>
              <button
                type="submit"
                disabled={submittingSourcing}
                className="w-full rounded-full bg-[#171412] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2a241f] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                {submittingSourcing ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
