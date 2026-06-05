"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Menu,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import API from "@/lib/api";

type Product = {
  id: number | string;
  name: string;
  price?: number | string;
  yard_price?: number | string;
  image_url?: string;
  category?: string;
  material?: string;
  color?: string;
  description?: string;
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/Guest/shop" },
  { label: "About", href: "/Guest/About" },
];

const fallbackProducts: Product[] = [
  {
    id: "fallback-linen",
    name: "Belgian Linen",
    price: 18500,
    yard_price: 18500,
    category: "Linen",
    material: "Linen",
    color: "Natural",
    image_url: "/images/belgian-linen-fabric.jpg",
  },
  {
    id: "fallback-silk",
    name: "Ivory Silk Charmeuse",
    price: 32000,
    yard_price: 32000,
    category: "Silk",
    material: "Silk",
    color: "Ivory",
    image_url: "/images/ivory-silk-charmeuse-fabric.jpg",
  },
  {
    id: "fallback-twill",
    name: "Tencel Twill",
    price: 16500,
    yard_price: 16500,
    category: "Twill",
    material: "Tencel",
    color: "Slate",
    image_url: "/images/tencel-twill-fabric.jpg",
  },
  {
    id: "fallback-velvet",
    name: "Deep Navy Velvet",
    price: 24500,
    yard_price: 24500,
    category: "Velvet",
    material: "Velvet",
    color: "Navy",
    image_url: "/images/deep-navy-velvet-fabric.jpg",
  },
  {
    id: "fallback-hemp",
    name: "Olive Hemp Canvas",
    price: 14500,
    yard_price: 14500,
    category: "Canvas",
    material: "Hemp",
    color: "Olive",
    image_url: "/images/olive-green-hemp-canvas-fabric.jpg",
  },
  {
    id: "fallback-wool",
    name: "Heather Grey Wool Tweed",
    price: 27000,
    yard_price: 27000,
    category: "Wool",
    material: "Wool",
    color: "Grey",
    image_url: "/images/heather-grey-wool-tweed-fabric.jpg",
  },
];

function formatPrice(value?: number | string) {
  if (!value) return "Price on request";
  const amount = Number(value);
  return Number.isNaN(amount) ? `NGN ${value}` : `NGN ${amount.toLocaleString()}`;
}

function productImage(product: Product, index: number) {
  return product.image_url || fallbackProducts[index % fallbackProducts.length].image_url || "/images/belgian-linen-fabric.jpg";
}

export default function GuestShop() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products", { params: { limit: 60 } });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch guest products", err);
    } finally {
      setLoading(false);
    }
  };

  const displayProducts = products.length ? products : fallbackProducts;

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return [...displayProducts]
      .filter(
        (product) =>
          !query ||
          product.name?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          product.material?.toLowerCase().includes(query) ||
          product.color?.toLowerCase().includes(query)
      )
      .sort((a, b) => String(b.id).localeCompare(String(a.id), undefined, { numeric: true }));
  }, [displayProducts, searchTerm]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const resetSearch = () => {
    setSearchTerm("");
    setVisibleCount(12);
  };

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#171412] transition-colors dark:bg-neutral-950 dark:text-neutral-100">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#fbfaf7]/92 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/92">
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/auth/login")}
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[#514942] transition hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10 sm:inline-flex"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/auth/signup")}
              className="hidden rounded-full bg-[#171412] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2a241f] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 sm:inline-flex"
            >
              Join Now
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 transition hover:bg-black hover:text-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white dark:hover:text-neutral-950 md:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-black/10 bg-[#fbfaf7]/98 px-4 py-4 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-neutral-950/98 md:hidden">
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
              <button onClick={() => router.push("/auth/login")} className="rounded-full border border-black/10 px-4 py-3 text-sm font-bold dark:border-white/10">
                Login
              </button>
              <button onClick={() => router.push("/auth/signup")} className="rounded-full bg-[#171412] px-4 py-3 text-sm font-bold text-white dark:bg-white dark:text-neutral-950">
                Join Now
              </button>
            </div>
          </div>
        )}
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold sm:text-3xl">Fabrics</h1>
          <label className="flex h-11 w-[180px] items-center gap-2 rounded-full border border-black/10 bg-white px-4 dark:border-white/10 dark:bg-neutral-900 sm:w-[260px]">
            <Search size={16} className="shrink-0 text-[#9c653d] dark:text-[#e4b989]" />
            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setVisibleCount(12);
              }}
              placeholder="Search"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#8d8379] dark:placeholder:text-neutral-500"
            />
          </label>
        </div>

        {loading && !products.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-[280px] animate-pulse rounded-2xl bg-black/5 dark:bg-white/10 sm:h-[360px]" />
            ))}
          </div>
        ) : visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {visibleProducts.map((product, index) => (
              <Link key={product.id} href="/auth/login" className="group">
                <article className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-neutral-900">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#ede6de] dark:bg-neutral-800">
                    <Image
                      src={productImage(product, index)}
                      alt={product.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="min-h-10 text-sm font-semibold leading-5 sm:text-base">{product.name}</h3>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <p className="text-xs font-bold sm:text-sm">{formatPrice(product.price || product.yard_price)} / yard</p>
                      <ArrowRight size={15} className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-black/10 bg-white p-8 text-center dark:border-white/10 dark:bg-neutral-900">
            <ShieldCheck className="mx-auto text-[#9c653d] dark:text-[#e4b989]" size={30} />
            <h3 className="mt-4 text-xl font-semibold">No fabrics found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#70665d] dark:text-neutral-400">
              Try another search.
            </p>
            <button onClick={resetSearch} className="mt-5 rounded-full bg-[#171412] px-5 py-3 text-sm font-bold text-white dark:bg-white dark:text-neutral-950">
              Clear search
            </button>
          </div>
        )}

        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisibleCount((count) => count + 8)}
              className="rounded-full border border-black/10 bg-white px-8 py-3 text-sm font-bold transition hover:bg-black hover:text-white dark:border-white/10 dark:bg-neutral-900 dark:hover:bg-white dark:hover:text-neutral-950"
            >
              Load more fabrics
            </button>
          </div>
        )}
      </section>

    </main>
  );
}
